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

const FinancialStatement = () => {
  const { playerData } = useContext(GameContext)

  return (
    <Container>
      <FinancialStatus />
      
      <SectionGrid>
        <Section>
          <SectionHeader>
            <SectionIcon>💰</SectionIcon>
            <SectionTitle>收入</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <Income incomes={playerData.incomes} />
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionIcon>💸</SectionIcon>
            <SectionTitle>支出</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <Expenses
              expenses={playerData.expenses}
              childNum={playerData.childNum}
              expensePerChild={playerData.expensePerChild}
            />
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionIcon>📈</SectionIcon>
            <SectionTitle>资产</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <Assets assets={playerData.assets} />
          </SectionContent>
        </Section>

        <Section>
          <SectionHeader>
            <SectionIcon>📉</SectionIcon>
            <SectionTitle>负债</SectionTitle>
          </SectionHeader>
          <SectionContent>
            <Liabilities liabilities={playerData.liabilities} />
          </SectionContent>
        </Section>
      </SectionGrid>
    </Container>
  )
}

export default FinancialStatement

//#region styled Components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
})

const SectionGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
})

const Section = styled.div({
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  overflow: 'hidden',
})

const SectionHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 12px',
  background: 'rgba(255, 255, 255, 0.05)',
  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
})

const SectionIcon = styled.span({
  fontSize: '16px',
})

const SectionTitle = styled.h3({
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  margin: 0,
})

const SectionContent = styled.div({
  padding: '8px',
  maxHeight: '150px',
  overflowY: 'auto',
})
//#endregion styled components
