import styled from '@emotion/styled'
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
  const totalExpense = getTotalExpenseAmount(playerData)
  const totalIncome = getTotalIncomeAmount(playerData)
  const monthlyFlow = totalIncome - totalExpense
  const progress = Math.min((passiveIncome / totalExpense) * 100, 100)

  return (
    <Container>
      {/* Progress Section */}
      <ProgressCard>
        <ProgressHeader>
          <ProgressTitle>财务自由进度</ProgressTitle>
          <ProgressPercent>{progress.toFixed(0)}%</ProgressPercent>
        </ProgressHeader>
        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
        <ProgressLabels>
          <ProgressLabel>
            <LabelIcon positive>↑</LabelIcon>
            被动收入: ¥{currencyFormatter.format(passiveIncome)}
          </ProgressLabel>
          <ProgressLabel>
            <LabelIcon>↓</LabelIcon>
            总支出: ¥{currencyFormatter.format(totalExpense)}
          </ProgressLabel>
        </ProgressLabels>
      </ProgressCard>

      {/* Stats Grid */}
      <StatsGrid>
        <StatCard variant="cash">
          <StatLabel>现金</StatLabel>
          <StatValue>¥{currencyFormatter.format(playerData.cash)}</StatValue>
        </StatCard>
        <StatCard variant="income">
          <StatLabel>月收入</StatLabel>
          <StatValue>¥{currencyFormatter.format(totalIncome)}</StatValue>
        </StatCard>
        <StatCard variant="expense">
          <StatLabel>月支出</StatLabel>
          <StatValue>-¥{currencyFormatter.format(totalExpense)}</StatValue>
        </StatCard>
        <StatCard variant={monthlyFlow >= 0 ? 'positive' : 'negative'}>
          <StatLabel>月现金流</StatLabel>
          <StatValue>
            {monthlyFlow >= 0 ? '+' : ''}¥{currencyFormatter.format(monthlyFlow)}
          </StatValue>
        </StatCard>
      </StatsGrid>

      {/* Player Info */}
      <PlayerInfo>
        <PlayerAvatar>
          <AvatarEmoji>👤</AvatarEmoji>
        </PlayerAvatar>
        <PlayerDetails>
          <PlayerName>玩家</PlayerName>
          <PlayerProfession>{playerData.profession}</PlayerProfession>
        </PlayerDetails>
        <PlayerBadge>
          {playerData.childNum > 0 && (
            <ChildBadge>👶 {playerData.childNum}</ChildBadge>
          )}
        </PlayerBadge>
      </PlayerInfo>
    </Container>
  )
}

export default FinancialStatus

//#region styled Components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

const ProgressCard = styled.div({
  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '16px',
  padding: '16px',
})

const ProgressHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '12px',
})

const ProgressTitle = styled.span({
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
})

const ProgressPercent = styled.span({
  color: '#a78bfa',
  fontSize: '18px',
  fontWeight: 700,
})

const ProgressBarContainer = styled.div({
  height: '8px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '4px',
  overflow: 'hidden',
  marginBottom: '12px',
})

const ProgressBar = styled.div(({ progress }) => ({
  height: '100%',
  width: `${progress}%`,
  background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)',
  borderRadius: '4px',
  transition: 'width 0.5s ease',
}))

const ProgressLabels = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
})

const ProgressLabel = styled.span({
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '12px',
})

const LabelIcon = styled.span(({ positive }) => ({
  color: positive ? '#22c55e' : '#ef4444',
  fontWeight: 700,
}))

const StatsGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '8px',
})

const StatCard = styled.div(({ variant }) => {
  const colors = {
    cash: { bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)', text: '#fbbf24' },
    income: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
    expense: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
    positive: { bg: 'rgba(34, 197, 94, 0.15)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
    negative: { bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
  }
  const color = colors[variant] || colors.cash
  return {
    background: color.bg,
    border: `1px solid ${color.border}`,
    borderRadius: '12px',
    padding: '12px',
    '& span:last-child': { color: color.text },
  }
})

const StatLabel = styled.span({
  display: 'block',
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '12px',
  marginBottom: '4px',
})

const StatValue = styled.span({
  display: 'block',
  fontSize: '16px',
  fontWeight: 700,
})

const PlayerInfo = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  padding: '12px',
})

const PlayerAvatar = styled.div({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const AvatarEmoji = styled.span({
  fontSize: '20px',
})

const PlayerDetails = styled.div({
  flex: 1,
})

const PlayerName = styled.div({
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
})

const PlayerProfession = styled.div({
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '12px',
})

const PlayerBadge = styled.div({
  display: 'flex',
  gap: '8px',
})

const ChildBadge = styled.span({
  background: 'rgba(244, 114, 182, 0.2)',
  color: '#f472b6',
  padding: '4px 8px',
  borderRadius: '8px',
  fontSize: '12px',
})
//#endregion styled components
