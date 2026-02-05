import { useContext } from 'react'
import styled from '@emotion/styled'
import {
  FinancialStatus,
  Income,
  Expenses,
  Assets,
  Liabilities,
} from '@/components'
import { GameContext } from '@/utils'
import { breakpoints } from '@/styles/styles'

const FinancialStatement = () => {
  const { playerData } = useContext(GameContext)

  return (
    <StyledContainer>
      <StatusSection>
        <FinancialStatus />
      </StatusSection>
      <CardsGrid>
        <CardWrapper>
          <Income incomes={playerData.incomes} />
        </CardWrapper>
        <CardWrapper>
          <Expenses
            expenses={playerData.expenses}
            childNum={playerData.childNum}
            expensePerChild={playerData.expensePerChild}
          />
        </CardWrapper>
        <CardWrapper>
          <Assets assets={playerData.assets}/>
        </CardWrapper>
        <CardWrapper>
          <Liabilities liabilities={playerData.liabilities} />
        </CardWrapper>
      </CardsGrid>
    </StyledContainer>
  )
}

export default FinancialStatement

//#region styled Components
const StyledContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  width: '100%',
  height: '100%',
  [`@media (min-width: ${breakpoints.md})`]: {
    gap: '1rem',
  },
})

const StatusSection = styled.div({
  width: '100%',
})

const CardsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr',
  gap: '0.75rem',
  flex: 1,
  minHeight: 0,
  [`@media (min-width: ${breakpoints.sm})`]: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  [`@media (min-width: ${breakpoints.md})`]: {
    gap: '1rem',
  },
})

const CardWrapper = styled.div({
  minHeight: '180px',
  [`@media (min-width: ${breakpoints.lg})`]: {
    minHeight: '200px',
  },
})
// #endregion styled components
