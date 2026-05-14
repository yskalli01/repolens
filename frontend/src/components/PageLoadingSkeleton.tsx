import { Card, CardContent, Skeleton, Stack } from "@mui/material";

type Props = {
  items?: number;
};

export default function PageLoadingSkeleton({ items = 3 }: Props) {
  return (
    <Stack spacing={2}>
      {Array.from({ length: items }).map((_, index) => (
        <Card key={index} variant="outlined">
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={1.5}>
              <Skeleton variant="text" width="45%" height={32} />
              <Skeleton variant="text" width="70%" />
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                <Skeleton variant="rounded" width={92} height={32} />
                <Skeleton variant="rounded" width={82} height={32} />
                <Skeleton variant="rounded" width={140} height={32} />
              </Stack>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", pt: 1 }}>
                <Skeleton variant="rounded" width={135} height={38} />
                <Skeleton variant="rounded" width={118} height={38} />
                <Skeleton variant="rounded" width={112} height={38} />
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
}
