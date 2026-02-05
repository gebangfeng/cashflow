import { useContext } from 'react'
import styled from '@emotion/styled'
import { colors } from '../styles'
import { GameContext, currencyFormatter, getPassiveIncome, getTotalExpenseAmount, getTotalIncomeAmount } from '@/utils'

const FinancialStatement = () => {
  const { playerData, setActionType } = useContext(GameContext)
  
  const passiveIncome = getPassiveIncome(playerData.incomes)
  const totalExpense = getTotalExpenseAmount(playerData)
  const totalIncome = getTotalIncomeAmount(playerData)
  const freedomProgress = totalExpense > 0 ? Math.min((passiveIncome / totalExpense) * 100, 100) : 0
  const cashflow = totalIncome - totalExpense

  return (
    <Container>
      {/* Header with settings and age */}
      <Header>
        <SettingsButton>
          <SettingsIcon />
        </SettingsButton>
        <AgeBadge>
          <CalendarIcon />
          <span>22岁</span>
        </AgeBadge>
      </Header>

      {/* Player Profile */}
      <ProfileSection>
        <Avatar>
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=player" alt="avatar" />
        </Avatar>
        <PlayerInfo>
          <PlayerName>凡之</PlayerName>
          <ProfessionBadge>{playerData.profession || '快递小哥'}</ProfessionBadge>
        </PlayerInfo>
      </ProfileSection>

      {/* Financial Freedom Progress */}
      <FreedomSection>
        <FreedomHeader>
          <FreedomLabel>财务自由度</FreedomLabel>
          <FreedomValue>{freedomProgress.toFixed(0)}%</FreedomValue>
        </FreedomHeader>
        <ProgressBar>
          <ProgressFill style={{ width: `${freedomProgress}%` }} />
        </ProgressBar>
      </FreedomSection>

      {/* Skills Section */}
      <Section>
        <SectionHeader>技能</SectionHeader>
        <SectionContent>
          <SkillList>
            <SkillItem inactive>投资防骗技能</SkillItem>
            <SkillItem inactive>房地产投资技能</SkillItem>
            <SkillItem inactive>企业经营技能</SkillItem>
            <SkillItem inactive>股票投资技能</SkillItem>
            <SkillItem inactive>Reits投资技能</SkillItem>
            <SkillItem inactive>开源技能培训</SkillItem>
          </SkillList>
        </SectionContent>
      </Section>

      {/* Children Section */}
      <Section small>
        <SectionHeader>
          孩子
        </SectionHeader>
        <ChildrenContent>
          {playerData.childNum > 0 ? (
            Array(playerData.childNum).fill(0).map((_, i) => (
              <ChildIcon key={i}>👶</ChildIcon>
            ))
          ) : (
            <EmptyText>暂无</EmptyText>
          )}
        </ChildrenContent>
      </Section>

      {/* Investment Section */}
      <Section>
        <SectionHeader>投资</SectionHeader>
        <SectionContent>
          <InvestmentList>
            <InvestmentItem hasValue={playerData.assets.some(a => a.type === 'fund')}>
              <InvestmentDash>——</InvestmentDash>
              <span>基金</span>
            </InvestmentItem>
            <InvestmentItem hasValue={playerData.assets.some(a => a.type === 'stock')}>
              <InvestmentDash>——</InvestmentDash>
              <span>股票</span>
            </InvestmentItem>
            <InvestmentItem hasValue={playerData.assets.some(a => a.type === 'reits')}>
              <InvestmentDash>——</InvestmentDash>
              <span>REITS</span>
            </InvestmentItem>
            <InvestmentItem hasValue={playerData.assets.some(a => a.type === 'estate')}>
              <InvestmentDash>——</InvestmentDash>
              <span>房地产</span>
            </InvestmentItem>
            <InvestmentItem hasValue={playerData.assets.some(a => a.type === 'business')}>
              <InvestmentDash>——</InvestmentDash>
              <span>企业</span>
            </InvestmentItem>
            <InvestmentItem hasValue={playerData.assets.some(a => a.type === 'equity')}>
              <InvestmentDash>——</InvestmentDash>
              <span>股权</span>
            </InvestmentItem>
            <InvestmentItem hasValue={playerData.assets.some(a => a.type === 'other')}>
              <InvestmentDash>——</InvestmentDash>
              <span>其他</span>
            </InvestmentItem>
          </InvestmentList>
        </SectionContent>
      </Section>

      {/* Bottom Buttons */}
      <BottomButtons>
        <ActionButton variant="report">
          <ButtonIcon>📊</ButtonIcon>
          报表
        </ActionButton>
        <ActionButton variant="bank" onClick={() => setActionType('borrow')}>
          <ButtonIcon>🏦</ButtonIcon>
          银行
        </ActionButton>
      </BottomButtons>

      {/* Bottom Stats Summary */}
      <BottomStats>
        <StatRow>
          <StatItem>
            <StatLabel>月被动收入</StatLabel>
            <StatValue>{currencyFormatter.format(passiveIncome)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>月主动收入</StatLabel>
            <StatValue highlight>{currencyFormatter.format(playerData.salary || 0)}</StatValue>
          </StatItem>
        </StatRow>
        <StatRow>
          <StatItem>
            <StatLabel>月总支出</StatLabel>
            <StatValue>{currencyFormatter.format(totalExpense)}</StatValue>
          </StatItem>
          <StatItem>
            <StatLabel>银行贷款</StatLabel>
            <StatValue>{currencyFormatter.format(playerData.liabilities.find(l => l.type === 'bank')?.amount || 0)}</StatValue>
          </StatItem>
        </StatRow>
        <StatDivider />
        <StatRow>
          <StatItem>
            <StatIcon color={colors.teal.base}>≈</StatIcon>
            <StatLabel>月现金流</StatLabel>
            <StatValue highlight>{currencyFormatter.format(cashflow)}</StatValue>
          </StatItem>
          <StatItem>
            <StatIcon color={colors.blue.light}>◉</StatIcon>
            <StatLabel>现金</StatLabel>
            <StatValue>{currencyFormatter.format(playerData.cash)}</StatValue>
          </StatItem>
        </StatRow>
      </BottomStats>
    </Container>
  )
}

export default FinancialStatement

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '0.75rem',
  gap: '0.625rem',
})

const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

const SettingsButton = styled.button({
  width: '44px',
  height: '44px',
  borderRadius: '10px',
  backgroundColor: colors.blilet.darker,
  border: `2px solid ${colors.blilet.dark}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: colors.blilet.dark,
  },
})

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={colors.grey.light} strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
)

const AgeBadge = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: colors.teal.base,
  color: colors.white,
  padding: '0.5rem 0.875rem',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.85rem',
})

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const ProfileSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

const Avatar = styled.div({
  width: '52px',
  height: '52px',
  borderRadius: '10px',
  overflow: 'hidden',
  border: `2px solid ${colors.purple.base}`,
  backgroundColor: colors.blilet.darker,
})

const AvatarImage = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

const PlayerInfo = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

const PlayerName = styled.span({
  color: colors.teal.light,
  fontSize: '1rem',
  fontWeight: 600,
})

const ProfessionBadge = styled.span({
  backgroundColor: colors.purple.dark,
  color: colors.white,
  padding: '0.25rem 0.625rem',
  borderRadius: '6px',
  fontSize: '0.75rem',
  fontWeight: 500,
})

const FreedomSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

const FreedomHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const FreedomLabel = styled.span({
  color: colors.grey.light,
  fontSize: '0.8rem',
})

const FreedomValue = styled.span({
  color: colors.grey.light,
  fontSize: '0.8rem',
})

const ProgressBar = styled.div({
  height: '5px',
  backgroundColor: colors.blilet.darker,
  borderRadius: '3px',
  overflow: 'hidden',
})

const ProgressFill = styled.div({
  height: '100%',
  backgroundColor: colors.purple.base,
  borderRadius: '3px',
  transition: 'width 0.3s ease',
})

const Section = styled.div(({ small }) => ({
  backgroundColor: colors.blilet.darker,
  borderRadius: '10px',
  border: `1px solid ${colors.blilet.dark}`,
  overflow: 'hidden',
  ...(small && { minHeight: 'auto' }),
}))

const SectionHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 0.75rem',
  backgroundColor: colors.blilet.dark,
  color: colors.white,
  fontSize: '0.85rem',
  fontWeight: 600,
})

const SectionContent = styled.div({
  padding: '0.375rem 0.75rem',
})

const ChildrenContent = styled.div({
  padding: '0.375rem 0.75rem',
  display: 'flex',
  gap: '0.25rem',
})

const ChildIcon = styled.span({
  fontSize: '1.25rem',
})

const EmptyText = styled.span({
  color: colors.grey.dark,
  fontSize: '0.8rem',
})

const SkillList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
})

const SkillItem = styled.div(({ inactive }) => ({
  color: inactive ? colors.grey.dark : colors.teal.light,
  fontSize: '0.75rem',
  padding: '0.125rem 0',
}))

const InvestmentList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.125rem',
})

const InvestmentItem = styled.div(({ hasValue }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.375rem',
  color: hasValue ? colors.teal.light : colors.grey.dark,
  fontSize: '0.8rem',
  padding: '0.125rem 0',
}))

const InvestmentDash = styled.span({
  color: colors.yellow.base,
  fontSize: '0.7rem',
})

const BottomButtons = styled.div({
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
})

const ActionButton = styled.button(({ variant }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem',
  borderRadius: '10px',
  border: 'none',
  fontSize: '0.9rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s',
  backgroundColor: colors.orange.base,
  color: colors.white,
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}))

const ButtonIcon = styled.span({
  fontSize: '1.125rem',
})

const BottomStats = styled.div({
  backgroundColor: colors.midnight.darker,
  borderRadius: '8px',
  padding: '0.5rem 0.625rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

const StatRow = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.5rem',
})

const StatItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  flex: 1,
})

const StatLabel = styled.span({
  color: colors.grey.base,
  fontSize: '0.7rem',
})

const StatValue = styled.span(({ highlight }) => ({
  color: highlight ? colors.yellow.base : colors.white,
  fontSize: '0.75rem',
  fontWeight: 600,
  marginLeft: 'auto',
}))

const StatIcon = styled.span(({ color }) => ({
  color: color,
  fontSize: '0.8rem',
}))

const StatDivider = styled.div({
  height: '1px',
  backgroundColor: colors.blilet.dark,
  margin: '0.25rem 0',
})
//#endregion styled components
