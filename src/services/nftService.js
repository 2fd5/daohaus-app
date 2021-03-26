import Web3 from 'web3';

import NFTAbi from '../contracts/nft.json';

import { chainByID } from '../utils/chain';

export const NFTService = ({
  web3,
  chainID,
  tokenAddress,
  atBlock = 'latest',
}) => {
  if (!web3) {
    const rpcUrl = chainByID(chainID).rpc_url;
    web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
  }
  const abi = NFTAbi;
  console.log('abi, tokenAddress', abi, tokenAddress);
  const contract = new web3.eth.Contract(abi, tokenAddress);
  return (service) => {
    if (service === 'tokenOfOwnerByIndex') {
      return async ({ accountAddr, index }) => {
        try {
          console.log('accountAddr, index', accountAddr, index);
          const tokenOfOwnerByIndex = await contract.methods
            .tokenOfOwnerByIndex(accountAddr, index)
            .call();
          console.log('tokenOfOwnerByIndex', tokenOfOwnerByIndex);
          return tokenOfOwnerByIndex;
        } catch (error) {
          console.error('ERR:', error);
        }
      };
    }
    if (service === 'tokenURI') {
      return async ({ tokenId }) => {
        console.log('get token URI for', tokenId);
        try {
          const tokenURI = await contract.methods.tokenURI(tokenId).call();
          return tokenURI;
        } catch (error) {
          console.error('ERR:', error);
        }
      };
    }
  };
};
