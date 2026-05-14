import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";

import { Branch } from "@/types/repository";

type Props = {
    branches: Branch[];
};

export default function RepositoryBranchesCard({ branches }: Props) {
    if (branches.length === 0) {
      return null;
    }

    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            Branches
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {branches.slice(0, 10).map((branch) => (
              <Box
                key={branch.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {branch.name}
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    {branch.commitSha.substring(0, 7)}
                  </Typography>
                </Box>

                <Chip
                  label={branch.isProtected ? "Protected" : "Not protected"}
                  color={branch.isProtected ? "success" : "default"}
                  size="small"
                />
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    );
}