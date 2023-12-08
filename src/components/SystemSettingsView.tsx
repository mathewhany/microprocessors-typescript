import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { SystemSettings } from "../types";

export function SystemSettingsView({
  onRunClicked,
  systemSettings,
}: {
  onRunClicked: (systemSettings: SystemSettings) => void;
  systemSettings: SystemSettings;
}) {
  const [code, setCode] = useState(systemSettings.code);

  const [numOfAdderReservationStations, setNumOfAdderReservationStations] =
    useState(systemSettings.numOfAdderReservationStations);
  const [numOfMulReservationStations, setNumOfMulReservationStations] =
    useState(systemSettings.numOfLoadBuffers);
  const [numOfLoadBuffers, setNumOfLoadBuffers] = useState(
    systemSettings.numOfLoadBuffers
  );
  const [numOfStoreBuffers, setNumOfStoreBuffers] = useState(
    systemSettings.numOfStoreBuffers
  );

  const [numOfFPRegisters, setNumOfFPRegisters] = useState(
    systemSettings.numOfFPRegisters
  );

  const [numOfIntRegisters, setNumOfIntRegisters] = useState(
    systemSettings.numOfIntRegisters
  );

  const [latencies, setLatencies] = useState(systemSettings.latencies);

  const [fpRegisterFileInitialValues, setFPRegisterFileInitialValues] =
    useState(systemSettings.fpRegisterFileInitialValues);
  const [intRegisterFileInitialValues, setIntRegisterFileInitialValues] =
    useState(systemSettings.intRegisterFileInitialValues);
  const [cacheInitialValues, setCacheInitialValues] = useState(
    systemSettings.cacheInitialValues
  );

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <TextField
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label="The Assembly Code"
            multiline
          />

          <TextField
            type="number"
            value={numOfAdderReservationStations}
            label="Number of Adder Reservation Stations"
            onChange={(e) => setNumOfAdderReservationStations(+e.target.value)}
          />
          <TextField
            type="number"
            value={numOfMulReservationStations}
            label="Number of Multipler Reservation Stations"
            onChange={(e) => setNumOfMulReservationStations(+e.target.value)}
          />
          <TextField
            type="number"
            value={numOfLoadBuffers}
            label="Number of Load Reservation Stations"
            onChange={(e) => setNumOfLoadBuffers(+e.target.value)}
          />
          <TextField
            type="number"
            value={numOfStoreBuffers}
            label="Number of Store Reservation Stations"
            onChange={(e) => setNumOfStoreBuffers(+e.target.value)}
          />
          <TextField
            type="number"
            value={numOfFPRegisters}
            label="Number of FP Registers"
            onChange={(e) => setNumOfFPRegisters(+e.target.value)}
          />
          <TextField
            type="number"
            value={numOfIntRegisters}
            label="Number of Int Registers"
            onChange={(e) => setNumOfIntRegisters(+e.target.value)}
          />

          <Typography variant="h6">Latencies</Typography>
          {Object.entries(latencies).map(([instructionType, latency]) => (
            <TextField
              key={instructionType}
              type="number"
              value={latency}
              label={`Latency of ${instructionType}`}
              onChange={(e) =>
                setLatencies((latencies) => ({
                  ...latencies,
                  [instructionType]: +e.target.value,
                }))
              }
              disabled={
                instructionType === "BNEZ" || instructionType === "ADDI"
              }
            />
          ))}

          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography variant="h6">
              FP Register File Initial Values
            </Typography>
            <Button
              variant="contained"
              onClick={() =>
                setFPRegisterFileInitialValues((values) => [
                  ...values,
                  { registerName: 0, value: 0 },
                ])
              }
            >
              Add
            </Button>
          </Stack>
          {fpRegisterFileInitialValues.map(({ registerName, value }, index) => (
            <Stack direction="row" spacing={1} key={index}>
              <TextField
                type="number"
                value={registerName}
                label={`Register Name`}
                fullWidth
                onChange={(e) =>
                  setFPRegisterFileInitialValues((values) => [
                    ...values.slice(0, index),
                    {
                      registerName: +e.target.value,
                      value,
                    },
                    ...values.slice(index + 1),
                  ])
                }
              />
              <TextField
                type="number"
                value={value}
                label={`Register Value`}
                fullWidth
                onChange={(e) =>
                  setFPRegisterFileInitialValues((values) => [
                    ...values.slice(0, index),
                    {
                      registerName,
                      value: +e.target.value,
                    },
                    ...values.slice(index + 1),
                  ])
                }
              />
              <Button
                variant="contained"
                onClick={() =>
                  setFPRegisterFileInitialValues((values) => [
                    ...values.slice(0, index),
                    ...values.slice(index + 1),
                  ])
                }
                color="error"
              >
                Delete
              </Button>
            </Stack>
          ))}

          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography variant="h6">
              Int Register File Initial Values
            </Typography>
            <Button
              variant="contained"
              onClick={() =>
                setIntRegisterFileInitialValues((values) => [
                  ...values,
                  { registerName: 0, value: 0 },
                ])
              }
            >
              Add
            </Button>
          </Stack>
          {intRegisterFileInitialValues.map(
            ({ registerName, value }, index) => (
              <Stack direction="row" spacing={1} key={index}>
                <TextField
                  type="number"
                  value={registerName}
                  label={`Register Name`}
                  fullWidth
                  onChange={(e) =>
                    setIntRegisterFileInitialValues((values) => [
                      ...values.slice(0, index),
                      {
                        registerName: +e.target.value,
                        value,
                      },
                      ...values.slice(index + 1),
                    ])
                  }
                />
                <TextField
                  type="number"
                  value={value}
                  label={`Register Value`}
                  fullWidth
                  onChange={(e) =>
                    setIntRegisterFileInitialValues((values) => [
                      ...values.slice(0, index),
                      {
                        registerName,
                        value: +e.target.value,
                      },
                      ...values.slice(index + 1),
                    ])
                  }
                />
                <Button
                  variant="contained"
                  onClick={() =>
                    setIntRegisterFileInitialValues((values) => [
                      ...values.slice(0, index),
                      ...values.slice(index + 1),
                    ])
                  }
                  color="error"
                >
                  Delete
                </Button>
              </Stack>
            )
          )}

          <Stack direction="row" spacing={1} justifyContent="space-between">
            <Typography variant="h6">Cache Initial Values</Typography>
            <Button
              variant="contained"
              onClick={() =>
                setCacheInitialValues((values) => [
                  ...values,
                  { address: 0, value: 0 },
                ])
              }
            >
              Add
            </Button>
          </Stack>
          {cacheInitialValues.map(({ address, value }, index) => (
            <Stack direction="row" spacing={1} key={index}>
              <TextField
                type="number"
                value={address}
                label={`Address`}
                fullWidth
                onChange={(e) =>
                  setCacheInitialValues((values) => [
                    ...values.slice(0, index),
                    {
                      address: +e.target.value,
                      value,
                    },
                    ...values.slice(index + 1),
                  ])
                }
              />
              <TextField
                type="number"
                value={value}
                label={`Value`}
                fullWidth
                onChange={(e) =>
                  setCacheInitialValues((values) => [
                    ...values.slice(0, index),
                    {
                      address,
                      value: +e.target.value,
                    },
                    ...values.slice(index + 1),
                  ])
                }
              />
              <Button
                variant="contained"
                onClick={() =>
                  setCacheInitialValues((values) => [
                    ...values.slice(0, index),
                    ...values.slice(index + 1),
                  ])
                }
                color="error"
              >
                Delete
              </Button>
            </Stack>
          ))}

          <Button
            variant="contained"
            onClick={() =>
              onRunClicked({
                code,
                numOfAdderReservationStations,
                numOfMulReservationStations,
                numOfLoadBuffers,
                numOfStoreBuffers,
                numOfFPRegisters,
                numOfIntRegisters,
                latencies,
                fpRegisterFileInitialValues: fpRegisterFileInitialValues.map(
                  ({ registerName, value }) => ({
                    registerName: +registerName,
                    value: +value,
                  })
                ),
                intRegisterFileInitialValues: intRegisterFileInitialValues.map(
                  ({ registerName, value }) => ({
                    registerName: +registerName,
                    value: +value,
                  })
                ),
                cacheInitialValues: cacheInitialValues.map(
                  ({ address, value }) => ({
                    address: +address,
                    value: +value,
                  })
                ),
              })
            }
          >
            Run
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
