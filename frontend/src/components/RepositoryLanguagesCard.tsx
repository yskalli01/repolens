import {
    Box,
    Card,
    CardContent,
    LinearProgress,
    Typography,
  } from "@mui/material";

  import { LanguageStat } from "@/types/repository";

  type Props = {
    languages: LanguageStat[];
  };

  export default function RepositoryLanguagesCard({ languages }: Props) {
    if (languages.length === 0) {
      return null;
    }

    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            Languages
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {languages.map((item) => (
              <Box key={item.language}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 0.5,
                  }}
                >
                  <Typography>{item.language}</Typography>
                  <Typography color="text.secondary">
                    {item.percentage}%
                  </Typography>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={item.percentage}
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
  }