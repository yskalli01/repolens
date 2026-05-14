import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import type { RepositoryComparison } from "@/types/repository";

type Props = {
  comparison: RepositoryComparison;
};

export default function RepositoryComparisonCard({ comparison }: Props) {
  return (
    <Card sx={{ mt: 4 }} className="interactive-card">
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Repository comparison
        </Typography>

        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Winner: {comparison.winnerFullName} ({comparison.winnerScore}/100)
        </Typography>

        <Stack spacing={1} sx={{ mb: 3 }}>
          {comparison.summary.map((item) => (
            <Chip key={item} label={item} variant="outlined" />
          ))}
        </Stack>

        <Stack spacing={2}>
          {comparison.repositories.map((repository, index) => (
            <Box key={repository.fullName}>
              <Stack
                direction={{ xs: "column", md: "row" }}
               sx={{ justifyContent: "space-between", gap: 2 }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    #{index + 1} {repository.fullName}
                  </Typography>
                  <Link href={repository.url} target="_blank" rel="noreferrer">
                    Open on GitHub
                  </Link>
                  <Typography color="text.secondary">
                    {repository.mainLanguage || "Unknown language"} · ⭐ {repository.stars} · 🍴 {repository.forks}
                  </Typography>
                </Box>

                <Chip
                  label={`${repository.score}/100 · ${repository.grade}`}
                  color={index === 0 ? "success" : "default"}
                />
              </Stack>

              <Box sx={{ mt: 1.5, height: 10, borderRadius: 99, bgcolor: "action.hover", overflow: "hidden" }}>
                <Box
                  className="animated-progress"
                  sx={{
                    width: `${repository.score}%`,
                    height: "100%",
                    borderRadius: 99,
                    bgcolor: index === 0 ? "success.main" : "primary.main",
                  }}
                />
              </Box>

              {repository.recommendations.length > 0 && (
                <List dense sx={{ mt: 1 }}>
                  {repository.recommendations.slice(0, 3).map((recommendation) => (
                    <ListItem key={recommendation} disablePadding>
                      <ListItemText primary={recommendation} />
                    </ListItem>
                  ))}
                </List>
              )}

              {index < comparison.repositories.length - 1 && <Divider sx={{ mt: 2 }} />}
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
