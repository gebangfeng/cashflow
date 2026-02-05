import styled from '@emotion/styled'
import { Box, LinearProgress } from '@mui/material'
import { colors } from '../styles'
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

  return (
    <StyledContainer>
      <Title>提高被动收入，逃离老鼠赛跑</Title>
      <ProgressContainer>
        <ProgressTopTitle>
          总支出: ${currencyFormatter.format(getTotalExpenseAmount(playerData))}
        </ProgressTopTitle>
        <Box sx={{ width: '100%' }}>
          <Progress
            variant="determinate"
            value={
              (getPassiveIncome(playerData.incomes) /
                getTotalExpenseAmount(playerData)) *
                100 >
              100
                ? 100
                : (getPassiveIncome(playerData.incomes) /
                    getTotalExpenseAmount(playerData)) *
                  100
            }
          />
          <ProgressBottomTitle>
            被动收入: ${currencyFormatter.format(getPassiveIncome(playerData.incomes))}
          </ProgressBottomTitle>
        </Box>
      </ProgressContainer>
      <DashboardContainer>
        <DashboardTopRow>
          <span>现金</span>
          <span>${currencyFormatter.format(playerData.cash)}</span>
        </DashboardTopRow>
        <DashboardRow>
          <span>总收入:</span>
          <span>
            ${currencyFormatter.format(getTotalIncomeAmount(playerData))}
          </span>
        </DashboardRow>
        <DashboardRow>
          <span>总支出:</span>
          <span>
            $-{currencyFormatter.format(getTotalExpenseAmount(playerData))}
          </span>
        </DashboardRow>
        <StyledDivider />
        <DashboardRow highlight>
          <span>月现金流</span>
          <span>
            $
            {currencyFormatter.format(
              getTotalIncomeAmount(playerData) -
                getTotalExpenseAmount(playerData)
            )}
          </span>
        </DashboardRow>
      </DashboardContainer>
    </StyledContainer>
  )
}

export default FinancialStatus

//#region styled Components
const StyledContainer = styled.div({
  marginTop: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0 0.5rem',
})

const Title = styled.h1({
  color: colors.red.base,
  fontSize: '0.875rem',
  textAlign: 'center',
  width: '100%',
  marginBottom: '.5rem',
  fontWeight: 600,
})

const ProgressContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  width: '100%',
  marginBottom: '.5rem',
})

const Progress = styled(LinearProgress)({
  border: `2px solid ${colors.purple.dark}`,
  borderRadius: '4px',
  '&.MuiLinearProgress-root': {
    height: '0.875rem',
    backgroundColor: colors.blilet.darker,
  },
  '& .MuiLinearProgress-bar': {
    backgroundColor: colors.purple.base,
  },
})

const ProgressTopTitle = styled.p({
  fontSize: '.75rem',
  fontWeight: 600,
  color: colors.grey.light,
  marginBottom: '0.25rem',
})
const ProgressBottomTitle = styled.p({
  fontSize: '.75rem',
  fontWeight: 600,
  color: colors.grey.light,
  marginTop: '0.25rem',
})

const DashboardContainer = styled.div({
  display: 'flex',
  alignSelf: 'center',
  flexDirection: 'column',
  width: '100%',
  backgroundColor: colors.blilet.darker,
  borderRadius: '8px',
  padding: '0.5rem 0.75rem',
})

const DashboardRow = styled.div(({ highlight }) => ({
  display: 'flex',
  fontSize: '.8rem',
  flexDirection: 'row',
  margin: '.25rem 0',
  justifyContent: 'space-between',
  color: highlight ? colors.teal.light : colors.grey.lighter,
  fontWeight: highlight ? 600 : 400,
}))

const DashboardTopRow = styled.div({
  display: 'flex',
  flexDirection: 'row',
  fontSize: '1rem',
  fontWeight: '700',
  margin: '.25rem 0',
  justifyContent: 'space-between',
  color: colors.yellow.base,
})

const StyledDivider = styled.div({
  backgroundColor: colors.blilet.dark,
  height: '1px',
  margin: '0.25rem 0',
})
// #endregion styled components
