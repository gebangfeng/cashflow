import styled from '@emotion/styled'
import { colors } from '@/styles'
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
        // No dialog for start/payday - player uses fingerprint button to roll
        setDialog(null)
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
  
  if (!dialog) return null
  
  return <Container>{dialog}</Container>
}

export default Action

//#region styled components
const Container = styled.div({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 100,
  backgroundColor: colors.midnight.darker,
  border: `2px solid ${colors.blilet.dark}`,
  borderRadius: '16px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
  display: 'flex',
  flexDirection: 'column',
  padding: '1.5rem',
  minWidth: '350px',
  maxWidth: '450px',
  maxHeight: '80vh',
  overflowY: 'auto',
})
//#endregion styled components
