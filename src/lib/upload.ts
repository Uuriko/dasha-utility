/**
 * $DASHA Metadata Upload (Arweave via Irys)
 */
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys';
import { createGenericFile } from '@metaplex-foundation/umi';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import type { WalletAdapter } from '@solana/wallet-adapter-base';

export interface DashaMetadataInput {
  image: File | Blob;
  name: string;
  description?: string;
  attributes?: Array<{ trait_type: string; value: string | number }>;
  wallet: WalletAdapter;
  rpcUrl?: string;
}

export interface DashaUploadResult {
  metadataUri: string;
  imageUri: string;
}

export async function uploadDashaMetadata(input: DashaMetadataInput): Promise<DashaUploadResult> {
  const {
    image, name,
    description = 'A permanent cultural artifact from the $DASHA Studio on getdasha.com.',
    attributes = [], wallet,
    rpcUrl = 'https://api.mainnet-beta.solana.com',
  } = input;
  if (!wallet.publicKey) throw new Error('Wallet not connected');
  const umi = createUmi(rpcUrl).use(walletAdapterIdentity(wallet as any)).use(irysUploader());
  const buffer = new Uint8Array(await image.arrayBuffer());
  const contentType = (image as File).type || 'image/png';
  const fileName = (image as File).name || 'dasha-artifact.png';
  const genericFile = createGenericFile(buffer, fileName, { contentType });
  const [imageUri] = await umi.uploader.upload([genericFile]);
  const metadata = {
    name, symbol: 'DASHA', description, image: imageUri,
    attributes: [{ trait_type: 'Origin', value: 'getdasha.com Studio' }, ...attributes],
    properties: {
      category: 'image',
      files: [{ uri: imageUri, type: contentType }],
      creators: [{ address: wallet.publicKey.toBase58(), share: 100 }],
    },
  };
  const metadataUri = await umi.uploader.uploadJson(metadata);
  return { metadataUri, imageUri };
}
