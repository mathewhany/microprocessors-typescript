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

export function CacheView({
  cache,
}: {
  cache: {
    [key: number]: number;
  };
}) {
  return (
    <Card>
      <CardHeader title="Cache" />
      <CardContent>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Address</TableCell>
              <TableCell>Value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(cache)
              .sort(([address1], [address2]) =>
                Number(address1) > Number(address2) ? 1 : -1
              )
              .map(([address, value]) => (
                <TableRow key={address}>
                  <TableCell>{address}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
