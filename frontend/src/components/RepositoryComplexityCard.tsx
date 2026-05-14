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

import { RepositoryComplexity } from "@/types/repository";

type Props = {
    complexity: RepositoryComplexity;
};

export default function RepositoryComplexityCard({ complexity }: Props) {
    return (
        <Card variant="outlined" sx={{ mt: 3 }}>
            <CardContent>
                <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
                    Complexity Snapshot
                </Typography>

                <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}>
                    <Chip label={`${complexity.scannedFiles} files scanned`} />
                    <Chip label={complexity.sourceScanStrategy || "contents-api"} color="info" />
                    <Chip label={`${complexity.scannedDirectories} directories`} />
                    <Chip label={`${complexity.testFiles} test files`} />
                    <Chip label={`${complexity.documentationFiles} docs files`} />
                    <Chip label={`${complexity.configurationFiles} config files`} />
                    <Chip label={`${complexity.estimatedSourceBytes} source bytes`} />
                </Stack>

                {complexity.largestFiles.length > 0 && (
                    <>
                        <Typography sx={{ fontWeight: "bold", mb: 1 }}>
                            Largest scanned files
                        </Typography>
                        <List dense>
                            {complexity.largestFiles.map((file) => (
                                <ListItem key={file} disablePadding>
                                    <ListItemText primary={file} />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}

                {complexity.notes.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        {complexity.notes.join(" ")}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
