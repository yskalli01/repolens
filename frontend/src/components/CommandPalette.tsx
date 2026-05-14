"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useRouter } from "next/navigation";

type CommandPaletteAction = {
  label: string;
  description?: string;
  shortcut?: string;
  href?: string;
  disabled?: boolean;
  action?: () => void | Promise<void>;
};

type CommandPaletteProps = {
  actions?: CommandPaletteAction[];
};

const defaultActions: CommandPaletteAction[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Reports", href: "/reports" },
  { label: "Scheduled", href: "/scheduled" },
  { label: "Notification Settings", href: "/notification-settings" },
];

export default function CommandPalette({
  actions: providedActions,
}: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const actions = useMemo(
    () => (providedActions?.length ? providedActions : defaultActions),
    [providedActions],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filtered = actions.filter((action) =>
    action.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
        />

        <List>
          {filtered.map((action) => (
            <ListItemButton
              key={action.href ?? action.label}
              disabled={action.disabled}
              onClick={async () => {
                if (action.disabled) {
                  return;
                }

                setOpen(false);

                if (action.action) {
                  await action.action();
                  return;
                }

                if (action.href) {
                  router.push(action.href);
                }
              }}
            >
              <ListItemText
                primary={action.label}
                secondary={action.description ?? action.shortcut}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" color="text.secondary">
            Press Ctrl + K to open
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
