import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  severity?: "warning" | "error";
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  severity = "error",
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            p: 0.5,
          },
        },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              bgcolor: severity === "error" ? "error.light" : "warning.light",
              color: severity === "error" ? "error.contrastText" : "warning.contrastText",
            }}
          >
            <WarningAmberRoundedIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            {title}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent>
        <DialogContentText sx={{ color: "text.secondary" }}>{message}</DialogContentText>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button color={severity} variant="contained" onClick={onConfirm} disabled={loading}>
          {loading ? "Working..." : confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
