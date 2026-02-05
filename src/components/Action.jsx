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
    let content = null
    
    switch (actionType) {
      case 'start':
      case 'payday':
        // No dialog for start/payday - player uses board to roll
        content = null
        break
      case 'repay':
        content = <RepayDialog {...mockRepayDialog} />
        break
      case 'downsized':
        content = <DownsizedDialog />
        break
      case 'baby':
        content = <BabyDialog />
        break
      case 'opportunity':
        content = <OpportunityDialog />
        break
      case 'opportunity-stock':
        content = <OpportunityStockDetails />
        break
      case 'opportunity-stock-split':
        content = <OpportunityStockSplitDetails />
        break
      case 'opportunity-estate':
        content = <OpportunityEstateDetails />
        break
      case 'opportunity-estate-auto':
        content = <OpportunityEstateAutoDetails />
        break
      case 'market':
        content = <MarketDialog />
        break
      case 'doodads':
        content = <DoodadDialog />
        break
      case 'charity':
        content = <CharityDialog />
        break
      case 'borrow':
        content = <BorrowDialog />
        break
      default:
        content = null
        break
    }
    
    setDialog(content)
    setIsVisible(content !== null)
  }, [actionType])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(() => {
      setActionType('start')
    }, 200)
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

const slideUp = keyframes`
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
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

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`

const ModalContent = styled.div({
  width: '100%',
  maxWidth: '340px',
  background: 'linear-gradient(180deg, #1e2744 0%, #151c32 100%)',
  borderRadius: '16px',
  display: 'flex',
  flexDirection: 'column',
  animation: `${scaleIn} 0.25s ease`,
  overflow: 'hidden',
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
