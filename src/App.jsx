import styled from '@emotion/styled'
import './App.css'
import { Board, FinancialStatement, Action } from '@/components'
import { colors } from '@/styles'

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
  backgroundColor: colors.midnight.darkest,
  overflow: 'hidden',
})

const LeftSidebar = styled.div({
  width: '280px',
  minWidth: '280px',
  height: '100%',
  backgroundColor: colors.blilet.darkest,
  borderRight: `1px solid ${colors.blilet.dark}`,
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
})

const MainArea = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: `linear-gradient(180deg, ${colors.midnight.darkest} 0%, ${colors.midnight.darker} 100%)`,
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
})
//#endregion styled components
