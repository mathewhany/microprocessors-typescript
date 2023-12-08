import {
  Card, CardContent,
  CardHeader, Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "@mui/material";
import { ReservationStationEntry } from "../types";

export function ReservationStationView({
  entries, title, namePrefix
}: {
  entries: ReservationStationEntry[];
  title: string;
  namePrefix: string;
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time Remaining</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Busy</TableCell>
              <TableCell>Op</TableCell>
              <TableCell>Vj</TableCell>
              <TableCell>Vk</TableCell>
              <TableCell>Qj</TableCell>
              <TableCell>Qk</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {entries.map((station, index) => (
              <TableRow key={index}>
              <TableCell>{station.timeRemaining}</TableCell>
                <TableCell>{namePrefix + (index + 1)}</TableCell>
                <TableCell>{station.busy ? "Yes" : "No"}</TableCell>
                <TableCell>{station.op}</TableCell>
                <TableCell>{station.vj}</TableCell>
                <TableCell>{station.vk}</TableCell>
                <TableCell>{station.qj}</TableCell>
                <TableCell>{station.qk}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
