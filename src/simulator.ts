import {
  InstructionType,
  LoadBufferEntry,
  ReservationStationEntry,
  StoreBufferEntry,
  SystemSettings,
  SystemState,
} from "./types";

export function generateSystemState(
  systemSettings: SystemSettings
): SystemState {
  const systemState: SystemState = {
    adderReservationStations: [],
    mulReservationStations: [],
    loadBuffers: [],
    storeBuffers: [],
    nextIssue: 0,
    currentClock: 0,
    instructionHistory: [],
    instructions: systemSettings.code.split("\n"),
    cache: {},
    fpRegisters: {},
    intRegisters: {},
    notes: [],
    latencies: systemSettings.latencies,
  };

  for (let i = 0; i < systemSettings.numOfAdderReservationStations; i++) {
    systemState.adderReservationStations.push({
      busy: false,
      op: "",
      vj: 0,
      vk: 0,
      qj: "",
      qk: "",
      timeRemaining: 0,
    });
  }

  for (let i = 0; i < systemSettings.numOfMulReservationStations; i++) {
    systemState.mulReservationStations.push({
      busy: false,
      op: "",
      vj: 0,
      vk: 0,
      qj: "",
      qk: "",
      timeRemaining: 0,
    });
  }

  for (let i = 0; i < systemSettings.numOfLoadBuffers; i++) {
    systemState.loadBuffers.push({
      busy: false,
      address: 0,
      timeRemaining: 0,
    });
  }

  for (let i = 0; i < systemSettings.numOfStoreBuffers; i++) {
    systemState.storeBuffers.push({
      busy: false,
      address: 0,
      v: 0,
      q: "",
      timeRemaining: 0,
    });
  }

  for (let i = 0; i < systemSettings.numOfFPRegisters; i++) {
    systemState.fpRegisters[i] = {
      value: 0,
      q: "",
    };
  }

  for (let i = 0; i < systemSettings.numOfIntRegisters; i++) {
    systemState.intRegisters[i] = {
      value: 0,
      q: "",
    };
  }

  for (const { address, value } of systemSettings.cacheInitialValues) {
    systemState.cache[address] = value;
  }

  for (const {
    registerName,
    value,
  } of systemSettings.fpRegisterFileInitialValues) {
    systemState.fpRegisters[registerName].value = value;
  }

  for (const {
    registerName,
    value,
  } of systemSettings.intRegisterFileInitialValues) {
    systemState.intRegisters[registerName].value = value;
  }

  return systemState;
}

export function nextSystemState(systemState: SystemState): SystemState {
  const newState = structuredClone(systemState);

  newState.notes = [];
  newState.currentClock++;

  issueStage(newState);

  executeStage(newState);

  writeResultStage(newState);

  return newState;
}

function issueStage(newState: SystemState) {
  const instruction = newState.instructions[newState.nextIssue];
  const { instructionType, destination, source1, source2, label } =
    parseInstruction(instruction);

  const { reservationStations, prefix } = getReservationStationsForInstruction(
    instructionType,
    newState
  );

  if (reservationStations.every((rs) => rs.busy)) return;

  newState.nextIssue++;

  const index = reservationStations!.findIndex((rs) => !rs.busy);
  const reservationStationName = prefix + (index + 1);
  const rs = reservationStations![index];

  newState.instructionHistory.push({
    instruction,
    issuedAt: newState.currentClock,
    startExecutionAt: null,
    endExecutionAt: null,
    writeResultAt: null,
    stationName: reservationStationName,
  });

  rs.busy = true;

  if (instructionType === InstructionType.L_D) {
    const typedRS = reservationStations![index] as LoadBufferEntry;
    typedRS.address = Number(source1);
  } else if (instructionType == InstructionType.S_D) {
    const typedRS = reservationStations![index] as StoreBufferEntry;
    typedRS.address = Number(source1);

    const sourceRegister = getRegister(destination, newState); // For stores the destination is the source register
    typedRS.v = sourceRegister.value;
    typedRS.q = sourceRegister.q;
  } else {
    const typedRS = reservationStations![index] as ReservationStationEntry;
    typedRS.op = instructionType;
    
    const source1Register = getRegister(source1, newState);
    typedRS.vj = source1Register.value;
    typedRS.qj = source1Register.q;
    
    if (source2.startsWith("F") || source2.startsWith("R")) {
      const source2Register = getRegister(source2, newState);
      typedRS.vk = source2Register.value;
      typedRS.qk = source2Register.q;
    } else {
      typedRS.vk = Number(source2);
      typedRS.qk = "";
    }
  }

  if (instructionType != InstructionType.S_D) {
    const destinationRegIndex = Number(destination.substring(1));

    if (destination.startsWith("F")) {
      newState.fpRegisters[destinationRegIndex].q = reservationStationName;
    } else if (destination.startsWith("R")) {
      newState.intRegisters[destinationRegIndex].q = reservationStationName;
    } else {
      alert("Bt3ml eh ya 7mar");
    }
  }
}

function getReservationStationsForInstruction(
  instructionType: InstructionType,
  newState: SystemState
) {
  if (
    [
      InstructionType.ADD_D,
      InstructionType.SUB_D,
      InstructionType.ADDI,
      InstructionType.SUBI,
      InstructionType.BNEZ,
    ].includes(instructionType)
  ) {
    return {
      reservationStations: newState.adderReservationStations,
      prefix: "A",
    };
  } else if (
    [InstructionType.MUL_D, InstructionType.DIV_D].includes(instructionType)
  ) {
    return {
      reservationStations: newState.mulReservationStations,
      prefix: "M",
    };
  } else if (instructionType === InstructionType.L_D) {
    return {
      reservationStations: newState.loadBuffers,
      prefix: "L",
    };
  } else if (instructionType === InstructionType.S_D) {
    return {
      reservationStations: newState.storeBuffers,
      prefix: "S",
    };
  } else {
    throw new Error("Unknown instruction type");
  }
}

function executeStage(newState: SystemState) {}

function writeResultStage(newState: SystemState) {}

function parseInstruction(instructionStr: string) {
  const instructionParts = instructionStr.split(" ");

  const offset = instructionParts[0].endsWith(":") ? 1 : 0;

  const instructionType = instructionParts[offset] as InstructionType;

  const destination = instructionParts[offset + 1];
  const source1 = instructionParts[offset + 2];
  const source2 = instructionParts[offset + 3];

  return {
    instructionType,
    destination,
    source1,
    source2,
    label: offset ? instructionParts[0] : null,
  };
}

function getRegister(regName: string, newState: SystemState) {
  const regIndex = Number(regName.substring(1));
  let regFile = regName.startsWith("F")
    ? newState.fpRegisters
    : newState.intRegisters;

  return regFile[regIndex];
}