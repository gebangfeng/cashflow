import styled from '@emotion/styled'
import './App.css'
import { Board, FinancialStatement, Action } from '@/components'

function App() {
  return (
    <Container>
      <LeftSidebar>
        <FinancialStatement />
      </LeftSidebar>
      <MainArea>
        <GameBoard>
          <Action />
          <Board />
        </GameBoard>
      </MainArea>
    </Container>
  )
}

export default App

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'row',
  width: '100vw',
  height: '100vh',
  backgroundColor: '#1B2240',
  overflow: 'hidden',
})

const LeftSidebar = styled.div({
  width: '260px',
  minWidth: '260px',
  height: '100%',
  backgroundColor: '#1E2642',
  borderRight: '1px solid #3D4B6A',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
  /* Custom scrollbar */
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-track': {
    background: '#1E2642',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#3D4B6A',
    borderRadius: '2px',
  },
})

const MainArea = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: 'linear-gradient(180deg, #1B2240 0%, #252E50 100%)',
  position: 'relative',
})

const GameBoard = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  padding: '1rem',
  overflow: 'hidden',
})
//#endregion styled components
