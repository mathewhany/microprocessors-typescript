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
      timeRemaining: null,
      result: null,
      historyIndex: null,
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
      timeRemaining: null,
      result: null,
      historyIndex: null,
    });
  }

  for (let i = 0; i < systemSettings.numOfLoadBuffers; i++) {
    systemState.loadBuffers.push({
      busy: false,
      address: 0,
      timeRemaining: null,
      result: null,
      historyIndex: null,
    });
  }

  for (let i = 0; i < systemSettings.numOfStoreBuffers; i++) {
    systemState.storeBuffers.push({
      busy: false,
      address: 0,
      v: 0,
      q: "",
      timeRemaining: null,
      historyIndex: null,
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

  console.log(newState);

  return newState;
}

function issueStage(newState: SystemState) {
  if (newState.nextIssue >= newState.instructions.length) return;
  if (hasBranch(newState)) return;

  const instruction = newState.instructions[newState.nextIssue];
  const { instructionType, destination, source1, source2 } =
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
  rs.historyIndex = newState.instructionHistory.length - 1;

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

    if (instructionType === InstructionType.BNEZ) {
      const source1Register = getRegister(destination, newState);
      typedRS.vj = source1Register.value;
      typedRS.qj = source1Register.q;
    }
    
    if (source1.startsWith("F") || source1.startsWith("R")) {
      const source1Register = getRegister(source1, newState);
      typedRS.vj = source1Register.value;
      typedRS.qj = source1Register.q;
    } else {
      typedRS.vk = getInstructionIndexWithLabel(newState, source1);
      typedRS.qk = "";
    }

    if (source2) {
      if (source2.startsWith("F") || source2.startsWith("R")) {
        const source2Register = getRegister(source2, newState);
        typedRS.vk = source2Register.value;
        typedRS.qk = source2Register.q;
      } else {
        typedRS.vk = Number(source2);
        typedRS.qk = "";
      }
    }
  }

  if (instructionType != InstructionType.S_D && instructionType != InstructionType.BNEZ) {
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

function executeStage(newState: SystemState) {
  for (const rs of newState.adderReservationStations.concat(
    newState.mulReservationStations
  )) {
    if (!rs.busy || rs.qj != "" || rs.qk != "") continue;

    const issuedAt = newState.instructionHistory[rs.historyIndex!].issuedAt;
    if (newState.currentClock == issuedAt) continue;

    const latency = newState.latencies[rs.op as InstructionType];

    if (rs.timeRemaining == null) {
      rs.timeRemaining = latency;
      newState.instructionHistory[rs.historyIndex!].startExecutionAt =
        newState.currentClock;
      newState.instructionHistory[rs.historyIndex!].endExecutionAt =
        newState.currentClock + latency - 1;
    } else {
      rs.timeRemaining--;
    }
    
    if (rs.op === InstructionType.BNEZ) {
      if (rs.timeRemaining === 1) {
        if (rs.vj != 0) {
          newState.nextIssue = rs.vk;
        }
        continue;
      }
    }

    if (rs.timeRemaining === 0) {
      switch (rs.op) {
        case InstructionType.ADD_D:
          rs.result = rs.vj + rs.vk;
          break;
        case InstructionType.SUB_D:
          rs.result = rs.vj - rs.vk;
          break;
        case InstructionType.ADDI:
          rs.result = rs.vj + rs.vk;
          break;
        case InstructionType.SUBI:
          rs.result = rs.vj - rs.vk;
          break;
        case InstructionType.BNEZ:
          
          break;
        case InstructionType.MUL_D:
          rs.result = rs.vj * rs.vk;
          break;
        case InstructionType.DIV_D:
          if (rs.vk === 0) {
            alert("Bt3ml eh?!!!! M3dtsh 3la HAny El-Sharkawy wala eh?!");
          }
          rs.result = rs.vj / rs.vk;
          break;
        default:
          throw new Error("Unknown operation");
      }
    }
  }

  for (const rs of newState.storeBuffers) {
    if (!rs.busy || rs.q != "") continue;

    const issuedAt = newState.instructionHistory[rs.historyIndex!].issuedAt;
    if (newState.currentClock == issuedAt) continue;

    const latency = newState.latencies[InstructionType.S_D];

    if (rs.timeRemaining == null) {
      rs.timeRemaining = latency;
      newState.instructionHistory[rs.historyIndex!].startExecutionAt =
        newState.currentClock;
      newState.instructionHistory[rs.historyIndex!].endExecutionAt =
        newState.currentClock + latency - 1;
    } else {
      rs.timeRemaining--;
    }

    if (rs.timeRemaining === 0) {
      newState.cache[rs.address] = rs.v;
    }
  }

  for (const rs of newState.loadBuffers) {
    if (!rs.busy) continue;

    const issuedAt = newState.instructionHistory[rs.historyIndex!].issuedAt;
    if (newState.currentClock == issuedAt) continue;

    const latency = newState.latencies[InstructionType.L_D];

    if (rs.timeRemaining == null) {
      rs.timeRemaining = latency;
      newState.instructionHistory[rs.historyIndex!].startExecutionAt =
        newState.currentClock;

      newState.instructionHistory[rs.historyIndex!].endExecutionAt =
        newState.currentClock + latency - 1;
    } else {
      rs.timeRemaining--;
    }

    if (rs.timeRemaining === 0) {
      rs.result = newState.cache[rs.address];
    }
  }
}

function writeResultStage(newState: SystemState) {
  // Reset store buffer that finished
  for (const rs of newState.storeBuffers) {
    if (rs.busy && rs.timeRemaining === 0) {
      rs.busy = false;
      rs.timeRemaining = null;
      rs.historyIndex = null;
      rs.address = 0;
      rs.v = 0;
      rs.q = "";
    }
  }
  
  // Reset BNEZ reservation station that finished
  for (const rs of newState.adderReservationStations) {
    if (rs.busy && rs.timeRemaining === 0 && rs.op === InstructionType.BNEZ) {
      rs.busy = false;
      rs.timeRemaining = null;
      rs.historyIndex = null;
      rs.op = "";
      rs.vj = 0;
      rs.vk = 0;
      rs.qj = "";
      rs.qk = "";
      rs.result = null;
      rs.historyIndex = null;
    }
  }

  const maxRS = getReservationStationWithMaxDependencies(
    newState
  ) as ReservationStationEntry & LoadBufferEntry;

  if (!maxRS) return;

  const reservationStationName =
    newState.instructionHistory[maxRS.historyIndex!].stationName;

  for (const rs of newState.adderReservationStations.concat(
    newState.mulReservationStations
  )) {
    if (rs.qj === reservationStationName) {
      rs.qj = "";
      rs.vj = maxRS.result!;
    }

    if (rs.qk === reservationStationName) {
      rs.qk = "";
      rs.vk = maxRS.result!;
    }
  }

  for (const rs of newState.storeBuffers) {
    if (rs.q === reservationStationName) {
      rs.q = "";
      rs.v = maxRS.result!;
    }
  }

  for (const [regName, reg] of Object.entries(newState.fpRegisters)) {
    if (reg.q === reservationStationName) {
      reg.q = "";
      reg.value = maxRS.result!;
    }
  }

  for (const [regName, reg] of Object.entries(newState.intRegisters)) {
    if (reg.q === reservationStationName) {
      reg.q = "";
      reg.value = maxRS.result!;
    }
  }

  newState.instructionHistory[maxRS.historyIndex!].writeResultAt =
    newState.currentClock;

  // Remove the instruction from the reservation station
  maxRS.busy = false;
  maxRS.result = null;
  maxRS.historyIndex = null;
  maxRS.timeRemaining = null;

  if (maxRS.op) maxRS.op = "";
  if (maxRS.vj) maxRS.vj = 0;
  if (maxRS.vk) maxRS.vk = 0;
  if (maxRS.qj) maxRS.qj = "";
  if (maxRS.qk) maxRS.qk = "";
  if (maxRS.address) maxRS.address = 0;
  if (maxRS.timeRemaining) maxRS.timeRemaining = null;
  if (maxRS.result) maxRS.result = null;
  if (maxRS.historyIndex) maxRS.historyIndex = null;
}

function parseInstruction(instructionStr: string) {
  const instructionParts = instructionStr.split(" ")

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
  };
}

function getRegister(regName: string, newState: SystemState) {
  const regIndex = Number(regName.substring(1));
  let regFile = regName.startsWith("F")
    ? newState.fpRegisters
    : newState.intRegisters;

  return regFile[regIndex];
}

function countDependencies(state: SystemState, stationName: string) {
  let count = 0;

  for (const rs of state.adderReservationStations.concat(
    state.mulReservationStations
  )) {
    if (rs.qj === stationName || rs.qk === stationName) count++;
  }

  for (const rs of state.storeBuffers) {
    if (rs.q === stationName) count++;
  }

  for (const [regName, reg] of Object.entries(state.fpRegisters)) {
    if (reg.q === stationName) count++;
  }

  for (const [regName, reg] of Object.entries(state.intRegisters)) {
    if (reg.q === stationName) count++;
  }

  return count;
}

function getReservationStationWithMaxDependencies(state: SystemState) {
  let maxRS;
  let maxCount = 0;

  for (const rs of state.adderReservationStations.concat(
    state.mulReservationStations
  )) {
    if (rs.result == null) continue;

    const reservationStationName =
      state.instructionHistory[rs.historyIndex!].stationName;
    const count = countDependencies(state, reservationStationName);
    
    if (count > maxCount) {
      maxCount = count;
      maxRS = rs;
    }
    
    if (count == maxCount && maxRS && rs.historyIndex! < maxRS.historyIndex!) {
      maxRS = rs;
    }
  }

  for (const rs of state.loadBuffers) {
    if (rs.result == null) continue;

    const reservationStationName =
      state.instructionHistory[rs.historyIndex!].stationName;
    const count = countDependencies(state, reservationStationName);
    if (count > maxCount) {
      maxCount = count;
      maxRS = rs;
    }
    
    if (count == maxCount && maxRS && rs.historyIndex! < maxRS.historyIndex!) {
      maxRS = rs;
    }
  }

  return maxRS;
}

function hasBranch(state: SystemState) {
  for (const rs of state.adderReservationStations) {
    if (rs.op === InstructionType.BNEZ && rs.timeRemaining == null) return true;
  }

  return false;
}

function getInstructionIndexWithLabel(state: SystemState, label: string) {
  for (let i = 0; i < state.instructions.length; i++) {
    if (state.instructions[i].startsWith(label)) return i;
  }

  return -1;
}
