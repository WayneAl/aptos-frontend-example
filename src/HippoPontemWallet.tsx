import React, { useEffect, useState, SyntheticEvent, useCallback } from 'react';
import { useWallet, WalletName } from '@manahippo/aptos-wallet-adapter';
import { TAptosCreateTx } from './types';
import { camelCaseKeysToUnderscore } from './utils';
import { SendTransaction, Address, BasicModal, Hint } from './components';
import { localStorageKey } from './components/consts';
import { AptosClient, Types } from 'aptos';

export const HippoPontemWallet = ({ autoConnect }: { autoConnect: boolean }) => {
  const { account, connected, wallets, wallet, disconnect, select, signAndSubmitTransaction } =
    useWallet();

  const [currentAdapterName, setAdapterName] = useState<string | undefined>(wallet?.adapter.name);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState(account?.address);
  const onModalClose = () => setIsModalOpen(false);
  const onModalOpen = () => setIsModalOpen(true);

  const [client, setClient] = useState(new AptosClient('https://fullnode.devnet.aptoslabs.com'));
  useEffect(() => {
    if (!wallet) return;
    if (!wallet.adapter.url) return;
    const client = new AptosClient(wallet.adapter.url);
    setClient(client);
  }, [wallet]);

  const adapters = wallets.map((item) => ({
    name: item?.adapter.name,
    icon: item?.adapter.icon,
  }));

  const handleSendTransaction = async (tx: TAptosCreateTx) => {
    const payload = camelCaseKeysToUnderscore(tx.payload);
    const options = {
      max_gas_amount: tx?.maxGasAmount,
      gas_unit_price: tx?.gasUnitPrice,
      expiration_timestamp_secs: tx?.expiration,
    };
    try {
      const { hash } = await signAndSubmitTransaction(payload, options);
      return hash;
    } catch (e) {
      console.log(e);
    }
  };

  const handleDisconnect = useCallback(async () => {
    try {
      await disconnect();
    } catch (error) {
      console.log(error);
    } finally {
      setAdapterName(undefined);
    }
  }, [disconnect]);

  const handleAdapterClick = useCallback(
    async (event: SyntheticEvent<HTMLButtonElement>) => {
      const walletName = (event.currentTarget as HTMLButtonElement).getAttribute('data-value');
      try {
        if (walletName) {
          select(walletName as WalletName);
          setAdapterName(walletName);
          onModalClose();
        }
      } catch (error) {
        console.log(error);
      }
    },
    [disconnect, select]
  );

  useEffect(() => {
    setCurrentAddress(account?.address);
  }, [account]);

  useEffect(() => {
    let alreadyConnectedWallet = localStorage.getItem(localStorageKey);
    if (alreadyConnectedWallet) {
      if (alreadyConnectedWallet.startsWith('"')) {
        alreadyConnectedWallet = JSON.parse(alreadyConnectedWallet) as string;
      }
      setAdapterName(alreadyConnectedWallet);
    }
  }, [currentAddress]);

  // Check for the module; show publish instructions if not present.
  const [modules, setModules] = React.useState<Types.MoveModuleBytecode[]>([]);
  React.useEffect(() => {
    if (!currentAddress) return;
    client.getAccountModules(currentAddress).then(setModules);
  }, [currentAddress]);

  const hasModule = modules.some((m) => {
    console.log(m);
    return m.abi?.name === 'message';
  });

  // Call set_message with the textarea value on submit.
  const ref = React.createRef<HTMLTextAreaElement>();
  const [isSaving, setIsSaving] = React.useState(false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!ref.current) return;

    const input = ref.current.value;

    const transaction = {
      type: 'entry_function_payload',
      function: `${currentAddress}::message::set_message`,
      arguments: [input],
      type_arguments: [],
    };

    try {
      setIsSaving(true);
      await window.aptos.signAndSubmitTransaction(transaction);
    } finally {
      setIsSaving(false);
    }
  };

  // Get the message from account resources.
  const [resources, setResources] = React.useState<Types.MoveResource[]>([]);
  React.useEffect(() => {
    if (!currentAddress) return;
    client.getAccountResources(currentAddress).then(setResources);
  }, [currentAddress]);
  const resourceType = `${currentAddress}::message::MessageHolder`;
  const resource = resources.find((r) => r.type === resourceType);
  const data = resource?.data as { message: string } | undefined;
  const rev = data?.message;

  return (
    <div className='wallet'>
      {!connected && (
        <button className='w-button' onClick={onModalOpen}>
          Connect wallet
        </button>
      )}
      {connected && (
        <button className='w-button' onClick={handleDisconnect}>
          Disconnect wallet
        </button>
      )}

      <Address walletName={currentAdapterName} address={currentAddress} />

      {connected && (
        <SendTransaction sender={currentAddress} onSendTransaction={handleSendTransaction} />
      )}

      {!connected && <Hint hint={'connect wallet'} />}

      {hasModule && (
        <form onSubmit={handleSubmit}>
          <textarea ref={ref} defaultValue={rev} />
          <input disabled={isSaving} type='submit' />
        </form>
      )}

      <BasicModal
        adapters={adapters}
        isOpen={isModalOpen}
        handleClose={onModalClose}
        handleAdapterClick={handleAdapterClick}
      />
    </div>
  );
};
