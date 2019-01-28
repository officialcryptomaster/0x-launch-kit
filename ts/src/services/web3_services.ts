import {ADDRESS_BOOK, RPC_URL} from '../config';

const Web3 = require("web3");
const web3 = new Web3(new Web3(RPC_URL));

const OptionsRegistry = require("../../../artifacts/OptionsRegistry.json");

const getRegistryInstance = async (): Promise<any> => {
    return new web3.eth.Contract(
      OptionsRegistry.abi,
      ADDRESS_BOOK.OptionsRegistry,
    );
  };

export interface TokenMetadata {
    [index: string]: string;
    readonly market: string;
    readonly topic: string;
}

export interface TokenAddressToMetadataMap {
    [index: string]: TokenMetadata;
}

export const getLongShortTokenMetadata = async (): Promise<TokenAddressToMetadataMap | null> => {
    const registryInstance = await getRegistryInstance();
    let markets: string[] = [];
    try {
        markets = await registryInstance.methods.getMarkets().call();
    } catch (err) {
        console.error(err);
        return null;
    }

    const tokenAddressToMetadata: TokenAddressToMetadataMap = {};
    markets.forEach(
        async (market: string) => {
        let marketData = null;
        try {
            marketData = await registryInstance.methods
            .getMarket(market)
            .call();
        } catch (err) {
            console.error(err);
        }
        if (marketData) {
            const metadata: TokenMetadata = {
                'market': market,
                'topic': marketData.topic,
            };
            tokenAddressToMetadata[marketData.longToken] = metadata;
            tokenAddressToMetadata[marketData.shortToken] = metadata;
        }
    });
    return tokenAddressToMetadata;
};