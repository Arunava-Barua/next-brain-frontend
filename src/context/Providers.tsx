'use client';
 
import type { ReactNode } from 'react';
import { OnchainKitProvider } from '@coinbase/onchainkit';
import { base } from 'wagmi/chains'; // add baseSepolia for testing
 
export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey="API_KEY_HERE"
      chain={base} // add baseSepolia for testing
    >
      {props.children}
    </OnchainKitProvider>
  );
}