import React from 'react';
import Main from './components/Main';
import Navbar from './components/Navbar';
import {
  PontemWalletAdapter,
  AptosWalletAdapter,
  MartianWalletAdapter,
  FewchaWalletAdapter,
  WalletProvider,
} from '@manahippo/aptos-wallet-adapter';
import { HippoPontemWallet } from './HippoPontemWallet';

const wallets = [
  new PontemWalletAdapter(),
  new MartianWalletAdapter(),
  new AptosWalletAdapter(),
  new FewchaWalletAdapter(),
];

const autoConnect = true;

function App() {
  return (
    <div className='App'>
      <Navbar />
      <WalletProvider wallets={wallets} autoConnect={autoConnect}>
        <HippoPontemWallet autoConnect={autoConnect} />
      </WalletProvider>
    </div>
  );
}

export default App;
