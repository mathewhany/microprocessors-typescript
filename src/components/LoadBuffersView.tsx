import {
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { LoadBufferEntry } from "../types";

export function LoadBuffersView({
  loadBuffers,
}: {
  loadBuffers: LoadBufferEntry[];
}) {
  return (
    <Card>
      <CardHeader title="Load Buffers" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time Remaining</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Busy</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadBuffers.map((loadBuffer, index) => (
              <TableRow key={index}>
                <TableCell>{loadBuffer.timeRemaining}</TableCell>
                <TableCell>{"L" + (index + 1)}</TableCell>
                <TableCell>{loadBuffer.busy ? "Yes" : "No"}</TableCell>
                <TableCell>{loadBuffer.address}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
