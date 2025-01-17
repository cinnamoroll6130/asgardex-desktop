import { useCallback, useMemo, useRef } from 'react'

import * as RD from '@devexperts/remote-data-ts'
import { THORChain } from '@xchainjs/xchain-thorchain'
import {
  AnyAsset,
  assetToString,
  BaseAmount,
  baseToAsset,
  Chain,
  formatAssetAmountCurrency,
  formatBN
} from '@xchainjs/xchain-util'
import { Grid } from 'antd'
import { ColumnsType, ColumnType } from 'antd/lib/table'
import BigNumber from 'bignumber.js'
import * as A from 'fp-ts/lib/Array'
import * as FP from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import { useObservableState } from 'observable-hooks'
import { useIntl } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { FlatButton } from '../../components/uielements/button'
import { PoolsPeriodSelector } from '../../components/uielements/pools/PoolsPeriodSelector'
import { Table } from '../../components/uielements/table'
import { DEFAULT_WALLET_TYPE } from '../../const'
import { useMidgardContext } from '../../contexts/MidgardContext'
import { useMidgardMayaContext } from '../../contexts/MidgardMayaContext'
import { ordBigNumber } from '../../helpers/fp/ord'
import { sequenceTRD } from '../../helpers/fpHelpers'
import * as PoolHelpers from '../../helpers/poolHelper'
import { MAYA_PRICE_POOL } from '../../helpers/poolHelperMaya'
import { getSaversTableRowsData, ordSaversByDepth } from '../../helpers/savers'
import { useDex } from '../../hooks/useDex'
import { useNetwork } from '../../hooks/useNetwork'
import { usePoolWatchlist } from '../../hooks/usePoolWatchlist'
import { useSynthConstants } from '../../hooks/useSynthConstants'
import * as poolsRoutes from '../../routes/pools'
import * as saversRoutes from '../../routes/pools/savers'
import { PoolsState as PoolStateMaya, PoolDetails as PoolDetailsMaya } from '../../services/mayaMigard/types'
import { GetPoolsPeriodEnum, PoolDetails, PoolsState } from '../../services/midgard/types'
import type { MimirHalt } from '../../services/thorchain/types'
import * as Shared from '../pools/PoolsOverview.shared'
import type { SaversTableRowData, SaversTableRowsData } from './Savers.types'

export type Props = {
  haltedChains: Chain[]
  mimirHalt: MimirHalt
  walletLocked: boolean
}

export const SaversOverview: React.FC<Props> = (props): JSX.Element => {
  const { haltedChains, mimirHalt, walletLocked } = props
  const intl = useIntl()
  const navigate = useNavigate()
  const { network } = useNetwork()
  const { dex } = useDex()

  const {
    service: {
      pools: { poolsState$, reloadPools, selectedPricePool$, poolsPeriod$, setPoolsPeriod }
    }
  } = useMidgardContext()
  const {
    service: {
      pools: {
        poolsState$: mayaPoolsState$,
        reloadPools: reloadMayaPools,
        selectedPricePool$: selectedPricePoolMaya$,
        poolsPeriod$: poolsPeriodMaya$,
        setPoolsPeriod: setPoolsPeriodMaya
      }
    }
  } = useMidgardMayaContext()

  const poolsPeriod = useObservableState(
    dex.chain === THORChain ? poolsPeriod$ : poolsPeriodMaya$,
    GetPoolsPeriodEnum._30d
  )

  const { maxSynthPerPoolDepth: maxSynthPerPoolDepthRD, reloadConstants } = useSynthConstants()

  const refreshHandler = useCallback(() => {
    if (dex.chain === THORChain) {
      reloadPools()
    } else {
      reloadMayaPools()
    }
    reloadConstants()
  }, [dex, reloadConstants, reloadPools, reloadMayaPools])

  const selectedPricePool = useObservableState(
    dex.chain === THORChain ? selectedPricePool$ : selectedPricePoolMaya$,
    dex.chain === THORChain ? PoolHelpers.RUNE_PRICE_POOL : MAYA_PRICE_POOL
  )

  const poolsRD = useObservableState(dex.chain === THORChain ? poolsState$ : mayaPoolsState$, RD.pending)

  // store previous data of pools to render these while reloading
  const previousSavers = useRef<O.Option<SaversTableRowsData>>(O.none)

  const isDesktopView = Grid.useBreakpoint()?.lg ?? false

  const { add: addPoolToWatchlist, remove: removePoolFromWatchlist, list: poolWatchList } = usePoolWatchlist()

  const depthColumn = useCallback(
    <T extends { asset: AnyAsset; depth: BaseAmount; depthPrice: BaseAmount }>(
      pricePoolAsset: AnyAsset
    ): ColumnType<T> => ({
      key: 'depth',
      align: 'right',
      title: intl.formatMessage({ id: 'common.liquidity' }),
      render: ({ asset, depth, depthPrice }: { asset: AnyAsset; depth: BaseAmount; depthPrice: BaseAmount }) => (
        <div className="flex flex-col items-end justify-center font-main">
          <div className="whitespace-nowrap text-16 text-text0 dark:text-text0d">
            {formatAssetAmountCurrency({
              amount: baseToAsset(depth),
              asset,
              decimal: 3
            })}
          </div>
          <div className="whitespace-nowrap text-14 text-gray2 dark:text-gray2d">
            {formatAssetAmountCurrency({
              amount: baseToAsset(depthPrice),
              asset: pricePoolAsset,
              decimal: 2
            })}
          </div>
        </div>
      ),
      sorter: ordSaversByDepth,
      sortDirections: ['descend', 'ascend'],
      // Note: `defaultSortOrder` has no effect here, that's we do a default sort in `getPoolTableRowsData`
      defaultSortOrder: 'descend'
    }),
    [intl]
  )

  const aprColumn = useCallback(
    <T extends { apr: BigNumber }>(
      poolsPeriod: GetPoolsPeriodEnum | GetPoolsPeriodEnum,
      dex: string // Add a parameter to accept the 'dex' value
    ): ColumnType<T> => {
      // Determine which setPoolsPeriod function to use based on the 'dex' value
      const currentSetPoolsPeriod = dex === THORChain ? setPoolsPeriod : setPoolsPeriodMaya

      return {
        key: 'apr',
        align: 'center',
        title: (
          <div className="flex flex-col items-center">
            <div className="font-main text-[12px]">{intl.formatMessage({ id: 'pools.apr' })}</div>
            <PoolsPeriodSelector selectedValue={poolsPeriod} onChange={currentSetPoolsPeriod} />
          </div>
        ),
        render: ({ apr }: { apr: BigNumber }) => <div className="font-main text-16">{formatBN(apr, 2)}%</div>,
        sorter: (a: { apr: BigNumber }, b: { apr: BigNumber }) => ordBigNumber.compare(a.apr, b.apr),
        sortDirections: ['descend', 'ascend']
      }
    },
    [intl, setPoolsPeriod, setPoolsPeriodMaya]
  )

  const filledColumn = useCallback(
    <T extends { filled: BigNumber }>(): ColumnType<T> => ({
      key: 'filled',
      align: 'center',
      title: intl.formatMessage({ id: 'pools.filled' }),
      render: ({ filled }: { filled: BigNumber }) => (
        <div className="flex flex-col justify-start">
          <div className="font-main text-16">{formatBN(filled, 2)}%</div>
          <div className="relative my-[6px] h-[5px] w-full bg-gray1 dark:bg-gray1d">
            <div
              className="absolute h-[5px] bg-turquoise"
              style={{ width: `${Math.min(filled.toNumber(), 100) /* max. 100% */}%` }}></div>
          </div>
        </div>
      ),
      sorter: (a: { filled: BigNumber }, b: { filled: BigNumber }) => ordBigNumber.compare(a.filled, b.filled),
      sortDirections: ['descend', 'ascend']
    }),
    [intl]
  )

  const renderBtnColumn = useCallback(
    (_: string, { asset }: { asset: AnyAsset }) => {
      const { chain } = asset
      const disableAllPoolActions = PoolHelpers.disableAllActions({ chain, haltedChains, mimirHalt })
      const disableTradingActions = PoolHelpers.disableTradingActions({
        chain,
        haltedChains,
        mimirHalt
      })
      const disablePoolActions = PoolHelpers.disablePoolActions({
        chain,
        haltedChains,
        mimirHalt
      })

      const disabled =
        disableAllPoolActions || disableTradingActions || disablePoolActions || walletLocked || dex.chain === 'MAYA'

      const onClickHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault()
        event.stopPropagation()
        navigate(saversRoutes.earn.path({ asset: assetToString(asset), walletType: DEFAULT_WALLET_TYPE }))
      }

      return (
        <div className="relative flex flex-col items-center justify-center">
          <FlatButton className="min-w-[120px]" disabled={disabled} size="normal" onClick={onClickHandler}>
            {intl.formatMessage({ id: 'common.earn' })}
          </FlatButton>
        </div>
      )
    },

    [dex, haltedChains, intl, mimirHalt, navigate, walletLocked]
  )

  const btnColumn = useCallback(
    <T extends { asset: AnyAsset }>(): ColumnType<T> => ({
      key: 'btn',
      title: Shared.renderRefreshBtnColTitle({
        title: intl.formatMessage({ id: 'common.refresh' }),
        clickHandler: refreshHandler,
        iconOnly: !isDesktopView
      }),
      width: 280,
      render: renderBtnColumn
    }),
    [refreshHandler, intl, renderBtnColumn, isDesktopView]
  )

  const desktopColumns: ColumnsType<SaversTableRowData> = useMemo(
    () => [
      Shared.watchColumn(addPoolToWatchlist, removePoolFromWatchlist),
      Shared.poolColumn(intl.formatMessage({ id: 'common.pool' })),
      Shared.assetColumn(intl.formatMessage({ id: 'common.asset' })),
      depthColumn<SaversTableRowData>(selectedPricePool.asset),
      filledColumn<SaversTableRowData>(),
      aprColumn<SaversTableRowData>(poolsPeriod, dex.chain),
      btnColumn()
    ],
    [
      addPoolToWatchlist,
      aprColumn,
      btnColumn,
      depthColumn,
      filledColumn,
      poolsPeriod,
      intl,
      removePoolFromWatchlist,
      selectedPricePool.asset,
      dex
    ]
  )

  const mobileColumns: ColumnsType<SaversTableRowData> = useMemo(
    () => [
      Shared.poolColumnMobile<SaversTableRowData>(intl.formatMessage({ id: 'common.pool' })),
      Shared.assetColumn<SaversTableRowData>(intl.formatMessage({ id: 'common.asset' })),
      btnColumn()
    ],
    [btnColumn, intl]
  )

  const renderTable = useCallback(
    (tableData: SaversTableRowsData, loading = false) => {
      const columns = isDesktopView ? desktopColumns : mobileColumns

      return (
        <>
          <Table
            columns={columns}
            dataSource={tableData}
            loading={loading}
            rowKey="key"
            onRow={({ asset }: SaversTableRowData) => {
              return {
                onClick: () => {
                  navigate(poolsRoutes.detail.path({ asset: assetToString(asset) }))
                }
              }
            }}
          />
        </>
      )
    },
    [desktopColumns, isDesktopView, mobileColumns, navigate]
  )

  return (
    <>
      {FP.pipe(
        sequenceTRD(poolsRD, maxSynthPerPoolDepthRD),
        RD.fold(
          // initial state
          () => renderTable([], true),
          // loading state
          () => {
            const pools = O.getOrElse(() => [] as SaversTableRowsData)(previousSavers.current)
            return renderTable(pools, true)
          },
          // render error state
          Shared.renderTableError(intl.formatMessage({ id: 'common.refresh' }), refreshHandler),
          // success state
          ([pools, maxSynthPerPoolDepth]): JSX.Element => {
            const { poolDetails }: PoolsState | PoolStateMaya = pools
            // filter chain assets
            const poolDetailsFiltered: PoolDetails | PoolDetailsMaya = FP.pipe(
              poolDetails,
              A.filter(({ saversDepth }) => Number(saversDepth) > 0)
            )

            const poolViewData = getSaversTableRowsData({
              poolDetails: poolDetailsFiltered,
              pricePoolData: selectedPricePool.poolData,
              watchlist: poolWatchList,
              maxSynthPerPoolDepth,
              network
            })
            previousSavers.current = O.some(poolViewData)
            return renderTable(poolViewData)
          }
        )
      )}
    </>
  )
}
