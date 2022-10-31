import React from 'react';
import connectLogo from '../assets/connect.svg';

export const Hint = ({ hint }: { hint: 'download extension' | 'connect wallet' }) => {
  if (hint === 'connect wallet') {
    return (
      <div className='hint'>
        <p className='mb-4'>
          To continue working with the site, you need to connect the wallet and allow the site
          access to the account
        </p>
      </div>
    );
  }

  return null;
};
