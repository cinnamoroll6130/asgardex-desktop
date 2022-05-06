// tslint:disable
/**
 * Midgard Public API
 * The Midgard Public API queries THORChain and any chains linked via the Bifröst and prepares information about the network to be readily available for public users. The API parses transaction event data from THORChain and stores them in a time-series database to make time-dependent queries easy. Midgard does not hold critical information. To interact with BEPSwap and Asgardex, users should query THORChain directly.
 *
 * The version of the OpenAPI document: 2.6.9
 * Contact: devs@thorchain.org
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

/**
 * @export
 * @interface Int64Constants
 */
export interface Int64Constants {
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    AsgardSize: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    BadValidatorRate: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    BadValidatorRedline: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    BlocksPerYear: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    ChurnInterval: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    ChurnRetryInterval: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    DesiredValidatorSet: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    DoubleSignMaxAge: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    EmissionCurve: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    FailKeygenSlashPoints: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    FailKeysignSlashPoints: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    FullImpLossProtectionBlocks: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    FundMigrationInterval: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    IncentiveCurve: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    JailTimeKeygen: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    JailTimeKeysign: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    LackOfObservationPenalty: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    LiquidityLockUpBlocks: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    MaxAvailablePools: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    MaxSwapsPerBlock: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    MinRunePoolDepth: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    MinSlashPointsForBadValidator: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    MinSwapsPerBlock: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    MinimumBondInRune: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    MinimumNodesForBFT: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    MinimumNodesForYggdrasil: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    NativeTransactionFee: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    NewPoolCycle?: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    ObservationDelayFlexibility: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    ObserveSlashPoints: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    OldValidatorRate: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    OutboundTransactionFee: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    PoolCycle: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    SigningTransactionPeriod: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    VirtualMultSynths: number;
    /**
     * @type {number}
     * @memberof Int64Constants
     */
    YggFundLimit: number;
}
