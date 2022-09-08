import { ContractResult, Action, State, Result } from '../../types/types';

declare const ContractError;

export const getLatest = async (
  state: State,
  action: Action,
): Promise<ContractResult> => {
  let sz = state.commits.length;
  if (sz === 0) {
    throw new ContractError(`There are no commits!`);
  }

  let result: Result = {
    url: state.commits[sz-1].url,
    version: state.commits[sz-1].version,
    description: state.commits[sz-1].description,
    commitBlockHeight: state.commits[sz-1].commitBlockHeight,
  };
  
  return { result };
};
