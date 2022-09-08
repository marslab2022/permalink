import Arweave from 'arweave';
import {
  WarpFactory,
  LoggerFactory,
} from 'warp-contracts';
import { contractTxId } from '../Defines';
/* global BigInt */

export const arweave = Arweave.init({
  host: 'www.arweave.net',
  port: 443,
  protocol: 'https',
});
LoggerFactory.INST.logLevel('error');

const warp = WarpFactory.forMainnet(undefined, undefined, arweave);
let contract = undefined;
let walletAddress = undefined;
let isConnectWallet = false;

export function connectContract() {
  contract = warp.contract(contractTxId).setEvaluationOptions({
    ignoreExceptions: false,
  });
}

export function getWalletAddress() {
  return walletAddress;
}

export async function connectWallet(walletJwk) {
  contract = contract.connect(walletJwk);
  walletAddress = await arweave.wallets.jwkToAddress(walletJwk);
  isConnectWallet = true;
}

export async function readState() {
  if (!contract) {
    return {status: false, result: 'contract connection error'};
  }
  let result = "";
  let status = true;
  try {
    result = (await contract.readState()).cachedValue.state;
  } catch (error) {
    status = false;
    result = 'read contract state error';
  }
  return {status: status, result: result};
}

export async function getLatest() {
  if (!contract) {
    return {status: false, result: 'contract connection error'};
  }
  let result = "";
  let status = true;
  try {
    result = (await contract.dryWrite({
      function: 'getLatest',
    })).result;
    console.log('getLatest result: ', result);
  } catch {
    status = false;
    result = 'read contract state error';
  }
  return {status: status, result: result};
}

export async function update(url, version, description) {
  if (!contract) {
    return {status: false, result: 'contract connection error'};
  }

  let result = "";
  let status = true;
  try {
    result = (await contract.writeInteraction({
      function: 'update',
      params: {
        url,
        version,
        description,
      },
    }));
    console.log('update result: ', result);
  } catch {
    status = false;
    result = 'read contract state error';
  }
  return {status: status, result: result};
}

export const isWellFormattedAddress = (input) => {
  const re = /^[a-zA-Z0-9_]{43}$/;
  return re.test(input);
}

// in miliseconds
var units = {
  year  : 24 * 60 * 60 * 1000 * 365,
  month : 24 * 60 * 60 * 1000 * 365/12,
  day   : 24 * 60 * 60 * 1000,
  hour  : 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000
}

var rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export async function getRelativeTime(createBlock) {
  var elapsed = createBlock - (await arweave.blocks.getCurrent()).height;
  console.log('block elapsed: ', createBlock, (await arweave.blocks.getCurrent()).height);
  elapsed = elapsed * 2 * 60 * 1000;
  // "Math.abs" accounts for both "past" & "future" scenarios
  for (var u in units) 
    if (Math.abs(elapsed) > units[u] || u === 'second') 
      return rtf.format(Math.round(elapsed/units[u]), u)
}
