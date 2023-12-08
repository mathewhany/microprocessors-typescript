import { SystemSettings, SystemState } from "./types";

export function generateSystemState(
  systemSettings: SystemSettings
): SystemState {
  console.log(systemSettings);
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
  };

  for (let i = 0; i < systemSettings.numOfAdderReservationStations; i++) {
    systemState.adderReservationStations.push({
      busy: false,
      op: "",
      vj: 0,
      vk: 0,
      qj: "",
      qk: "",
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
    });
  }

  for (let i = 0; i < systemSettings.numOfLoadBuffers; i++) {
    systemState.loadBuffers.push({
      busy: false,
      address: 0,
    });
  }

  for (let i = 0; i < systemSettings.numOfStoreBuffers; i++) {
    systemState.storeBuffers.push({
      busy: false,
      address: 0,
      v: 0,
      q: "",
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

  systemState.notes = [];

  issueStage(newState);

  executeStage(newState);

  writeResultStage(newState);

  return newState;
}

function issueStage(newState: SystemState) {}

function executeStage(newState: SystemState) {}

function writeResultStage(newState: SystemState) {}
