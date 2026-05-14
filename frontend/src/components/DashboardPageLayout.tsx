import { Box, Card, CardContent, Container, Typography } from "@mui/material";

type Props = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  children: React.ReactNode;
};

export default function DashboardPageLayout({
  title,
  subtitle,
  eyebrow,
  maxWidth = "lg",
  children,
}: Props) {
  return (
    <Box
      sx={(theme) => ({
        minHeight: "100vh",
        py: { xs: 4, md: 7 },
        background:
          theme.palette.mode === "dark"
            ? "radial-gradient(circle at 15% 0%, rgba(96, 165, 250, 0.14), transparent 26rem), radial-gradient(circle at 95% 10%, rgba(192, 132, 252, 0.12), transparent 28rem)"
            : "transparent",
      })}
    >
      <Container maxWidth={maxWidth}>
        <Card
          sx={{
            overflow: "hidden",
            bgcolor: (theme) =>
              theme.palette.mode === "dark" ? "rgba(15, 27, 45, 0.88)" : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(18px)",
          }}
        >
          <Box
            sx={{
              px: { xs: 3, md: 5 },
              pt: { xs: 3, md: 5 },
              pb: 3,
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "linear-gradient(135deg, rgba(96, 165, 250, 0.13), rgba(192, 132, 252, 0.09))"
                  : "linear-gradient(135deg, rgba(37, 99, 235, 0.10), rgba(124, 58, 237, 0.08))",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            {eyebrow && (
              <Typography
                variant="overline"
                color="primary"
                sx={{ fontWeight: 900, letterSpacing: ".14em" }}
              >
                {eyebrow}
              </Typography>
            )}
            <Typography variant="h3" sx={{ fontWeight: 950, mb: 1 }}>
              {title}
            </Typography>

            {subtitle && (
              <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>{children}</CardContent>
        </Card>
      </Container>
    </Box>
  );
}
