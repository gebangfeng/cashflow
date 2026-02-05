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
  const bankLoan = playerData.liabilities.find(l => l.type === 'bank')?.amount || 0

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
          <ButtonIconWrapper>
            <ReportIcon />
          </ButtonIconWrapper>
          报表
        </ActionButton>
        <ActionButton variant="bank" onClick={() => setActionType('borrow')}>
          <ButtonIconWrapper>
            <BankIcon />
          </ButtonIconWrapper>
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
            <StatValue>{currencyFormatter.format(bankLoan)}</StatValue>
          </StatItem>
        </StatRow>
        <StatDivider />
        <StatRow highlight>
          <StatItem>
            <StatIcon color="#00BCD4">≈</StatIcon>
            <StatLabel highlight>月现金流</StatLabel>
            <StatValue gold>{currencyFormatter.format(cashflow)}</StatValue>
          </StatItem>
          <StatItem>
            <StatIcon color="#42A5F5">◉</StatIcon>
            <StatLabel highlight>现金</StatLabel>
            <StatValue>{currencyFormatter.format(playerData.cash)}</StatValue>
          </StatItem>
        </StatRow>
      </BottomStats>
    </Container>
  )
}

export default FinancialStatement

// Icons
const SettingsIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
)

const ReportIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="21" x2="9" y2="9"/>
  </svg>
)

const BankIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 21h18"/>
    <path d="M3 10h18"/>
    <path d="M5 6l7-3 7 3"/>
    <path d="M4 10v11"/>
    <path d="M20 10v11"/>
    <path d="M8 14v3"/>
    <path d="M12 14v3"/>
    <path d="M16 14v3"/>
  </svg>
)

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '0.75rem',
  gap: '0.5rem',
  backgroundColor: '#1E2642',
})

const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

const SettingsButton = styled.button({
  width: '44px',
  height: '44px',
  borderRadius: '12px',
  backgroundColor: '#252D4A',
  border: `2px solid #3D4B6A`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: '#2D3654',
    borderColor: '#4D5B7A',
  },
})

const AgeBadge = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  backgroundColor: '#00BCD4',
  color: '#fff',
  padding: '0.625rem 1rem',
  borderRadius: '8px',
  fontWeight: 600,
  fontSize: '0.9rem',
})

const ProfileSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
})

const Avatar = styled.div({
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  overflow: 'hidden',
  border: '2px solid #7C3AED',
  backgroundColor: '#252D4A',
})

const AvatarImage = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

const PlayerInfo = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

const PlayerName = styled.span({
  color: '#4DD0E1',
  fontSize: '1.1rem',
  fontWeight: 600,
})

const ProfessionBadge = styled.span({
  backgroundColor: '#7C3AED',
  color: '#fff',
  padding: '0.3rem 0.75rem',
  borderRadius: '6px',
  fontSize: '0.8rem',
  fontWeight: 500,
  display: 'inline-block',
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
  color: '#9CA3AF',
  fontSize: '0.8rem',
})

const FreedomValue = styled.span({
  color: '#9CA3AF',
  fontSize: '0.8rem',
})

const ProgressBar = styled.div({
  height: '6px',
  backgroundColor: '#252D4A',
  borderRadius: '3px',
  overflow: 'hidden',
})

const ProgressFill = styled.div({
  height: '100%',
  backgroundColor: '#7C3AED',
  borderRadius: '3px',
  transition: 'width 0.3s ease',
})

const Section = styled.div(({ small }) => ({
  backgroundColor: '#252D4A',
  borderRadius: '10px',
  border: '1px solid #3D4B6A',
  overflow: 'hidden',
  ...(small && { minHeight: 'auto' }),
}))

const SectionHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 0.875rem',
  backgroundColor: '#3D4B6A',
  color: '#fff',
  fontSize: '0.85rem',
  fontWeight: 600,
})

const SectionContent = styled.div({
  padding: '0.5rem 0.875rem',
})

const ChildrenContent = styled.div({
  padding: '0.5rem 0.875rem',
  display: 'flex',
  gap: '0.375rem',
})

const ChildIcon = styled.span({
  fontSize: '1.25rem',
})

const EmptyText = styled.span({
  color: '#6B7280',
  fontSize: '0.8rem',
})

const SkillList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
})

const SkillItem = styled.div(({ inactive }) => ({
  color: inactive ? '#6B7280' : '#4DD0E1',
  fontSize: '0.8rem',
  padding: '0.15rem 0',
}))

const InvestmentList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.2rem',
})

const InvestmentItem = styled.div(({ hasValue }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  color: hasValue ? '#4DD0E1' : '#6B7280',
  fontSize: '0.85rem',
  padding: '0.15rem 0',
}))

const InvestmentDash = styled.span({
  color: '#FBBF24',
  fontSize: '0.75rem',
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
  gap: '0.625rem',
  padding: '0.875rem',
  borderRadius: '12px',
  border: 'none',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.2s',
  backgroundColor: '#F59E0B',
  color: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  '&:active': {
    transform: 'translateY(0)',
  },
}))

const ButtonIconWrapper = styled.span({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const BottomStats = styled.div({
  backgroundColor: '#161D33',
  borderRadius: '10px',
  padding: '0.625rem 0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

const StatRow = styled.div(({ highlight }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  gap: '0.75rem',
  ...(highlight && {
    paddingTop: '0.25rem',
  }),
}))

const StatItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  flex: 1,
})

const StatLabel = styled.span(({ highlight }) => ({
  color: highlight ? '#D1D5DB' : '#9CA3AF',
  fontSize: '0.75rem',
}))

const StatValue = styled.span(({ highlight, gold }) => ({
  color: gold ? '#FBBF24' : (highlight ? '#FBBF24' : '#fff'),
  fontSize: '0.8rem',
  fontWeight: 600,
  marginLeft: 'auto',
}))

const StatIcon = styled.span(({ color }) => ({
  color: color,
  fontSize: '0.85rem',
  fontWeight: 700,
}))

const StatDivider = styled.div({
  height: '1px',
  backgroundColor: '#3D4B6A',
  margin: '0.25rem 0',
})
//#endregion styled components
