import { Box, Card, CardContent, Skeleton } from "@mui/material";

export default function RepositoryAnalysisSkeleton() {
  return (
    <Card variant="outlined" className="skeleton-shimmer" sx={{ mt: 5 }}>
      <CardContent>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="text" width="90%" height={28} sx={{ mt: 1 }} />

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 2,
            mt: 4,
          }}
        >
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
          <Skeleton variant="rounded" height={40} />
        </Box>

        <Skeleton variant="text" width="30%" height={32} sx={{ mt: 4 }} />
      </CardContent>
    </Card>
  );
}
