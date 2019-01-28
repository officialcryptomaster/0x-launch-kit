import {assetDataUtils} from '0x.js';

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

export interface AssetDataToMetadataMap {
    [index: string]: TokenMetadata;
}

export const getAllTokenMetadata = async (): Promise<AssetDataToMetadataMap> => {
    const registryInstance = await getRegistryInstance();
    const assetDataToMetadata: AssetDataToMetadataMap = {};
    let markets: string[] = [];
    try {
        markets = await registryInstance.methods.getMarkets().call();
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        return assetDataToMetadata;
    }
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
            const longTokenAssetData = assetDataUtils.encodeERC20AssetData(marketData.longToken);
            const shortTokenAssetData = assetDataUtils.encodeERC20AssetData(marketData.shortToken);
            assetDataToMetadata[longTokenAssetData] = metadata;
            assetDataToMetadata[shortTokenAssetData] = metadata;
        }
    });
    return assetDataToMetadata;
};
