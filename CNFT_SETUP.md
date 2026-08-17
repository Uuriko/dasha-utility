# $DASHA cNFT (Compressed NFT) Setup Guide

## Overview

We use **Metaplex Bubblegum** so that Studio creations can be minted cheaply as permanent on-chain artifacts.

### High-level flow for a user

1. Create meme in Studio
2. Click "Make Permanent"
3. Burn a small amount of $DASHA (ritual cost)
4. Image + metadata are uploaded (Arweave recommended)
5. cNFT is minted to the user's wallet via Bubblegum

## One-time Setup (Project Side)

### 1. Create the Merkle Tree

```ts
import { createDashaTree } from './lib/bubblegum';

const { treeAddress, signature } = await createDashaTree(RPC_URL, wallet, {
  maxDepth: 14,        // ~16k capacity
  maxBufferSize: 64,
});

console.log('Tree created:', treeAddress.toString());
```

### 2. Metadata Upload

Before calling `mintDashaArtifact`, upload image + JSON metadata to Arweave via Irys.

### 3. Mint

```ts
import { mintDashaArtifact } from './lib/bubblegum';

const { signature } = await mintDashaArtifact({
  rpcUrl: RPC_URL,
  wallet,
  treeAddress: 'YOUR_TREE_ADDRESS',
  metadataUri: 'https://arweave.net/...',
  name: 'Dasha Meme #042',
  symbol: 'DASHA',
  sellerFeeBasisPoints: 0,
});
```

See `src/lib/bubblegum.ts` and `src/components/MintButton.tsx`.
