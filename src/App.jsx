import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import './App.css'
import { Board, FinancialStatement, Action } from '@/components'
import { useState, useContext } from 'react'
import { GameContext, getPassiveIncome, getTotalExpenseAmount, currencyFormatter } from '@/utils'

function App() {
  const [showStatement, setShowStatement] = useState(false)
  const { playerData } = useContext(GameContext)

  const passiveIncome = getPassiveIncome(playerData.incomes)
  const totalExpenses = getTotalExpenseAmount(playerData)
  const freedomPercent = Math.min(100, Math.round((passiveIncome / Math.max(totalExpenses, 1)) * 100))

  return (
    <Container>
      {/* Main Game View */}
      <GameArea>
        {/* Header Stats Bar */}
        <StatsBar>
          <StatItem>
            <StatLabel>现金</StatLabel>
            <StatValue color="#22c55e">${currencyFormatter.format(playerData.cash)}</StatValue>
          </StatItem>
          <StatDivider />
          <StatItem>
            <StatLabel>月现金流</StatLabel>
            <StatValue color="#06b6d4">
              ${currencyFormatter.format(
                playerData.incomes.reduce((sum, i) => sum + i.amount, 0) - totalExpenses
              )}
            </StatValue>
          </StatItem>
          <StatDivider />
          <StatItem>
            <StatLabel>财务自由</StatLabel>
            <StatValue color="#fbbf24">{freedomPercent}%</StatValue>
          </StatItem>
        </StatsBar>

        {/* Game Board - Full Height */}
        <BoardArea>
          <Board />
        </BoardArea>

        {/* Bottom Action Bar */}
        <BottomBar>
          <ActionButton onClick={() => setShowStatement(true)}>
            <ActionIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </ActionIcon>
            <ActionLabel>报表</ActionLabel>
          </ActionButton>

          <ActionButton primary>
            <ActionIcon>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </ActionIcon>
            <ActionLabel>银行</ActionLabel>
          </ActionButton>
        </BottomBar>
      </GameArea>

      {/* Action Dialog Modal */}
      <Action />

      {/* Financial Statement Modal */}
      {showStatement && (
        <ModalOverlay onClick={() => setShowStatement(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>财务报表</ModalTitle>
              <CloseButton onClick={() => setShowStatement(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <FinancialStatement />
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default App

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100vh',
  maxWidth: '480px',
  margin: '0 auto',
  background: 'linear-gradient(180deg, #1a1f3c 0%, #0f172a 100%)',
  position: 'relative',
  overflow: 'hidden',
})

const GameArea = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
})

const StatsBar = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-around',
  padding: '12px 16px',
  background: 'rgba(0, 0, 0, 0.3)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
})

const StatItem = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2px',
})

const StatLabel = styled.span({
  color: 'rgba(255, 255, 255, 0.5)',
  fontSize: '11px',
  fontWeight: 500,
})

const StatValue = styled.span(({ color }) => ({
  color: color || '#fff',
  fontSize: '15px',
  fontWeight: 700,
}))

const StatDivider = styled.div({
  width: '1px',
  height: '28px',
  background: 'rgba(255, 255, 255, 0.1)',
})

const BoardArea = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

const BottomBar = styled.div({
  display: 'flex',
  gap: '12px',
  padding: '12px 16px',
  paddingBottom: 'calc(12px + env(safe-area-inset-bottom))',
  background: 'rgba(0, 0, 0, 0.4)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
})

const ActionButton = styled.button(({ primary }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '14px 20px',
  background: primary 
    ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
    : 'rgba(255, 255, 255, 0.08)',
  border: primary ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
  borderRadius: '12px',
  cursor: 'pointer',
  color: '#fff',
  transition: 'all 0.2s ease',
  '&:active': {
    transform: 'scale(0.97)',
  },
}))

const ActionIcon = styled.div({
  width: '20px',
  height: '20px',
  '& svg': {
    width: '100%',
    height: '100%',
  },
})

const ActionLabel = styled.span({
  fontSize: '15px',
  fontWeight: 600,
})

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
  background: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  zIndex: 1000,
  animation: `${fadeIn} 0.2s ease`,
})

const ModalContent = styled.div({
  width: '100%',
  maxWidth: '480px',
  maxHeight: '85vh',
  background: 'linear-gradient(180deg, #1e2744 0%, #151c32 100%)',
  borderRadius: '20px 20px 0 0',
  display: 'flex',
  flexDirection: 'column',
  animation: `${slideUp} 0.3s ease`,
})

const ModalHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
})

const ModalTitle = styled.h2({
  color: '#fff',
  fontSize: '18px',
  fontWeight: 600,
  margin: 0,
})

const CloseButton = styled.button({
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.1)',
  border: 'none',
  borderRadius: '50%',
  cursor: 'pointer',
  color: 'rgba(255, 255, 255, 0.7)',
  '& svg': {
    width: '18px',
    height: '18px',
  },
  '&:active': {
    background: 'rgba(255, 255, 255, 0.15)',
  },
})

const ModalBody = styled.div({
  flex: 1,
  overflow: 'auto',
  padding: '16px',
})
//#endregion styled components
