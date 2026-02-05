import styled from '@emotion/styled'
import { Box, LinearProgress } from '@mui/material'
import { colors, breakpoints } from '../styles'
import {
  currencyFormatter,
  getPassiveIncome,
  GameContext,
  getTotalExpenseAmount,
  getTotalIncomeAmount,
} from '@/utils'
import { useContext } from 'react'

const FinancialStatus = () => {
  const { playerData } = useContext(GameContext)
  const passiveIncome = getPassiveIncome(playerData.incomes)
  const totalExpenses = getTotalExpenseAmount(playerData)
  const progressValue = Math.min((passiveIncome / totalExpenses) * 100, 100)

  return (
    <StyledContainer>
      <TopSection>
        <TitleSection>
          <Title>Escape the Rat Race</Title>
          <TitleDescription>Increase passive income above total expenses</TitleDescription>
        </TitleSection>
        <CashDisplay>
          <CashLabel>Cash Balance</CashLabel>
          <CashAmount>${currencyFormatter.format(playerData.cash)}</CashAmount>
        </CashDisplay>
      </TopSection>
      
      <ProgressSection>
        <ProgressLabels>
          <ProgressLabel>
            <LabelText>Passive Income</LabelText>
            <LabelAmount positive>${currencyFormatter.format(passiveIncome)}</LabelAmount>
          </ProgressLabel>
          <ProgressLabel>
            <LabelText>Total Expenses</LabelText>
            <LabelAmount>${currencyFormatter.format(totalExpenses)}</LabelAmount>
          </ProgressLabel>
        </ProgressLabels>
        <Box sx={{ width: '100%' }}>
          <Progress variant="determinate" value={progressValue} />
        </Box>
        <ProgressPercentage>{Math.round(progressValue)}% to freedom</ProgressPercentage>
      </ProgressSection>

      <StatsGrid>
        <StatCard>
          <StatLabel>Total Income</StatLabel>
          <StatValue positive>
            ${currencyFormatter.format(getTotalIncomeAmount(playerData))}
          </StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Expenses</StatLabel>
          <StatValue negative>
            -${currencyFormatter.format(totalExpenses)}
          </StatValue>
        </StatCard>
        <StatCard highlight>
          <StatLabel>Payday</StatLabel>
          <StatValue large>
            ${currencyFormatter.format(
              getTotalIncomeAmount(playerData) - totalExpenses
            )}
          </StatValue>
        </StatCard>
      </StatsGrid>
    </StyledContainer>
  )
}

export default FinancialStatus

//#region styled Components
const StyledContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: colors.white,
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  [`@media (min-width: ${breakpoints.md})`]: {
    padding: '1.25rem',
  },
})

const TopSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  [`@media (min-width: ${breakpoints.sm})`]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
})

const TitleSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

const Title = styled.h2({
  margin: 0,
  fontSize: '1rem',
  fontWeight: 700,
  color: colors.neutral[900],
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: '1.125rem',
  },
})

const TitleDescription = styled.p({
  fontSize: '0.75rem',
  color: colors.neutral[500],
  margin: 0,
})

const CashDisplay = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0.5rem 0.75rem',
  backgroundColor: colors.neutral[50],
  borderRadius: '0.5rem',
  [`@media (min-width: ${breakpoints.sm})`]: {
    alignItems: 'flex-end',
  },
})

const CashLabel = styled.span({
  fontSize: '0.625rem',
  fontWeight: 600,
  color: colors.neutral[500],
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

const CashAmount = styled.span({
  fontSize: '1.25rem',
  fontWeight: 800,
  color: colors.neutral[900],
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: '1.5rem',
  },
})

const ProgressSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

const ProgressLabels = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const ProgressLabel = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
  '&:last-child': {
    alignItems: 'flex-end',
  },
})

const LabelText = styled.span({
  fontSize: '0.625rem',
  fontWeight: 600,
  color: colors.neutral[500],
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
})

const LabelAmount = styled.span(({ positive }) => ({
  fontSize: '0.875rem',
  fontWeight: 700,
  color: positive ? colors.primary[600] : colors.neutral[700],
}))

const Progress = styled(LinearProgress)({
  '&.MuiLinearProgress-root': {
    height: '0.625rem',
    borderRadius: '0.5rem',
    backgroundColor: colors.neutral[200],
  },
  '& .MuiLinearProgress-bar': {
    borderRadius: '0.5rem',
    background: `linear-gradient(90deg, ${colors.primary[400]} 0%, ${colors.primary[600]} 100%)`,
  },
})

const ProgressPercentage = styled.span({
  fontSize: '0.75rem',
  fontWeight: 600,
  color: colors.primary[600],
  textAlign: 'center',
})

const StatsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '0.5rem',
  [`@media (min-width: ${breakpoints.md})`]: {
    gap: '0.75rem',
  },
})

const StatCard = styled.div(({ highlight }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  padding: '0.5rem',
  backgroundColor: highlight ? colors.neutral[900] : colors.neutral[50],
  borderRadius: '0.5rem',
  textAlign: 'center',
  [`@media (min-width: ${breakpoints.md})`]: {
    padding: '0.75rem',
  },
}))

const StatLabel = styled.span({
  fontSize: '0.625rem',
  fontWeight: 600,
  color: 'inherit',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  opacity: 0.7,
})

const StatValue = styled.span(({ positive, negative, large }) => ({
  fontSize: large ? '1rem' : '0.875rem',
  fontWeight: 700,
  color: positive ? colors.primary[600] : negative ? colors.error.base : colors.white,
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: large ? '1.125rem' : '0.875rem',
  },
}))
// #endregion styled components
