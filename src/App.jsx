import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import './App.css'
import { Board, FinancialStatement, Action } from '@/components'
import { useState } from 'react'

function App() {
  const [activeTab, setActiveTab] = useState('game') // 'game' | 'statement'

  return (
    <Container>
      {/* Header */}
      <Header>
        <Logo>
          <LogoIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </LogoIcon>
          <LogoText>财务自由之路</LogoText>
        </Logo>
        <HeaderBadge>
          <span>22</span>岁
        </HeaderBadge>
      </Header>

      {/* Main Content */}
      <MainContent>
        {activeTab === 'game' ? (
          <GameSection>
            <BoardArea>
              <Board />
            </BoardArea>
          </GameSection>
        ) : (
          <StatementSection>
            <FinancialStatement />
          </StatementSection>
        )}
      </MainContent>

      {/* Action Modal */}
      <Action />

      {/* Bottom Navigation */}
      <BottomNav>
        <NavItem 
          active={activeTab === 'game'} 
          onClick={() => setActiveTab('game')}
        >
          <NavIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="20" rx="5" />
              <circle cx="8" cy="8" r="1.5" fill="currentColor" />
              <circle cx="16" cy="16" r="1.5" fill="currentColor" />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
          </NavIcon>
          <NavLabel>游戏</NavLabel>
        </NavItem>
        <NavItem 
          active={activeTab === 'statement'} 
          onClick={() => setActiveTab('statement')}
        >
          <NavIcon>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <line x1="10" y1="9" x2="8" y2="9" />
            </svg>
          </NavIcon>
          <NavLabel>报表</NavLabel>
        </NavItem>
      </BottomNav>
    </Container>
  )
}

export default App

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: '100vh',
  maxWidth: '480px',
  margin: '0 auto',
  background: 'linear-gradient(180deg, #1B2240 0%, #252E50 100%)',
  position: 'relative',
})

const Header = styled.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '12px 16px',
  background: 'rgba(27, 34, 64, 0.95)',
  backdropFilter: 'blur(10px)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 100,
})

const Logo = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

const LogoIcon = styled.div({
  width: '32px',
  height: '32px',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#fff',
  '& svg': {
    width: '20px',
    height: '20px',
  },
})

const LogoText = styled.span({
  color: '#fff',
  fontSize: '18px',
  fontWeight: 600,
})

const HeaderBadge = styled.div({
  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '16px',
  fontSize: '14px',
  fontWeight: 600,
  '& span': {
    fontSize: '16px',
  },
})

const MainContent = styled.main({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  paddingBottom: '70px',
})

const GameSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  overflow: 'hidden',
})

const BoardArea = styled.div({
  flex: 1,
  display: 'flex',
  overflow: 'hidden',
})

const StatementSection = styled.div({
  padding: '16px',
})

const BottomNav = styled.nav({
  position: 'fixed',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: '100%',
  maxWidth: '480px',
  display: 'flex',
  background: 'rgba(27, 34, 64, 0.98)',
  backdropFilter: 'blur(10px)',
  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
  padding: '8px 0',
  paddingBottom: 'env(safe-area-inset-bottom, 8px)',
})

const NavItem = styled.button(({ active }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  padding: '8px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: active ? '#6366f1' : 'rgba(255, 255, 255, 0.5)',
  transition: 'all 0.2s ease',
  '&:active': {
    transform: 'scale(0.95)',
  },
}))

const NavIcon = styled.div({
  width: '24px',
  height: '24px',
  '& svg': {
    width: '100%',
    height: '100%',
  },
})

const NavLabel = styled.span({
  fontSize: '12px',
  fontWeight: 500,
})
//#endregion styled components
