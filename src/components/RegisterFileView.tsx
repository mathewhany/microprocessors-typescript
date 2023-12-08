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
import { RegisterFileEntry } from "../types";

export function RegisterFileView({
  registerFile,
  title,
  prefix,
}: {
  registerFile: {
    [key: number]: RegisterFileEntry;
  };
  title: string;
  prefix: string;
}) {
  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Register Name</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Q</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(registerFile).map(
              ([registerName, { value, q }]) => (
                <TableRow key={registerName}>
                  <TableCell>
                    {prefix}
                    {registerName}
                  </TableCell>
                  <TableCell>{value}</TableCell>
                  <TableCell>{q}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
