import {
    Card,
    CardContent,
    Divider,
    Link,
    Typography,
    Box,
} from "@mui/material";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { RepositoryAnalysisHistory } from "@/types/repository";

type Props = {
  history: RepositoryAnalysisHistory[];
  onDelete: (id: number) => void;
};

export default function RepositoryHistoryCard({ history, onDelete }: Props) {
  if (history.length === 0) {
    return null;
  }

  return (
    <Card variant="outlined" sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Recent Analyses
        </Typography>

        {history.map((item, index) => (
          <Box key={item.id}>
            <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
              <Link
                href={item.url}
                target="_blank"
                underline="hover"
                sx={{ fontWeight: "bold" }}
              >
                {item.fullName}
              </Link>

              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(item.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>

            {index < history.length - 1 && <Divider />}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
}