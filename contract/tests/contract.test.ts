import fs from 'fs';
import ArLocal from 'arlocal';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import path from 'path';
import { addFunds, mineBlock } from '../utils/_helpers';
import {
  Warp,
  WarpNodeFactory,
  LoggerFactory,
  Contract,
} from 'warp-contracts';

describe('Testing JArdge Project', () => {
  console.log = function() {};

  let arweave: Arweave;
  let arlocal: ArLocal;
  let warp: Warp;

  let walletJwk: JWKInterface;
  let walletAddress: string;

  let contractSrc: string;
  let contractInit: Object;
  let contract: Contract;
  let contractTxId: string;

  beforeAll(async () => {
    arlocal = new ArLocal(1820);
    await arlocal.start();

    arweave = Arweave.init({
      host: 'localhost',
      port: 1820,
      protocol: 'http',
    });
    LoggerFactory.INST.logLevel('error');

    warp = WarpNodeFactory.forTesting(arweave);
  });

  afterAll(async () => {
    await arlocal.stop();
  });

  async function Initialize() {
    walletJwk = await arweave.wallets.generate();
    await addFunds(arweave, walletJwk);
    walletAddress = await arweave.wallets.jwkToAddress(walletJwk);
    await mineBlocks(1);

    // deploy contract
    contractSrc = fs.readFileSync(path.join(__dirname, '../dist/contract.js'), 'utf8');
    const initFromFile = JSON.parse(
      fs.readFileSync(path.join(__dirname, '../dist/portal_page/initial-state.json'), 'utf8')
    );
    contractInit = {
      ...initFromFile,
      owner: walletAddress,
    };
    contractTxId = await warp.createContract.deploy({
      wallet: walletJwk,
      initState: JSON.stringify(contractInit),
      src: contractSrc,
    });
    contract = warp.contract(contractTxId);
    contract.setEvaluationOptions({
      ignoreExceptions: false,
    }).connect(walletJwk);
    await mineBlocks(1);

  }

  async function mineBlocks(times: number) {
    for (var i = 0; i < times; i ++) {
      await mineBlock(arweave);
    }
  }

  it('test deploy state', async () => {
    await Initialize();
    expect(contractTxId.length).toEqual(43);
    expect(await (await contract.readState()).state).toEqual(contractInit);
  });

  it('test update function', async () => {
    await Initialize();
    const ret = await contract.writeInteraction(
      {
        function: 'update',
        params: {
          url: "https://www.arweave.net/",
          version: '0.0.1',
          description: 'a portal page that can give user single and permanent access to your DApp.',
        },
      },
    );
    await mineBlocks(1);

    expect((await contract.readState()).state['commits'][0]['version']).toEqual('0.0.1');
    expect((await contract.readState()).state['commits'][0]['url']).toEqual('https://www.arweave.net/');
    expect((await contract.readState()).state['commits'][0]['description'])
      .toEqual('a portal page that can give user single and permanent access to your DApp.');
  });

  it('test getLatest function - no commit', async () => {
    await Initialize();
    const ret = await contract.dryWrite({
      function: 'getLatest',
    })

    expect(ret.type).toEqual('error');
    expect(ret.errorMessage).toEqual('There are no commits!');
  });

  it('test getLatest function - has commit', async () => {
    await Initialize();
    await contract.writeInteraction(
      {
        function: 'update',
        params: {
          url: "https://www.arweave.net/",
          version: '0.0.1',
          description: 'a portal page that can give user single and permanent access to your DApp.',
        },
      },
    );
    await mineBlocks(1);

    const ret = await contract.dryWrite({
      function: 'getLatest',
    })
    
    expect(await ret.result['version']).toEqual('0.0.1');
    expect(await ret.result['url']).toEqual('https://www.arweave.net/');
    expect(await ret.result['description'])
      .toEqual('a portal page that can give user single and permanent access to your DApp.');
  });

});
