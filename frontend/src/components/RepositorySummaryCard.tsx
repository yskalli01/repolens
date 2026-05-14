import {
    Box,
    Card,
    CardContent,
    Link,
    Typography,
  } from "@mui/material";

  import Grid from "@mui/material/Grid";

  import StarIcon from "@mui/icons-material/Star";
  import ForkRightIcon from "@mui/icons-material/ForkRight";
  import CodeIcon from "@mui/icons-material/Code";
  import AccountTreeIcon from "@mui/icons-material/AccountTree";

  import { RepositoryAnalysis } from "@/types/repository";

  type Props = {
    repository: RepositoryAnalysis;
  };

  export default function RepositorySummaryCard({
    repository,
  }: Props) {
    return (
      <Card variant="outlined" sx={{ mt: 5 }}>
        <CardContent>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold" }}
          >
            {repository.fullName}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {repository.description || "No description available"}
          </Typography>

          <Grid container spacing={2} sx={{ mt: 3 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <StarIcon color="warning" />

                <Typography>
                  Stars: {repository.stars}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ForkRightIcon color="primary" />

                <Typography>
                  Forks: {repository.forks}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CodeIcon color="success" />

                <Typography>
                  Language: {repository.mainLanguage || "Unknown"}
                </Typography>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <AccountTreeIcon color="secondary" />

                <Typography>
                  Branch: {repository.defaultBranch}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Link
              href={repository.url}
              target="_blank"
              underline="hover"
            >
              Open Repository
            </Link>
          </Box>
        </CardContent>
      </Card>
    );
  }