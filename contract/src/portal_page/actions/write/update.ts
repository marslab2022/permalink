import { ContractResult, Action, State } from '../../types/types';

declare const ContractError;

export const update = async (
  state: State,
  action: Action,
): Promise<ContractResult> => {
  if (action.caller !== state.owner) {
    throw new ContractError(`You do not have permission to make a commit`);
  }
  if (typeof(action.input.params.version) !== 'string') {
    throw new ContractError(`Version must be string`);
  }
  if (typeof(action.input.params.url) !== 'string') {
    throw new ContractError(`Url must be string`);
  }
  if (typeof(action.input.params.description) !== 'string') {
    throw new ContractError(`Description must be string`);
  }

  state.commits.push({
    version: action.input.params.version,
    commitBlockHeight: Number(SmartWeave.block.height),
    description: action.input.params.description,
    url: action.input.params.url,
  });
  
  return { state };
};
