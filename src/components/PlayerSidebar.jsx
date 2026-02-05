import styled from '@emotion/styled'
import { useContext } from 'react'
import { GameContext, currencyFormatter, getPassiveIncome, getTotalExpenseAmount } from '@/utils'

const PlayerSidebar = ({ onOpenStatement, onOpenBank }) => {
  const { playerData } = useContext(GameContext)

  const passiveIncome = getPassiveIncome(playerData.incomes)
  const totalExpense = getTotalExpenseAmount(playerData)
  const progress = totalExpense > 0 ? Math.min((passiveIncome / totalExpense) * 100, 100) : 0

  // Group assets by type
  const stockAssets = playerData.assets.filter(a => a.type === 'stock' || a.type === 'fund')
  const estateAssets = playerData.assets.filter(a => a.type === 'estate')
  const businessAssets = playerData.assets.filter(a => a.type === 'business')

  // Skills list
  const skills = [
    '投资防骗技能',
    '房地产投资技能',
    '企业经营技能',
    '股票投资技能',
    'Reits投资技能',
    '开源技能培训',
  ]

  // Investment categories
  const investmentCategories = [
    { name: '基金', count: stockAssets.filter(a => a.type === 'fund').length },
    { name: '股票', count: stockAssets.filter(a => a.type === 'stock').length },
    { name: 'REITS', count: 0 },
    { name: '房地产', count: estateAssets.length },
    { name: '企业', count: businessAssets.length },
    { name: '股权', count: 0 },
    { name: '其他', count: 0 },
  ]

  return (
    <Container>
      {/* Top Icons */}
      <TopBar>
        <IconButton>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
          </svg>
        </IconButton>
        <AgeBadge>
          <span>22</span>岁
        </AgeBadge>
      </TopBar>

      {/* Player Info */}
      <PlayerInfo>
        <PlayerAvatar>
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=player" alt="avatar" />
        </PlayerAvatar>
        <PlayerName>凡之</PlayerName>
        <ProfessionBadge>{playerData.profession || '快递小哥'}</ProfessionBadge>
      </PlayerInfo>

      {/* Financial Freedom Progress */}
      <ProgressSection>
        <ProgressHeader>
          <ProgressLabel>财务自由度</ProgressLabel>
          <ProgressValue>{progress.toFixed(0)}%</ProgressValue>
        </ProgressHeader>
        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
      </ProgressSection>

      {/* Skills Section */}
      <Section>
        <SectionHeader>技能</SectionHeader>
        <SkillsList>
          {skills.map((skill, index) => (
            <SkillItem key={index}>{skill}</SkillItem>
          ))}
        </SkillsList>
      </Section>

      {/* Children Section */}
      <Section>
        <SectionHeader>孩子</SectionHeader>
        <ChildrenContent>
          {playerData.childNum > 0 ? (
            Array.from({ length: playerData.childNum }).map((_, i) => (
              <ChildIcon key={i}>👶</ChildIcon>
            ))
          ) : (
            <NoChildren>暂无</NoChildren>
          )}
        </ChildrenContent>
      </Section>

      {/* Investments Section */}
      <Section>
        <SectionHeader>投资</SectionHeader>
        <InvestmentList>
          {investmentCategories.map((cat, index) => (
            <InvestmentItem key={index}>
              <InvestmentLine />
              <InvestmentName>{cat.name}</InvestmentName>
              {cat.count > 0 && <InvestmentCount>{cat.count}</InvestmentCount>}
            </InvestmentItem>
          ))}
        </InvestmentList>
      </Section>

      {/* Bottom Actions */}
      <BottomActions>
        <ActionBtn variant="statement" onClick={onOpenStatement}>
          <ActionIcon>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </ActionIcon>
          报表
        </ActionBtn>
        <ActionBtn variant="bank" onClick={onOpenBank}>
          <ActionIcon>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v2h20V7L12 2zM4 11v8h3v-8H4zm5 0v8h3v-8H9zm5 0v8h3v-8h-3zm5 0v8h3v-8h-3zM2 21h20v2H2v-2z" />
            </svg>
          </ActionIcon>
          银行
        </ActionBtn>
      </BottomActions>
    </Container>
  )
}

export default PlayerSidebar

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '200px',
  height: '100%',
  background: 'linear-gradient(180deg, #1B2240 0%, #252E50 100%)',
  padding: '12px',
  gap: '12px',
  overflowY: 'auto',
  '&::-webkit-scrollbar': {
    width: '4px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '2px',
  },
})

const TopBar = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const IconButton = styled.button({
  width: '40px',
  height: '40px',
  background: 'rgba(99, 102, 241, 0.2)',
  border: '2px solid rgba(99, 102, 241, 0.5)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: '#818cf8',
  transition: 'all 0.2s ease',
  '& svg': {
    width: '20px',
    height: '20px',
  },
  '&:hover': {
    background: 'rgba(99, 102, 241, 0.3)',
  },
})

const AgeBadge = styled.div({
  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
  color: '#fff',
  padding: '6px 14px',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: 600,
  '& span': {
    fontSize: '16px',
    fontWeight: 700,
  },
})

const PlayerInfo = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
  paddingBottom: '12px',
})

const PlayerAvatar = styled.div({
  width: '56px',
  height: '56px',
  borderRadius: '12px',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  border: '2px solid rgba(139, 92, 246, 0.5)',
})

const AvatarImage = styled.img({
  width: '100%',
  height: '100%',
  objectFit: 'cover',
})

const PlayerName = styled.div({
  color: '#22c55e',
  fontSize: '18px',
  fontWeight: 700,
})

const ProfessionBadge = styled.div({
  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
  color: '#1f2937',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 600,
})

const ProgressSection = styled.div({
  background: 'rgba(139, 92, 246, 0.1)',
  border: '1px solid rgba(139, 92, 246, 0.3)',
  borderRadius: '10px',
  padding: '10px',
})

const ProgressHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '8px',
})

const ProgressLabel = styled.span({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '12px',
})

const ProgressValue = styled.span({
  color: '#a78bfa',
  fontSize: '14px',
  fontWeight: 700,
})

const ProgressBarContainer = styled.div({
  height: '6px',
  background: 'rgba(255, 255, 255, 0.1)',
  borderRadius: '3px',
  overflow: 'hidden',
})

const ProgressBar = styled.div(({ progress }) => ({
  height: '100%',
  width: `${progress}%`,
  background: 'linear-gradient(90deg, #8b5cf6 0%, #6366f1 100%)',
  borderRadius: '3px',
  transition: 'width 0.5s ease',
}))

const Section = styled.div({
  background: 'rgba(59, 130, 246, 0.1)',
  border: '1px solid rgba(59, 130, 246, 0.3)',
  borderRadius: '10px',
  padding: '10px',
})

const SectionHeader = styled.div({
  color: '#60a5fa',
  fontSize: '13px',
  fontWeight: 600,
  marginBottom: '8px',
  paddingBottom: '6px',
  borderBottom: '1px solid rgba(59, 130, 246, 0.2)',
})

const SkillsList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

const SkillItem = styled.div({
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '11px',
  paddingLeft: '8px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    width: '3px',
    height: '3px',
    background: '#60a5fa',
    borderRadius: '50%',
  },
})

const ChildrenContent = styled.div({
  display: 'flex',
  gap: '6px',
  flexWrap: 'wrap',
})

const ChildIcon = styled.span({
  fontSize: '20px',
})

const NoChildren = styled.span({
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '12px',
})

const InvestmentList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
})

const InvestmentItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
})

const InvestmentLine = styled.div({
  width: '20px',
  height: '2px',
  background: 'rgba(59, 130, 246, 0.5)',
})

const InvestmentName = styled.span({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '12px',
  flex: 1,
})

const InvestmentCount = styled.span({
  color: '#60a5fa',
  fontSize: '11px',
  fontWeight: 600,
  background: 'rgba(59, 130, 246, 0.2)',
  padding: '2px 6px',
  borderRadius: '4px',
})

const BottomActions = styled.div({
  marginTop: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
})

const ActionBtn = styled.button(({ variant }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px',
  borderRadius: '10px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 700,
  transition: 'all 0.2s ease',
  ...(variant === 'statement' ? {
    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    color: '#fff',
  } : {
    background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    color: '#1f2937',
  }),
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
}))

const ActionIcon = styled.span({
  width: '20px',
  height: '20px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& svg': {
    width: '100%',
    height: '100%',
  },
})
//#endregion styled components
