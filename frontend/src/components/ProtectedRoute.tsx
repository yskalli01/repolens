"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";

import { useAuth } from "@/context/AuthContext";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5", py: 8 }}>
        <Container maxWidth="sm">
          <Card>
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
                Login required
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                You need to login before using this page.
              </Typography>

              <Button variant="contained" onClick={() => router.push("/login")}>
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>
    );
  }

  return <>{children}</>;
}