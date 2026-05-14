"use client";

import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";

import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import DashboardPageLayout from "@/components/DashboardPageLayout";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    router.push("/login");
  }

  return (
    <ProtectedRoute>
    <DashboardPageLayout title="Settings" maxWidth="sm">
        <Typography sx={{ mb: 1 }}>
        <strong>Email:</strong> {user?.email}
        </Typography>

        <Typography sx={{ mb: 4 }}>
        <strong>Role:</strong> {user?.role}
        </Typography>

        <Button variant="contained" color="error" onClick={handleLogout}>
        Logout
        </Button>
    </DashboardPageLayout>
    </ProtectedRoute>
  );
}