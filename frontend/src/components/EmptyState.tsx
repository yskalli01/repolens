import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

type Props = {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: Props) {
  return (
    <Card
      variant="outlined"
      sx={{
        mt: 4,
        borderStyle: "dashed",
        bgcolor: "rgba(37, 99, 235, 0.04)",
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: "center" }}>
        <Box
          sx={{
            mx: "auto",
            mb: 2,
            width: 54,
            height: 54,
            borderRadius: "50%",
            display: "grid",
            placeItems: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            boxShadow: "0 18px 35px rgba(37, 99, 235, 0.22)",
          }}
        >
          <AutoAwesomeIcon />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>
          {title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520, mx: "auto" }}>
          {description}
        </Typography>
        {actionLabel && (actionHref || onAction) && (
          <Button
            href={actionHref}
            onClick={onAction}
            variant="contained"
            sx={{ mt: 3 }}
          >
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
