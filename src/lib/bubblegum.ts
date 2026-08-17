/**
 * $DASHA Bubblegum (cNFT) Helpers
 * 
 * Requires:
 *   npm install @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
 *               @metaplex-foundation/mpl-bubblegum @metaplex-foundation/umi-signer-wallet-adapters
 * 
 * Usage notes:
 * - Create the Merkle tree once (expensive-ish, do it carefully).
 * - Upload image + JSON metadata to Arweave (or IPFS) first → get a permanent URI.
 * - Then call mintDashaArtifact().
 */

import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { 
  mplBubblegum, 
  createTreeV2, 
  mintV2,
} from '@metaplex-foundation/mpl-bubblegum';
import { 
  generateSigner, 
  publicKey, 
  none, 
  some,
  percentAmount,
} from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import type { WalletAdapter } from '@solana/wallet-adapter-base';

export async function createDashaTree(
  rpcUrl: string,
  wallet: WalletAdapter,
  options?: {
    maxDepth?: number;
    maxBufferSize?: number;
  }
) {
  const umi = createUmi(rpcUrl)
    .use(mplBubblegum())
    .use(walletAdapterIdentity(wallet as any));

  const merkleTree = generateSigner(umi);

  const builder = await createTreeV2(umi, {
    merkleTree,
    maxDepth: options?.maxDepth ?? 14,
    maxBufferSize: options?.maxBufferSize ?? 64,
  });

  const result = await builder.sendAndConfirm(umi);

  return {
    treeAddress: merkleTree.publicKey,
    signature: result.signature,
    umi,
  };
}

export interface MintArtifactParams {
  rpcUrl: string;
  wallet: WalletAdapter;
  treeAddress: string;
  metadataUri: string;
  name: string;
  symbol?: string;
  sellerFeeBasisPoints?: number;
}

export async function mintDashaArtifact(params: MintArtifactParams) {
  const {
    rpcUrl,
    wallet,
    treeAddress,
    metadataUri,
    name,
    symbol = 'DASHA',
    sellerFeeBasisPoints = 0,
  } = params;

  if (!wallet.publicKey) {
    throw new Error('Wallet not connected');
  }

  const umi = createUmi(rpcUrl)
    .use(mplBubblegum())
    .use(walletAdapterIdentity(wallet as any));

  const leafOwner = publicKey(wallet.publicKey.toBase58());

  const result = await mintV2(umi, {
    leafOwner,
    merkleTree: publicKey(treeAddress),
    metadata: {
      name,
      symbol,
      uri: metadataUri,
      sellerFeeBasisPoints: percentAmount(sellerFeeBasisPoints / 100),
      collection: none(),
      creators: [
        {
          address: umi.identity.publicKey,
          verified: false,
          share: 100,
        },
      ],
    },
  }).sendAndConfirm(umi);

  return {
    signature: result.signature,
    leafOwner,
  };
}
