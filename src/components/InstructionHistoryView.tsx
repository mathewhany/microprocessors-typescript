import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { InstructionHistoryEntry } from "../types";

export function InstructionHistoryView({
  instructionHistory,
}: {
  instructionHistory: InstructionHistoryEntry[];
}) {
  return (
    <Card>
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Instruction</TableCell>
              <TableCell>Issue</TableCell>
              <TableCell>Start Execution</TableCell>
              <TableCell>End Execution</TableCell>
              <TableCell>Write Result</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {instructionHistory.map((instructionStatus, index) => (
              <TableRow key={index}>
                <TableCell>{instructionStatus.instruction}</TableCell>
                <TableCell>{instructionStatus.issuedAt}</TableCell>
                <TableCell>{instructionStatus.startExecutionAt}</TableCell>
                <TableCell>{instructionStatus.endExecutionAt}</TableCell>
                <TableCell>{instructionStatus.writeResultAt}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
