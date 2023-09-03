export interface PseudoSocketAction {
  action: PseudoSocketActionType,
  options?: PseudoSocketOptions,
}

export enum PseudoSocketActionType {
  Stop,
  GenerateList,
}

export interface PseudoSocketOptions {
  interval: number;
  listSize: number;
}
