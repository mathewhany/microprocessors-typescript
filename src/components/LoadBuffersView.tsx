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
              <TableCell>Busy</TableCell>
              <TableCell>Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loadBuffers.map((loadBuffer, index) => (
              <TableRow key={index}>
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
