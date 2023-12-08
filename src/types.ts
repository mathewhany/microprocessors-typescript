export type ReservationStationEntry = {
  busy: boolean;
  op: string;
  vj: number;
  vk: number;
  qj: string;
  qk: string;
};

export type InstructionHistoryEntry = {
  instruction: string;
  issuedAt: number;
  startExecutionAt: number;
  endExecutionAt: number;
  writeResultAt: number;
};

export type LoadBufferEntry = {
  busy: boolean;
  address: number;
};

export type StoreBufferEntry = {
  busy: boolean;
  address: number;
  v: number;
  q: string;
};

export type RegisterFileEntry = {
  value: number;
  q: string;
};

export type SystemSettings = {
  numOfAdderReservationStations: number;
  numOfMulReservationStations: number;
  numOfLoadBuffers: number;
  numOfStoreBuffers: number;
  numOfFPRegisters: number;
  numOfIntRegisters: number;
  latencies: {
    [key in InstructionType]: number;
  };
  code: string;
  cacheInitialValues: Array<{
    address: number;
    value: number;
  }>;
  fpRegisterFileInitialValues: Array<{
    registerName: number;
    value: number;
  }>;
  intRegisterFileInitialValues: Array<{
    registerName: number;
    value: number;
  }>;
};

export enum InstructionType {
  ADD_D = "ADD.D",
  SUB_D = "SUB.D",
  MUL_D = "MUL.D",
  DIV_D = "DIV.D",
  L_D = "L.D",
  S_D = "S.D",

  ADDI = "ADDI",
  SUBI = "SUBI",

  BNEZ = "BNEZ",
}

export type SystemState = {
  adderReservationStations: ReservationStationEntry[];
  mulReservationStations: ReservationStationEntry[];
  loadBuffers: LoadBufferEntry[];
  storeBuffers: StoreBufferEntry[];
  nextIssue: number;
  currentClock: number;
  instructionHistory: InstructionHistoryEntry[];
  instructions: string[];
  cache: {
    [key: number]: number;
  };
  fpRegisters: {
    [key: number]: RegisterFileEntry;
  };
  intRegisters: {
    [key: number]: RegisterFileEntry;
  };
  notes: string[];
};