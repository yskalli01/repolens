import {
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import type { RepositoryComparisonHistory } from "@/types/repository";

type Props = {
  history: RepositoryComparisonHistory[];
};

export default function RepositoryComparisonHistoryCard({ history }: Props) {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Recent comparison history
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Useful for showing progress when comparing your project against stronger reference repositories.
        </Typography>

        <List dense>
          {history.map((item) => (
            <ListItem key={item.id} disableGutters sx={{ alignItems: "flex-start" }}>
              <ListItemText
                primary={
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    <Chip label={`Winner: ${item.winnerFullName}`} color="success" size="small" />
                    <Chip label={`${item.winnerScore}/100`} color="primary" size="small" />
                    <Chip label={new Date(item.comparedAt).toLocaleString()} variant="outlined" size="small" />
                  </Stack>
                }
                secondary={`${item.comparedRepositories} — ${item.summary}`}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
