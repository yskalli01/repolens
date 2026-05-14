"use client";

import { Paper, BottomNavigation, BottomNavigationAction } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ScheduleIcon from "@mui/icons-material/Schedule";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const items = [
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Reports", path: "/reports", icon: <AssessmentIcon /> },
  { label: "Scheduled", path: "/scheduled", icon: <ScheduleIcon /> },
  { label: "Alerts", path: "/notification-settings", icon: <NotificationsIcon /> },
];

export default function BottomMobileNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  if (!user) return null;

  const currentValue = items.some((item) => item.path === pathname) ? pathname : "/dashboard";

  return (
    <Paper
      elevation={12}
      sx={{
        position: "fixed",
        left: 12,
        right: 12,
        bottom: 12,
        zIndex: 1300,
        display: { xs: "block", lg: "none" },
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <BottomNavigation
        showLabels
        value={currentValue}
        onChange={(_, value) => router.push(value)}
        sx={{ bgcolor: "background.paper" }}
      >
        {items.map((item) => (
          <BottomNavigationAction key={item.path} label={item.label} value={item.path} icon={item.icon} />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
