"use client";

import { Alert, Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from "@mui/material";

type Props = {
  title: string;
  buttonText: string;
  email: string;
  password: string;
  errorMessage: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
  helperText?: string;
};

export default function AuthForm({
  title,
  buttonText,
  email,
  password,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  helperText,
}: Props) {
  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 5, md: 8 } }}>
      <Container maxWidth="sm">
        <Card sx={{ bgcolor: "rgba(255,255,255,0.92)", backdropFilter: "blur(18px)" }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h4" sx={{ fontWeight: 950, mb: 1 }}>
              {title}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Access your saved repository analyses, reports, and scheduled scans.
            </Typography>

            {errorMessage && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorMessage}
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
              />

              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                helperText={helperText}
              />

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={onSubmit}
                disabled={!email || !password}
                sx={{ py: 1.3 }}
              >
                {buttonText}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
