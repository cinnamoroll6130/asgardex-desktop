import React from 'react'

import { AnyAsset } from '@xchainjs/xchain-util'

import * as Styled from './AssetLabel.styles'

/**
 * AssetLabel - Component to show data of an asset:
 *
 * |--------|
 * | ticker |
 * | chain  |
 * |--------|
 *
 */

export type Props = {
  asset: AnyAsset
  // `className` is needed by `styled components`
  className?: string
}

export const AssetLabel: React.FC<Props> = (props): JSX.Element => {
  const { asset, className } = props

  return (
    <Styled.Wrapper className={className}>
      <Styled.Col>
        <Styled.TickerLabel>{asset.ticker}</Styled.TickerLabel>
        <Styled.ChainLabel>{asset.chain}</Styled.ChainLabel>
      </Styled.Col>
    </Styled.Wrapper>
  )
}
