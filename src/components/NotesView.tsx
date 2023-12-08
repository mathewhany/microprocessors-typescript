import { Alert, Card, CardContent, CardHeader, Stack } from "@mui/material";

export const NotesView = ({ notes }: { notes: string[] }) => {
  return (
    <Card>
      <CardHeader title="Notes" />
      <CardContent>
        <Stack spacing={1}>
          {notes.map((note, index) => (
            <Alert key={index} color="info">
              {note}
            </Alert>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
