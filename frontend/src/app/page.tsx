"use client";

import { useRouter } from "next/navigation";
import { Box, Button, Card, CardContent, Chip, Container, Stack, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoGraphIcon from "@mui/icons-material/AutoGraph";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

import { useAuth } from "@/context/AuthContext";

const features = [
  {
    icon: <AutoGraphIcon color="primary" />,
    title: "Score repositories",
    description: "Turn repository signals into a clear grade, strengths, and improvement recommendations.",
  },
  {
    icon: <CompareArrowsIcon color="primary" />,
    title: "Compare projects",
    description: "Compare multiple repositories to decide which project is strongest for your portfolio.",
  },
  {
    icon: <PictureAsPdfIcon color="primary" />,
    title: "Export reports",
    description: "Generate recruiter-friendly Markdown and PDF reports from saved analyses.",
  },
];

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1.25fr 0.75fr" }, gap: 4, alignItems: "center" }}>
          <Box>
            <Chip label="CV-ready project analysis" color="primary" variant="outlined" sx={{ mb: 2 }} />
            <Typography variant="h2" sx={{ fontWeight: 950, letterSpacing: "-0.06em", mb: 2 }}>
              Analyze GitHub projects like a technical recruiter.
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 680, mb: 4 }}>
              Detect technologies, quality signals, documentation gaps, repository complexity, trends, and export clean reports you can use to improve your portfolio.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                onClick={() => router.push(user ? "/dashboard" : "/login")}
              >
                {user ? "Open Dashboard" : "Get Started"}
              </Button>
              <Button variant="outlined" size="large" onClick={() => router.push(user ? "/reports" : "/register")}>
                {user ? "View Reports" : "Create Account"}
              </Button>
            </Stack>
          </Box>

          <Card sx={{ bgcolor: "rgba(255,255,255,0.88)", backdropFilter: "blur(18px)" }}>
            <CardContent sx={{ p: { xs: 3, md: 4 } }}>
              <Typography variant="h5" sx={{ fontWeight: 900, mb: 3 }}>
                What the app highlights
              </Typography>
              <Stack spacing={2.5}>
                {features.map((feature) => (
                  <Box key={feature.title} sx={{ display: "flex", gap: 2 }}>
                    <Box
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 3,
                        bgcolor: "rgba(37, 99, 235, 0.08)",
                        display: "grid",
                        placeItems: "center",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      {feature.icon}
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 900 }}>{feature.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
}
