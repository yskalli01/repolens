import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";

import { ReadmeAnalysis } from "@/types/repository";
type Props = {
    readme: ReadmeAnalysis;
};

export default function RepositoryReadmeCard({ readme }: Props) {
    if (!readme.exists) {
      return (
        <Card variant="outlined" sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              README Analysis
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 2 }}>
              No README file was found for this repository.
            </Typography>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            README Analysis
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            <Chip label={`${readme.wordCount} words`} />
            <Chip label={`${readme.characterCount} characters`} />

            <Chip
              label="Installation"
              color={readme.hasInstallationSection ? "success" : "default"}
            />

            <Chip
              label="Usage"
              color={readme.hasUsageSection ? "success" : "default"}
            />

            <Chip
              label="License"
              color={readme.hasLicenseSection ? "success" : "default"}
            />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Preview:
          </Typography>

          <Box
            sx={{
              mt: 1,
              p: 2,
              bgcolor: "#f5f5f5",
              borderRadius: 1,
              maxHeight: 220,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
              fontSize: 13,
            }}
          >
            {readme.content.slice(0, 1500)}
            {readme.content.length > 1500 && "..."}
          </Box>
        </CardContent>
      </Card>
    );
}