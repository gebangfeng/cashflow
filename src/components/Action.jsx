import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
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
  const { actionType, setActionType } = useContext(GameContext)
  const [dialog, setDialog] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    switch (actionType) {
      case 'start':
      case 'payday':
        // No dialog for start/payday - player uses fingerprint button to roll
        setDialog(null)
        setIsVisible(false)
        break
      case 'repay':
        setDialog(<RepayDialog {...mockRepayDialog} />)
        setIsVisible(true)
        break
      case 'downsized':
        setDialog(<DownsizedDialog />)
        setIsVisible(true)
        break
      case 'baby':
        setDialog(<BabyDialog />)
        setIsVisible(true)
        break
      case 'opportunity':
        setDialog(<OpportunityDialog />)
        setIsVisible(true)
        break
      case 'opportunity-stock':
        setDialog(<OpportunityStockDetails />)
        setIsVisible(true)
        break
      case 'opportunity-stock-split':
        setDialog(<OpportunityStockSplitDetails />)
        setIsVisible(true)
        break
      case 'opportunity-estate':
        setDialog(<OpportunityEstateDetails />)
        setIsVisible(true)
        break
      case 'opportunity-estate-auto':
        setDialog(<OpportunityEstateAutoDetails />)
        setIsVisible(true)
        break
      case 'market':
        setDialog(<MarketDialog />)
        setIsVisible(true)
        break
      case 'doodads':
        setDialog(<DoodadDialog />)
        setIsVisible(true)
        break
      case 'charity':
        setDialog(<CharityDialog />)
        setIsVisible(true)
        break
      case 'borrow':
        setDialog(<BorrowDialog />)
        setIsVisible(true)
        break
      default:
        setDialog(null)
        setIsVisible(false)
        break
    }
  }, [actionType])

  const handleClose = () => {
    setIsVisible(false)
    setActionType('start')
  }

  if (!isVisible || !dialog) return null

  return (
    <ModalOverlay onClick={handleClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHandle />
        <DialogContent>
          {dialog}
        </DialogContent>
      </ModalContent>
    </ModalOverlay>
  )
}

export default Action

//#region styled components
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const ModalOverlay = styled.div({
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.6)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
  padding: '20px',
  animation: `${fadeIn} 0.2s ease`,
})

const ModalContent = styled.div({
  width: 'auto',
  minWidth: '280px',
  maxWidth: '340px',
  background: 'linear-gradient(180deg, #1e2744 0%, #151c32 100%)',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  animation: `${scaleIn} 0.25s ease`,
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
})

const ModalHandle = styled.div({
  width: '32px',
  height: '3px',
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '2px',
  margin: '10px auto 0',
})

const DialogContent = styled.div({
  overflow: 'auto',
  padding: '12px 16px 20px',
})
//#endregion styled components
