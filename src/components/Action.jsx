import styled from '@emotion/styled'
import { colors, breakpoints } from '@/styles'
import { useContext, useEffect, useState } from 'react'
import { GameContext } from '@/utils'
import {
  StartDialog,
  RepayDialog,
  DownsizedDialog,
  BabyDialog,
  OpportunityDialog,
  OpportunityStockDetails,
  MarketDialog,
  DoodadDialog,
  CharityDialog,
  BorrowDialog,
  OpportunityStockSplitDetails,
  OpportunityEstateDetails,
  OpportunityEstateAutoDetails,
} from '@/components'
import { mockRepayDialog } from '@/__mocks__'

const Action = () => {
  const { actionType } = useContext(GameContext)
  const [dialog, setDialog] = useState(null)
  useEffect(() => {
    switch (actionType) {
      case 'start':
      case 'payday':
        setDialog(<StartDialog />)
        break
      case 'repay':
        setDialog(<RepayDialog {...mockRepayDialog} />)
        break
      case 'downsized':
        setDialog(<DownsizedDialog />)
        break
      case 'baby':
        setDialog(<BabyDialog />)
        break
      case 'opportunity':
        setDialog(<OpportunityDialog />)
        break
      case 'opportunity-stock':
        setDialog(<OpportunityStockDetails />)
        break
      case 'opportunity-stock-split':
        setDialog(<OpportunityStockSplitDetails />)
        break
      case 'opportunity-estate':
        setDialog(<OpportunityEstateDetails />)
        break
      case 'opportunity-estate-auto':
        setDialog(<OpportunityEstateAutoDetails />)
        break
      case 'market':
        setDialog(<MarketDialog />)
        break
      case 'doodads':
        setDialog(<DoodadDialog />)
        break
      case 'charity':
        setDialog(<CharityDialog />)
        break
      case 'borrow':
        setDialog(<BorrowDialog />)
        break
      default:
        setDialog(null)
        break
    }
  }, [actionType])
  return <Container>{dialog}</Container>
}

export default Action

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: colors.white,
  borderRadius: '0.75rem',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  padding: '1rem',
  width: '100%',
  height: '100%',
  minHeight: '200px',
  [`@media (min-width: ${breakpoints.md})`]: {
    padding: '1.5rem',
  },
})
//#endregion styled components
