import {
    Avatar,
    Box,
    Card,
    CardContent,
    Link,
    Typography,
} from "@mui/material";

import { Contributor } from "@/types/repository";

type Props = {
    contributors: Contributor[];
};

export default function RepositoryContributorsCard({
    contributors,
  }: Props) {
    if (contributors.length === 0) {
      return null;
    }

    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            Top Contributors
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {contributors.map((contributor) => (
              <Box
                key={contributor.username}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Avatar
                    src={contributor.avatarUrl}
                    alt={contributor.username}
                  />

                  <Link
                    href={contributor.profileUrl}
                    target="_blank"
                    underline="hover"
                    sx={{ fontWeight: "bold" }}
                  >
                    {contributor.username}
                  </Link>
                </Box>

                <Typography color="text.secondary">
                  {contributor.contributions} commits
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
}