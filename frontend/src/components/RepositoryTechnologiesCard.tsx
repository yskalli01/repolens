import {
    Box,
    Card,
    CardContent,
    Chip,
    Typography,
} from "@mui/material";

import { TechDetection } from "@/types/repository";

type Props = {
    technologies: TechDetection;
};

export default function RepositoryTechnologiesCard({
    technologies,
  }: Props) {
    return (
      <Card variant="outlined" sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3 }}>
            Technology Detection
          </Typography>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            Package Managers
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {technologies.packageManagers.length > 0 ? (
              technologies.packageManagers.map((item) => (
                <Chip key={item} label={item} color="primary" />
              ))
            ) : (
              <Typography color="text.secondary">None detected</Typography>
            )}
          </Box>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            Frameworks / Languages
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {technologies.frameworks.length > 0 ? (
              technologies.frameworks.map((item) => (
                <Chip key={item} label={item} color="success" />
              ))
            ) : (
              <Typography color="text.secondary">None detected</Typography>
            )}
          </Box>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            Build Tools
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {technologies.buildTools.length > 0 ? (
              technologies.buildTools.map((item) => (
                <Chip key={item} label={item} color="secondary" />
              ))
            ) : (
              <Typography color="text.secondary">None detected</Typography>
            )}
          </Box>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
              Dependencies
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
            {technologies.dependencies.length > 0 ? (
              technologies.dependencies.map((item) => (
                <Chip key={item} label={item} color="warning" />
              ))
            ) : (
              <Typography color="text.secondary">None detected</Typography>
            )}
          </Box>

          <Typography sx={{ fontWeight: "bold", mb: 1 }}>
            Detected Files
          </Typography>

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {technologies.detectedFiles.map((file) => (
              <Chip key={file} label={file} variant="outlined" />
            ))}
          </Box>
        </CardContent>
      </Card>
    );
}