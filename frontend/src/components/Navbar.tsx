"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Tooltip,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import GitHubIcon from "@mui/icons-material/GitHub";
import LogoutIcon from "@mui/icons-material/Logout";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useAuth } from "@/context/AuthContext";
import { useColorMode } from "@/components/AppThemeProvider";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { mode, toggleColorMode } = useColorMode();

  const [mobileOpen, setMobileOpen] = useState(false);

  function isActive(path: string) {
    return pathname === path;
  }

  function navigate(path: string) {
    router.push(path);
    setMobileOpen(false);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  const loggedInLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Reports", path: "/reports" },
    { label: "Scheduled", path: "/scheduled" },
    { label: "History", path: "/history" },
    { label: "Notifications", path: "/notification-settings" },
    { label: "Settings", path: "/settings" },
  ];

  const loggedOutLinks = [
    { label: "Login", path: "/login" },
    { label: "Register", path: "/register" },
  ];

  const links = user ? loggedInLinks : loggedOutLinks;
  const initials = user?.email?.slice(0, 1).toUpperCase() ?? "U";

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(16px)",
          bgcolor: mode === "light" ? "rgba(255, 255, 255, 0.88)" : "rgba(7, 17, 31, 0.88)",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Box
            onClick={() => navigate(user ? "/dashboard" : "/")}
            sx={{ display: "flex", alignItems: "center", gap: 1.2, cursor: "pointer" }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "primary.main",
                color: "primary.contrastText",
                boxShadow: mode === "light" ? "0 10px 25px rgba(37, 99, 235, 0.28)" : "0 10px 28px rgba(96, 165, 250, 0.22)",
              }}
            >
              <GitHubIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                RepoLens
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
                Portfolio-ready repository insights
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0.5 }}>
            {links.map((link) => (
              <Button
                key={link.path}
                color="inherit"
                variant={isActive(link.path) ? "contained" : "text"}
                onClick={() => navigate(link.path)}
                sx={{
                  px: 1.8,
                  color: isActive(link.path) ? "primary.contrastText" : "text.secondary",
                  ...(isActive(link.path) &&
                    mode === "dark" && {
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": { bgcolor: "primary.light" },
                    }),
                }}
              >
                {link.label}
              </Button>
            ))}

            <Tooltip title={mode === "light" ? "Switch to dark mode" : "Switch to light mode"}>
              <IconButton color="inherit" onClick={toggleColorMode} aria-label="Toggle color mode">
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            {user && (
              <>
                <Chip
                  avatar={<Avatar>{initials}</Avatar>}
                  label={user.email}
                  variant="outlined"
                  sx={{ ml: 1, maxWidth: 220 }}
                />
                <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            )}
          </Box>

          <IconButton
            color="inherit"
            aria-label="Open navigation menu"
            sx={{ display: { xs: "flex", lg: "none" } }}
            onClick={() => setMobileOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        slotProps={{
          paper: {
            sx: {
              width: 300,
              p: 1.5,
              bgcolor: "background.paper",
            },
          },
        }}
      >
        <Box sx={{ p: 1.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Navigation
          </Typography>
          {user && (
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          )}
        </Box>
        <Divider />
        <List>
          {links.map((link) => (
            <ListItemButton
              key={link.path}
              selected={isActive(link.path)}
              onClick={() => navigate(link.path)}
              sx={{ borderRadius: 2, my: 0.5 }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}

          <ListItemButton onClick={toggleColorMode} sx={{ borderRadius: 2, my: 0.5 }}>
            <ListItemText primary={mode === "light" ? "Dark mode" : "Light mode"} />
          </ListItemButton>

          {user && (
            <ListItemButton onClick={handleLogout} sx={{ borderRadius: 2, my: 0.5 }}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          )}
        </List>
      </Drawer>
    </>
  );
}
