import styled from '@emotion/styled'
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
  background: 'rgba(255, 255, 255, 0.05)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '16px',
  minHeight: '200px',
  display: 'flex',
  flexDirection: 'column',
})
//#endregion styled components
