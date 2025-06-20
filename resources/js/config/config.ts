import { http, createConfig } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors';

const projectId = import.meta.env.VITE_PUBLIC_PROJECT_ID;

if (!projectId ){
  throw Error("ProjectId is required");
}

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({
      projectId: projectId,
    }),
  ],
});
