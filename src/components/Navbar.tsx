import React from 'react';
import logo from '../logo.svg';

export default function Navbar() {
  return (
    <nav>
      <img src={logo} className='nav--icon' />
      <h3 className='nav--logo_text'>Aptos</h3>
      <h4 className='nav--title'>Hello Blockchain</h4>
    </nav>
  );
}

function ConnectWallet() {
  // Retrieve aptos.account on initial render and store it.
  const [address, setAddress] = React.useState<string | null>(null);
  React.useEffect(() => {
    window.aptos.account().then((data: { address: string }) => {
      setAddress(data.address);
    });
  }, [address]);

  const Connect = async () => {
    try {
      await window.aptos.connect();
    } catch (e) {
      console.error(e);
    }
  };

  const Disconnect = async () => {
    try {
      await window.aptos.disconnect();
    } catch (e) {
      console.error(e);
    }
  };

  return address ? (
    <button className='w-button' onClick={Disconnect}>
      Disconnect wallet
    </button>
  ) : (
    <button className='w-button' onClick={Connect}>
      Connect wallet
    </button>
  );
}
