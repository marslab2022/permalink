import { getLatest } from './actions/read/getLatest';
import { update } from './actions/write/update';
import { ContractResult, Action, Result, State } from './types/types';

declare const ContractError;

export async function handle(state: State, action: Action): Promise<ContractResult> {
  const input = action.input;

  switch (input.function) {
    case 'update':
      return await update(state, action);
    case 'getLatest':
      return await getLatest(state, action);
    default:
      throw new ContractError(`No function supplied or function not recognised: "${input.function}"`);
  }
}
