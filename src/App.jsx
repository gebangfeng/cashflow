import styled from '@emotion/styled'
import './App.css'
import { Board, FinancialStatement, Action, CharacterSelect } from '@/components'
import { breakpoints } from '@/styles/styles'
import { GameContext } from '@/utils'
import { useContext, useState } from 'react'

function App() {
  const { selectedProfession, initializePlayerFromProfession } = useContext(GameContext)
  const [showCharacterSelect, setShowCharacterSelect] = useState(!selectedProfession)

  const handleProfessionSelect = (profession) => {
    initializePlayerFromProfession(profession)
    setShowCharacterSelect(false)
  }

  if (showCharacterSelect) {
    return (
      <CharacterSelect
        onSelect={handleProfessionSelect}
        onBack={() => {}}
      />
    )
  }

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <Logo>CASHFLOW</Logo>
          <Subtitle>Escape the Rat Race</Subtitle>
        </HeaderLeft>
        <ProfessionBadge onClick={() => setShowCharacterSelect(true)}>
          <ProfessionIcon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </ProfessionIcon>
          <span>{selectedProfession?.nameCn || selectedProfession?.name}</span>
        </ProfessionBadge>
      </Header>
      <MainContent>
        <LeftSection>
          <FinancialStatement />
        </LeftSection>
        <RightSection>
          <RightTopSection>
            <Action />
          </RightTopSection>
          <RightBottomSection>
            <Board />
          </RightBottomSection>
        </RightSection>
      </MainContent>
    </Container>
  )
}

export default App

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  minHeight: '100vh',
  padding: '0.5rem',
  gap: '0.5rem',
  [`@media (min-width: ${breakpoints.md})`]: {
    padding: '1rem',
    gap: '1rem',
  },
})

const Header = styled.header({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0.75rem 1rem',
  background: 'linear-gradient(135deg, #171717 0%, #262626 100%)',
  borderRadius: '0.75rem',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  [`@media (min-width: ${breakpoints.md})`]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '1rem 2rem',
  },
})

const Logo = styled.h1({
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 800,
  color: '#ffffff',
  letterSpacing: '0.1em',
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: '1.75rem',
  },
})

const Subtitle = styled.span({
  fontSize: '0.75rem',
  color: '#10b981',
  fontWeight: 600,
  letterSpacing: '0.05em',
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: '0.875rem',
  },
})

const HeaderLeft = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [`@media (min-width: ${breakpoints.md})`]: {
    alignItems: 'flex-start',
  },
})

const ProfessionBadge = styled.button({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 0.75rem',
  marginTop: '0.5rem',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: '2rem',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  color: '#ffffff',
  fontSize: '0.75rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  [`@media (min-width: ${breakpoints.md})`]: {
    marginTop: 0,
    fontSize: '0.875rem',
  },
})

const ProfessionIcon = styled.span({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.5rem',
  height: '1.5rem',
  backgroundColor: '#10b981',
  borderRadius: '50%',
})

const MainContent = styled.main({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  gap: '1rem',
  [`@media (min-width: ${breakpoints.lg})`]: {
    flexDirection: 'row',
  },
})

const LeftSection = styled.div({
  width: '100%',
  order: 2,
  [`@media (min-width: ${breakpoints.lg})`]: {
    width: '45%',
    order: 1,
  },
})

const RightSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  order: 1,
  [`@media (min-width: ${breakpoints.lg})`]: {
    width: '55%',
    order: 2,
  },
})

const RightTopSection = styled.div({
  display: 'flex',
  justifyContent: 'center',
  minHeight: '200px',
  [`@media (min-width: ${breakpoints.md})`]: {
    minHeight: '280px',
  },
})

const RightBottomSection = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '1rem 0',
})
//#endregion styled components
