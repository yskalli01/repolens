import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";

import { RepositoryQualitySignals } from "@/types/repository";

type Props = {
  qualitySignals: RepositoryQualitySignals;
};

const signalLabels: Array<[keyof RepositoryQualitySignals, string]> = [
  ["hasCiConfig", "CI/CD"],
  ["hasDockerSupport", "Docker"],
  ["hasEnvExample", "Env example"],
  ["hasTests", "Tests"],
  ["hasLicenseFile", "License file"],
  ["hasIgnoreFile", ".gitignore"],
];

export default function RepositoryQualitySignalsCard({
  qualitySignals,
}: Props) {
  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Repository Quality Signals
        </Typography>

        <List dense>
          {signalLabels.map(([key, label]) => {
            const exists = Boolean(qualitySignals[key]);

            return (
              <ListItem key={key} disablePadding sx={{ mb: 1 }}>
                <ListItemText primary={label} />
                <Chip
                  label={exists ? "Detected" : "Missing"}
                  color={exists ? "success" : "default"}
                  size="small"
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
}
