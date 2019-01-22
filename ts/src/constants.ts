import { BigNumber } from '0x.js';

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';
export const ZRX_DECIMALS = 18;
<<<<<<< HEAD
export const DEFAULT_PAGE = 1;
=======
export const DECIMALS = 18;
// tslint:disable-next-line:custom-no-magic-numbers
export const UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2).pow(256).minus(1);
export const DEFAULT_PAGE = 0;
>>>>>>> Fix whitelisting by networkId and port print_utils from starter-project
export const DEFAULT_PER_PAGE = 20;
export const MAX_TOKEN_SUPPLY_POSSIBLE = new BigNumber(2).pow(256); // tslint:disable-line custom-no-magic-numbers
