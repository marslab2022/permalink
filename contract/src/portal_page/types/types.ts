export interface State {
  owner: string;
  commits: Commit[];
}

export interface Commit {
  commitBlockHeight: Number;
  version: string;
  description: string;
  url: string;
}

export interface Action {
  input: Input;
  caller: string;
}

export interface Input {
  function: Function;
  params: undefined | updateParams;
}

export interface Result {
  commitBlockHeight: Number;
  version: string;
  description: string;
  url: string;
}

export interface updateParams {
  version: string;
  description: string;
  url: string;
}

export type Function = 'update' | 'getLatest';

export type ContractResult = { result: Result } | { state: State };
