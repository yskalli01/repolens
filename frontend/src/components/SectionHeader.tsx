import { Box, Typography } from "@mui/material";

type Props = {
  title: string;
  description?: string;
  action?: React.ReactNode;
};

export default function SectionHeader({ title, description, action }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        flexDirection: { xs: "column", sm: "row" },
        gap: 2,
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          {title}
        </Typography>
        {description && (
          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
