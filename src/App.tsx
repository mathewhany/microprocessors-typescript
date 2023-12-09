import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { InstructionType, SystemSettings, SystemState } from "./types";
import { generateSystemState, nextSystemState } from "./simulator";

import { ReservationStationView } from "./components/ReservationStationView";
import { SystemSettingsView } from "./components/SystemSettingsView";
import { StoreBuffersView } from "./components/StoreBuffersView";
import { LoadBuffersView } from "./components/LoadBuffersView";
import { InstructionHistoryView } from "./components/InstructionHistoryView";
import { InstructionListView } from "./components/InstructionListView";
import { NotesView } from "./components/NotesView";
import { CacheView } from "./components/CacheView";
import { RegisterFileView } from "./components/RegisterFileView";

function App() {
  const [systemSettings, setSystemSettings] = useState<SystemSettings>({
    code: "",
    numOfAdderReservationStations: 3,
    numOfMulReservationStations: 2,
    numOfLoadBuffers: 2,
    numOfStoreBuffers: 2,
    numOfFPRegisters: 32,
    numOfIntRegisters: 32,
    latencies: {
      [InstructionType.ADD_D]: 2,
      [InstructionType.SUB_D]: 2,
      [InstructionType.MUL_D]: 4,
      [InstructionType.DIV_D]: 8,
      [InstructionType.L_D]: 2,
      [InstructionType.S_D]: 2,
      [InstructionType.SUBI]: 1,

      [InstructionType.ADDI]: 1,
      [InstructionType.BNEZ]: 1,
      
      [InstructionType.ADD_DI]: 2,
      [InstructionType.SUB_DI]: 2,
      [InstructionType.MUL_DI]: 4,
      [InstructionType.DIV_DI]: 8,
    },

    fpRegisterFileInitialValues: [],
    intRegisterFileInitialValues: [],
    cacheInitialValues: [],
  });
  const [systemState, setSystemState] = useState<SystemState | null>(null);

  const onRunClicked = (systemSettings: SystemSettings) => {
    setSystemSettings(systemSettings);
    setSystemState(generateSystemState(systemSettings));
  };

  const onResetClicked = () => {
    setSystemState(null);
  };

  const onNextClicked = () => {
    setSystemState((systemState) => nextSystemState(systemState!));
  };

  return (
    <Container sx={{ pt: 2 }}>
      {systemState ? (
        <Grid container spacing={1}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="overline">Clock:</Typography>
                <Typography variant="h6" marginTop={-1}>
                  {systemState?.currentClock}
                </Typography>
              </CardContent>
              <CardActions>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    onClick={onNextClicked}
                    // disabled={
                    //   systemState.nextIssue >= systemState.instructions.length
                    // }
                  >
                    Next
                  </Button>
                  <Button variant="contained" onClick={onResetClicked}>
                    Reset
                  </Button>
                </Stack>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <NotesView notes={systemState.notes} />
          </Grid>

          <Grid item xs={12} md={6}>
            <InstructionListView
              instructions={systemState.instructions}
              currentInstructionIndex={systemState.nextIssue}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <InstructionHistoryView
              instructionHistory={systemState.instructionHistory}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ReservationStationView
              entries={systemState.adderReservationStations}
              title="Adder Reservation Stations"
              namePrefix="A"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <ReservationStationView
              entries={systemState.mulReservationStations}
              title="Multiplier Reservation Stations"
              namePrefix="M"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <LoadBuffersView loadBuffers={systemState.loadBuffers} />
          </Grid>
          <Grid item xs={12} md={6}>
            <StoreBuffersView storeBuffers={systemState.storeBuffers} />
          </Grid>
          <Grid item xs={12} md={6}>
            <RegisterFileView
              registerFile={systemState.fpRegisters}
              title="FP Register File"
              prefix="F"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <RegisterFileView
              registerFile={systemState.intRegisters}
              title="Int Register File"
              prefix="R"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CacheView cache={systemState.cache} />
          </Grid>
        </Grid>
      ) : (
        <SystemSettingsView
          onRunClicked={onRunClicked}
          systemSettings={systemSettings}
        />
      )}
    </Container>
  );
}

export default App;
