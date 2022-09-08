import './App.css';

import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { ProgressSpinner } from './components/ProgressSpinner';
import { connectContract, connectWallet, getLatest, getWalletAddress } from './lib/api';
import { Commit } from './components/Commit';
import { WalletSelectButton } from './components/WalletSelectButton';
import { NewCommit } from './components/NewCommit';
import { MoreCommits } from './components/MoreCommits';
import { adminWalletAddress } from './Defines';

connectContract();

const App = () => {
  return (
    <div id="app">
      <div id="content">
        <main>
          <Routes>
            <Route path="/" name="" element={<Home />} />
            <Route path="/more" element={<More />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Home = (props) => {
  const [isSearching, setIsSearching] = React.useState(true);
  const [interactionError, setInteractionError] = React.useState("");
  const [url, setUrl] = React.useState("");
  const [version, setVersion] = React.useState("");
  const [description, setDescription] = React.useState("");

  React.useEffect(async () => {
    getLatest().then(ret => {
      setIsSearching(false);
      if (ret.status === false) {
        setInteractionError(ret.result);
        return;
      } else {
        if (ret.result === null) {
          setInteractionError('No commits found');
          return;
        }
        setUrl(ret.result.url);
        setVersion(ret.result.version);
        setDescription(ret.result.description);
      }
    });
  }, []);

  return (
    <>
      <header>PermaLink</header>
      {isSearching && <ProgressSpinner />}
      { 
        !isSearching && interactionError === ''
        &&
        <Commit 
          url = {url}
          version = {version}
          description= {description}
        />
      }
      {
        interactionError !== '' 
        &&
        <div className='darkRow'> {interactionError} </div>
      }
      <div className='center'>
        <Link to="/more">more</Link>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Link to="/admin">admin</Link>
      </div>
    </>
  );
};

const More = (props) => {
  return (
    <>
      <header>More</header>
      <MoreCommits />
    </>
  );
};

const Admin = (props) => {
  const [isWalletConnected, setIsWalletConnected] = React.useState(false);
  const [walletAddress, setWalletAddress] = React.useState();

  React.useEffect(async () => {
    if (isWalletConnected) {
      await connectWallet('use_wallet');
      setWalletAddress(getWalletAddress());
    }
  }, [isWalletConnected]);

  return (
    <>
      <header>
        <div>Admin</div>
      </header>
      { isWalletConnected && adminWalletAddress === walletAddress && <NewCommit />}
      { isWalletConnected && adminWalletAddress !== walletAddress && <div className='darkRow'> Permission Denied </div>}
      { 
        !isWalletConnected &&
        <div className='walletDiv'>
          <WalletSelectButton setIsConnected={value => setIsWalletConnected(value)} />
        </div>
      }
    </>
  );
};

export default App;