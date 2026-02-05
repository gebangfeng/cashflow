import styled from '@emotion/styled'
import { useContext, useState } from 'react'
import { colors, breakpoints } from '@/styles'
import { GameContext, currencyFormatter, rollDice, playSFX, BOARD_SLOTS, drawCard, getPassiveIncome, getTotalExpenseAmount, getTotalIncomeAmount } from '@/utils'

const INVESTMENT_CATEGORIES = [
  { id: 'funds', name: '基金' },
  { id: 'stocks', name: '股票' },
  { id: 'reits', name: 'REITS' },
  { id: 'realestate', name: '房地产' },
  { id: 'business', name: '企业' },
  { id: 'equity', name: '股权' },
  { id: 'other', name: '其他' },
]

const SKILLS = [
  '投资防骗技能',
  '房地产投资技能',
  '企业经营技能',
  '股票投资技能',
  'Reits投资技能',
  '开源技能培训',
]

const GameMainPage = ({ onOpenReport, onOpenBank, onChangeCharacter }) => {
  const {
    playerData,
    setPlayerData,
    currentSlot,
    setCurrentSlot,
    setPrevSlot,
    setActionType,
    setCard,
    selectedProfession,
  } = useContext(GameContext)

  const [diceValues, setDiceValues] = useState([0, 0, 0])
  const [isRolling, setIsRolling] = useState(false)

  // Calculate financial stats
  const passiveIncome = getPassiveIncome(playerData.incomes)
  const activeIncome = getTotalIncomeAmount(playerData) - passiveIncome
  const totalExpenses = getTotalExpenseAmount(playerData)
  const monthlyCashFlow = getTotalIncomeAmount(playerData) - totalExpenses
  const bankLoans = playerData.liabilities?.reduce((sum, l) => l.type === 'bank' ? sum + l.amount : sum, 0) || 0
  const financialFreedom = totalExpenses > 0 ? Math.min(Math.round((passiveIncome / totalExpenses) * 100), 100) : 0

  const handleRoll = () => {
    if (isRolling) return
    
    setIsRolling(true)
    playSFX('/assets/sounds/roll.mp3')

    // Animate dice
    let rollCount = 0
    const rollInterval = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ])
      rollCount++
      if (rollCount >= 10) {
        clearInterval(rollInterval)
        
        // Final roll
        const move = rollDice(playerData.diceNum)
        const finalDice = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
        ]
        setDiceValues(finalDice)

        const slotId = (currentSlot + move) % 23
        const card = drawCard(BOARD_SLOTS[slotId].type)

        if (playerData.charityTurnLeft === 1) {
          setPlayerData((prev) => ({ ...prev, diceNum: 1 }))
        }
        if (playerData.charityTurnLeft > 0) {
          setPlayerData((prev) => ({
            ...prev,
            charityTurnLeft: playerData.charityTurnLeft - 1,
          }))
        }

        setPrevSlot(currentSlot)
        setCurrentSlot((slot) => (slot + move) % 23)
        setActionType(BOARD_SLOTS[slotId].type)
        setCard(card)
        setIsRolling(false)
      }
    }, 100)
  }

  // Get investments grouped by category
  const getInvestmentsByCategory = (categoryId) => {
    return playerData.assets?.filter(a => a.category === categoryId) || []
  }

  return (
    <Container>
      {/* Left Sidebar */}
      <Sidebar>
        {/* Player Info */}
        <PlayerSection>
          <TopRow>
            <SettingsButton onClick={onChangeCharacter}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </SettingsButton>
            <AgeBadge>22岁</AgeBadge>
          </TopRow>
          <PlayerAvatar>
            <AvatarImage style={{ backgroundColor: selectedProfession?.avatarColor || '#8b5cf6' }}>
              👤
            </AvatarImage>
          </PlayerAvatar>
          <PlayerName>{playerData.playerName || '玩家'}</PlayerName>
          <ProfessionTag>{selectedProfession?.nameCn || '快递小哥'}</ProfessionTag>
        </PlayerSection>

        {/* Financial Freedom Progress */}
        <ProgressSection>
          <ProgressLabel>
            <span>财务自由度</span>
            <span>{financialFreedom}%</span>
          </ProgressLabel>
          <ProgressBar>
            <ProgressFill style={{ width: `${financialFreedom}%` }} />
          </ProgressBar>
        </ProgressSection>

        {/* Skills Section */}
        <InfoCard>
          <CardTitle>技能</CardTitle>
          <SkillsList>
            {SKILLS.map((skill, index) => (
              <SkillItem key={index}>{skill}</SkillItem>
            ))}
          </SkillsList>
        </InfoCard>

        {/* Children Section */}
        <InfoCard>
          <CardTitle>孩子</CardTitle>
          <ChildrenCount>{playerData.childNum || 0}</ChildrenCount>
        </InfoCard>

        {/* Investments Section */}
        <InfoCard>
          <CardTitle>投资</CardTitle>
          <InvestmentList>
            {INVESTMENT_CATEGORIES.map((cat) => (
              <InvestmentRow key={cat.id}>
                <InvestmentLine />
                <InvestmentName>{cat.name}</InvestmentName>
                <InvestmentLine />
              </InvestmentRow>
            ))}
          </InvestmentList>
        </InfoCard>
      </Sidebar>

      {/* Main Game Track */}
      <GameArea>
        <TrackContainer>
          {/* Vertical Text */}
          <VerticalText>
            <span>财</span>
            <span>务</span>
            <span>自</span>
            <span>由</span>
            <span>路</span>
          </VerticalText>

          {/* Track Path */}
          <TrackPath>
            {/* Road line */}
            <RoadLine />
            
            {/* Track slots */}
            <TrackSlot position="top">
              <SlotCard type="opportunity">
                <SlotIcon>?</SlotIcon>
                <SlotText>机会</SlotText>
              </SlotCard>
            </TrackSlot>

            <TrackSlot position="middle-top">
              <SlotCard type="doodad">
                <SlotIcon>♪</SlotIcon>
                <SlotText>生活小插曲</SlotText>
              </SlotCard>
            </TrackSlot>

            <TrackSlot position="middle">
              <SlotCard type="opportunity">
                <SlotIcon>?</SlotIcon>
                <SlotText>机会</SlotText>
              </SlotCard>
            </TrackSlot>

            {/* Player Token */}
            <PlayerToken style={{ top: `${30 + (currentSlot % 5) * 15}%` }}>
              <TokenAvatar style={{ backgroundColor: selectedProfession?.avatarColor || '#8b5cf6' }}>
                👤
              </TokenAvatar>
            </PlayerToken>

            {/* Money Sign */}
            <MoneySign>
              <span>钱</span>
            </MoneySign>
          </TrackPath>

          {/* Dice Display */}
          <DiceContainer>
            {diceValues.map((value, index) => (
              <DiceBox key={index}>{value}</DiceBox>
            ))}
          </DiceContainer>

          {/* Roll Button */}
          <RollButton onClick={handleRoll} disabled={isRolling}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </RollButton>
        </TrackContainer>

        {/* Music Button */}
        <MusicButton>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </MusicButton>
      </GameArea>

      {/* Bottom Bar */}
      <BottomBar>
        <ActionButtons>
          <ReportButton onClick={onOpenReport}>
            <ButtonIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </ButtonIcon>
            <span>报表</span>
          </ReportButton>
          <BankButton onClick={onOpenBank}>
            <ButtonIcon>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7v2h20V7L12 2zM4 11v7h3v-7H4zm5 0v7h3v-7H9zm5 0v7h3v-7h-3zm5 0v7h3v-7h-3zM2 20v2h20v-2H2z" />
              </svg>
            </ButtonIcon>
            <span>银行</span>
          </BankButton>
        </ActionButtons>

        <StatsGrid>
          <StatRow>
            <StatItem>
              <StatLabel>月被动收入</StatLabel>
              <StatValue>{currencyFormatter.format(passiveIncome)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>月主动收入</StatLabel>
              <StatValue highlight>{currencyFormatter.format(activeIncome)}</StatValue>
            </StatItem>
          </StatRow>
          <StatRow>
            <StatItem>
              <StatLabel>月总支出</StatLabel>
              <StatValue>{currencyFormatter.format(totalExpenses)}</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>银行贷款</StatLabel>
              <StatValue>{currencyFormatter.format(bankLoans)}</StatValue>
            </StatItem>
          </StatRow>
          <StatRow highlight>
            <StatItem>
              <StatLabel>≈ 月现金流</StatLabel>
              <StatValue accent>{currencyFormatter.format(monthlyCashFlow)}</StatValue>
            </StatItem>
            <StatItem>
              <CashIcon>●</CashIcon>
              <StatLabel>现金</StatLabel>
              <StatValue large>{currencyFormatter.format(playerData.cash)}</StatValue>
            </StatItem>
          </StatRow>
        </StatsGrid>
      </BottomBar>
    </Container>
  )
}

export default GameMainPage

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100vw',
  minHeight: '100vh',
  backgroundColor: '#2d3561',
  [`@media (min-width: ${breakpoints.md})`]: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})

const Sidebar = styled.aside({
  display: 'none',
  [`@media (min-width: ${breakpoints.md})`]: {
    display: 'flex',
    flexDirection: 'column',
    width: '280px',
    padding: '1rem',
    gap: '0.75rem',
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 120px)',
  },
})

const PlayerSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
})

const TopRow = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const SettingsButton = styled.button({
  padding: '0.5rem',
  border: '2px solid #4a5568',
  borderRadius: '0.5rem',
  backgroundColor: 'transparent',
  color: '#a0aec0',
  cursor: 'pointer',
  '&:hover': {
    borderColor: '#718096',
  },
})

const AgeBadge = styled.span({
  padding: '0.25rem 0.75rem',
  backgroundColor: '#3182ce',
  color: 'white',
  borderRadius: '0.25rem',
  fontSize: '0.75rem',
  fontWeight: 600,
})

const PlayerAvatar = styled.div({
  width: '4rem',
  height: '4rem',
})

const AvatarImage = styled.div({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  border: '3px solid #4a5568',
})

const PlayerName = styled.span({
  color: '#48bb78',
  fontSize: '1rem',
  fontWeight: 600,
})

const ProfessionTag = styled.span({
  padding: '0.25rem 0.75rem',
  backgroundColor: '#805ad5',
  color: 'white',
  borderRadius: '1rem',
  fontSize: '0.75rem',
  fontWeight: 600,
})

const ProgressSection = styled.div({
  width: '100%',
})

const ProgressLabel = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  color: '#a0aec0',
  fontSize: '0.75rem',
  marginBottom: '0.25rem',
})

const ProgressBar = styled.div({
  width: '100%',
  height: '0.5rem',
  backgroundColor: '#4a5568',
  borderRadius: '0.25rem',
  overflow: 'hidden',
})

const ProgressFill = styled.div({
  height: '100%',
  backgroundColor: '#48bb78',
  borderRadius: '0.25rem',
  transition: 'width 0.3s ease',
})

const InfoCard = styled.div({
  backgroundColor: 'rgba(45, 55, 72, 0.8)',
  border: '2px solid #4a5568',
  borderRadius: '0.5rem',
  padding: '0.75rem',
})

const CardTitle = styled.h3({
  color: '#63b3ed',
  fontSize: '0.875rem',
  fontWeight: 600,
  margin: '0 0 0.5rem 0',
})

const SkillsList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

const SkillItem = styled.span({
  color: '#a0aec0',
  fontSize: '0.75rem',
})

const ChildrenCount = styled.span({
  color: '#a0aec0',
  fontSize: '0.875rem',
})

const InvestmentList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

const InvestmentRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

const InvestmentLine = styled.div({
  flex: 1,
  height: '1px',
  backgroundColor: '#4a5568',
})

const InvestmentName = styled.span({
  color: '#a0aec0',
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
})

const GameArea = styled.main({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '1rem',
  position: 'relative',
  minHeight: 'calc(100vh - 180px)',
})

const TrackContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  width: '100%',
  position: 'relative',
})

const VerticalText = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
  color: 'rgba(255, 255, 255, 0.3)',
  fontSize: '2rem',
  fontWeight: 700,
  position: 'absolute',
  left: '15%',
  top: '50%',
  transform: 'translateY(-50%)',
})

const TrackPath = styled.div({
  position: 'relative',
  width: '200px',
  height: '400px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const RoadLine = styled.div({
  position: 'absolute',
  left: '50%',
  top: 0,
  bottom: 0,
  width: '4px',
  backgroundColor: '#d69e2e',
  transform: 'translateX(-50%)',
  '&::before, &::after': {
    content: '""',
    position: 'absolute',
    left: '-8px',
    width: '20px',
    height: '4px',
    backgroundColor: '#d69e2e',
  },
})

const TrackSlot = styled.div(({ position }) => ({
  position: 'absolute',
  right: '-60px',
  ...(position === 'top' && { top: '5%' }),
  ...(position === 'middle-top' && { top: '30%' }),
  ...(position === 'middle' && { top: '55%' }),
}))

const SlotCard = styled.div(({ type }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.5rem 1rem',
  borderRadius: '0.5rem',
  border: '2px solid',
  borderColor: type === 'opportunity' ? '#38b2ac' : '#d53f8c',
  backgroundColor: type === 'opportunity' ? '#38b2ac' : '#d53f8c',
  color: 'white',
  fontWeight: 600,
  fontSize: '0.875rem',
}))

const SlotIcon = styled.span({
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '50%',
  fontSize: '0.875rem',
})

const SlotText = styled.span({})

const PlayerToken = styled.div({
  position: 'absolute',
  left: '20px',
  transition: 'top 0.5s ease',
})

const TokenAvatar = styled.div({
  width: '3rem',
  height: '3rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  border: '2px solid white',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
})

const MoneySign = styled.div({
  position: 'absolute',
  right: '-20px',
  top: '60%',
  backgroundColor: '#ecc94b',
  color: '#744210',
  padding: '0.25rem 0.5rem',
  borderRadius: '0.25rem',
  fontWeight: 700,
  fontSize: '0.875rem',
})

const DiceContainer = styled.div({
  display: 'flex',
  gap: '0.5rem',
  position: 'absolute',
  bottom: '120px',
})

const DiceBox = styled.div({
  width: '3rem',
  height: '3.5rem',
  backgroundColor: '#1a202c',
  borderRadius: '0.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: 700,
  border: '2px solid #4a5568',
})

const RollButton = styled.button({
  position: 'absolute',
  bottom: '30px',
  width: '4rem',
  height: '4rem',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#2d3748',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.15s ease',
  '&:hover:not(:disabled)': {
    backgroundColor: '#4a5568',
    transform: 'scale(1.05)',
  },
  '&:active:not(:disabled)': {
    transform: 'scale(0.95)',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const MusicButton = styled.button({
  position: 'absolute',
  bottom: '1rem',
  right: '1rem',
  width: '2.5rem',
  height: '2.5rem',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: '#48bb78',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

const BottomBar = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  padding: '0.75rem',
  backgroundColor: '#1a202c',
  [`@media (min-width: ${breakpoints.md})`]: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
})

const ActionButtons = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  [`@media (min-width: ${breakpoints.md})`]: {
    width: '140px',
  },
})

const ReportButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  border: 'none',
  backgroundColor: '#ed8936',
  color: 'white',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#dd6b20',
  },
})

const BankButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1.5rem',
  borderRadius: '0.5rem',
  border: '2px solid #ecc94b',
  backgroundColor: 'transparent',
  color: '#ecc94b',
  fontSize: '1rem',
  fontWeight: 700,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'rgba(236, 201, 75, 0.1)',
  },
})

const ButtonIcon = styled.span({
  display: 'flex',
  alignItems: 'center',
})

const StatsGrid = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

const StatRow = styled.div(({ highlight }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '0.25rem 0.5rem',
  borderTop: highlight ? '1px solid #4a5568' : 'none',
}))

const StatItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
})

const StatLabel = styled.span({
  color: '#a0aec0',
  fontSize: '0.75rem',
})

const StatValue = styled.span(({ highlight, accent, large }) => ({
  color: accent ? '#48bb78' : highlight ? '#ecc94b' : 'white',
  fontSize: large ? '1rem' : '0.875rem',
  fontWeight: 600,
}))

const CashIcon = styled.span({
  color: '#3182ce',
  fontSize: '0.75rem',
})
//#endregion styled components
