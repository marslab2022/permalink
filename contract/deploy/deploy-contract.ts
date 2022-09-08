import fs from 'fs';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import path from 'path';
import {
  Warp,
  WarpNodeFactory,
  LoggerFactory,
} from 'warp-contracts';

let arweave: Arweave;
let warp: Warp;

let walletJwk: JWKInterface;
let walletAddress: string;

let contractSrc: string;
let contractInit: Object;

let contractTxId: string;

(async () => {
  console.log('Running...');
  arweave = Arweave.init({
    host: 'www.arweave.net',
    port: 443,
    protocol: 'https',
  });

  LoggerFactory.INST.logLevel('error');

  warp = WarpNodeFactory.memCachedBased(arweave).useArweaveGateway().build();

  walletJwk = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'key-file.json'), 'utf8')
  );
  walletAddress = await arweave.wallets.jwkToAddress(walletJwk);
  console.log('Current wallet selected to deploy contract is: ', walletAddress);

  // deploy contract
  contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');
  const pstInitFromFile = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../dist/portal_page/initial-state.json'), 'utf8')
  );
  contractInit = {
    ...pstInitFromFile,
    owner: walletAddress,
  };
  contractTxId = await warp.createContract.deploy({
    wallet: walletJwk,
    initState: JSON.stringify(contractInit),
    src: contractSrc,
  });

  console.log('ContractTxId: ', contractTxId);
  fs.writeFileSync(path.join(__dirname, 'contract-txid.json'), contractTxId);
})();
