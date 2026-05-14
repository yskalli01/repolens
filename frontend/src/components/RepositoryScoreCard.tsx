import { Box, Card, CardContent, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

import { ProjectScore } from "@/types/repository";

type Props = {
  score: ProjectScore;
};

export default function RepositoryScoreCard({ score }: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 3, overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 900 }}>
              Recruiter readiness
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 950 }}>
              Project Score
            </Typography>
          </Box>

          <Chip label={`Grade ${score.grade}`} color="primary" />
        </Box>

        <Box sx={{ display: "flex", alignItems: "end", gap: 1, mb: 2 }}>
          <Typography variant="h2" sx={{ fontWeight: 950, lineHeight: 0.9 }}>
            {score.score}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 0.5 }}>
            /100
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={score.score}
          sx={{ mb: 4, height: 12, borderRadius: 999 }}
        />

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          <Box>
            <Typography sx={{ fontWeight: 900, mb: 1.5 }}>Strengths</Typography>
            <Stack spacing={1.2}>
              {score.strengths.map((item) => (
                <Box key={item} sx={{ display: "flex", gap: 1.2, alignItems: "flex-start" }}>
                  <CheckCircleIcon color="success" fontSize="small" />
                  <Typography variant="body2">{item}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography sx={{ fontWeight: 900, mb: 1.5 }}>Recommendations</Typography>
            <Stack spacing={1.2}>
              {score.recommendations.map((item) => (
                <Box key={item} sx={{ display: "flex", gap: 1.2, alignItems: "flex-start" }}>
                  <TipsAndUpdatesIcon color="warning" fontSize="small" />
                  <Typography variant="body2">{item}</Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
