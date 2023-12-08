import {
  Card, CardContent,
  CardHeader, Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import { StoreBufferEntry } from "../types";

export function StoreBuffersView({
  storeBuffers,
}: {
  storeBuffers: StoreBufferEntry[];
}) {
  return (
    <Card>
      <CardHeader title="Store Buffers" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Busy</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>V</TableCell>
              <TableCell>Q</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {storeBuffers.map((station, index) => (
              <TableRow key={index}>
                <TableCell>{station.busy ? "Yes" : "No"}</TableCell>
                <TableCell>{station.address}</TableCell>
                <TableCell>{station.v}</TableCell>
                <TableCell>{station.q}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
