import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

export function InstructionListView({
  instructions,
  currentInstructionIndex,
}: {
  instructions: string[];
  currentInstructionIndex: number;
}) {
  return (
    <Card>
      <CardContent>
        <List>
          {instructions.map((instruction, index) => (
            <ListItem disablePadding key={index}>
              <ListItemButton selected={currentInstructionIndex == index}>
                <ListItemText primary={instruction} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}
