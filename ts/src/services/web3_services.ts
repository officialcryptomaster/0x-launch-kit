import { assetDataUtils } from '0x.js';

import { ADDRESS_BOOK, RPC_URL } from '../config';

// tslint:disable-next-line:no-var-requires
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(RPC_URL));

// tslint:disable-next-line:no-var-requires
const OptionsRegistry = require('../../../artifacts/OptionsRegistry.json');

const registryContract = web3.eth.contract(OptionsRegistry.abi);
export const registryInstance = registryContract.at(ADDRESS_BOOK.OptionsRegistry);

export interface TokenMetadata {
    [index: string]: string;
    readonly market: string;
    readonly topic: string;
}

export interface AssetDataToMetadataMap {
    [idex: string]: TokenMetadata;
}

export const getAllTokenMetadata = async (): Promise<AssetDataToMetadataMap> => {
    const assetDataToMetadata: AssetDataToMetadataMap = {};
    let markets: string[] = [];
    try {
        markets = await registryInstance.getMarkets();
    } catch (err) {
        // tslint:disable-next-line:no-console
        console.error(err);
        return assetDataToMetadata;
    }
    markets.forEach(
        async (market: string) => {
            let marketData = null;
            try {
                marketData = await registryInstance.getMarket(market);
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
