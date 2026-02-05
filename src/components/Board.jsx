import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { useContext, useState } from 'react'
import { GameContext, BOARD_SLOTS, rollDice, playSFX, drawCard, getTotalIncomeAmount, getTotalExpenseAmount, currencyFormatter } from '@/utils'

// Slot type configurations with Chinese names
const SLOT_CONFIG = {
  payday: { name: '发薪日', color: '#22c55e', icon: '💰' },
  opportunity: { name: '机会', color: '#06b6d4', icon: '🎯' },
  market: { name: '市场风云', color: '#f59e0b', icon: '📈' },
  doodads: { name: '额外支出', color: '#ec4899', icon: '🛒' },
  baby: { name: '添丁', color: '#f472b6', icon: '👶' },
  downsized: { name: '失业', color: '#ef4444', icon: '📉' },
  charity: { name: '慈善', color: '#8b5cf6', icon: '❤️' },
}

const Board = () => {
  const { currentSlot, setCurrentSlot, setPrevSlot, setActionType, playerData, setPlayerData, setCard } = useContext(GameContext)
  const [isRolling, setIsRolling] = useState(false)
  const [diceValue, setDiceValue] = useState(1)
  const [showDice, setShowDice] = useState(false)

  // Get visible slots (current position and nearby)
  const getVisibleSlots = () => {
    const slots = []
    for (let i = -3; i <= 4; i++) {
      const idx = (currentSlot + i + 24) % 24
      slots.push({ ...BOARD_SLOTS[idx], offset: i })
    }
    return slots
  }

  const handleRoll = () => {
    if (isRolling) return
    
    setIsRolling(true)
    setShowDice(true)
    playSFX('/assets/sounds/roll.mp3')

    // Handle charity effect
    if (playerData.charityTurnLeft === 1) {
      setPlayerData((prev) => ({ ...prev, diceNum: 1 }))
    }
    if (playerData.charityTurnLeft > 0) {
      setPlayerData((prev) => ({ ...prev, charityTurnLeft: playerData.charityTurnLeft - 1 }))
    }

    // Animate dice
    let count = 0
    const interval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1)
      count++
      if (count > 15) {
        clearInterval(interval)
        const finalRoll = rollDice(playerData.diceNum)
        setDiceValue(finalRoll)
        
        setPrevSlot(currentSlot)
        const newSlot = (currentSlot + finalRoll) % 24
        setCurrentSlot(newSlot)
        
        const card = drawCard(BOARD_SLOTS[newSlot].type)
        setCard(card)
        
        setTimeout(() => {
          setIsRolling(false)
          setShowDice(false)
          setActionType(BOARD_SLOTS[newSlot].type)
        }, 800)
      }
    }, 80)
  }

  const visibleSlots = getVisibleSlots()

  // Calculate financial data
  const totalIncome = getTotalIncomeAmount(playerData)
  const totalExpense = getTotalExpenseAmount(playerData)
  const passiveIncome = playerData.incomes
    .filter((i) => i.type === 'passive')
    .reduce((total, i) => total + i.amount, 0)
  const activeIncome = totalIncome - passiveIncome
  const cashflow = totalIncome - totalExpense
  const bankLoan = playerData.liabilities
    .filter((l) => l.type === 'bank')
    .reduce((total, l) => total + l.amount, 0)

  return (
    <BoardContainer>
      {/* Financial Status Bar - Top */}
      <FinancialStatusBar>
        <FinancialRow>
          <FinancialItem>
            <FinancialLabel>月被动收入</FinancialLabel>
            <FinancialValue>{currencyFormatter.format(passiveIncome)}</FinancialValue>
          </FinancialItem>
          <FinancialItem>
            <FinancialLabel>月主动收入</FinancialLabel>
            <FinancialValue>{currencyFormatter.format(activeIncome)}</FinancialValue>
          </FinancialItem>
        </FinancialRow>
        <FinancialRow>
          <FinancialItem>
            <FinancialLabel>月总支出</FinancialLabel>
            <FinancialValue>{currencyFormatter.format(totalExpense)}</FinancialValue>
          </FinancialItem>
          <FinancialItem>
            <FinancialLabel>银行贷款</FinancialLabel>
            <FinancialValue>{currencyFormatter.format(bankLoan)}</FinancialValue>
          </FinancialItem>
        </FinancialRow>
        <FinancialHighlightRow>
          <FinancialHighlightItem>
            <FinancialHighlightIcon>~</FinancialHighlightIcon>
            <FinancialHighlightLabel>月现金流</FinancialHighlightLabel>
            <FinancialHighlightValue positive={cashflow >= 0}>
              {currencyFormatter.format(cashflow)}
            </FinancialHighlightValue>
          </FinancialHighlightItem>
          <FinancialHighlightItem>
            <FinancialHighlightIcon>$</FinancialHighlightIcon>
            <FinancialHighlightLabel>现金</FinancialHighlightLabel>
            <FinancialHighlightValue positive={true}>
              {currencyFormatter.format(playerData.cash)}
            </FinancialHighlightValue>
          </FinancialHighlightItem>
        </FinancialHighlightRow>
      </FinancialStatusBar>

      {/* Road Title */}
      <RoadTitle>
        {'财务自由路'.split('').map((char, i) => (
          <RoadChar key={i}>{char}</RoadChar>
        ))}
      </RoadTitle>

      {/* Lane markings */}
      <LaneMarkings>
        <LaneLine side="left" />
        <LaneLine side="right" />
      </LaneMarkings>

      {/* Player Character */}
      <PlayerCharacter>
        <CharacterBody>
          <CharacterHead />
          <CharacterTorso />
        </CharacterBody>
        {showDice && (
          <DiceDisplay rolling={isRolling}>
            {diceValue}
          </DiceDisplay>
        )}
      </PlayerCharacter>

      {/* Slots along the road */}
      <SlotsContainer>
        {visibleSlots.map((slot, index) => {
          const config = SLOT_CONFIG[slot.type] || SLOT_CONFIG.opportunity
          const isCurrent = slot.offset === 0
          return (
            <SlotCard 
              key={`${slot.id}-${index}`} 
              color={config.color}
              isCurrent={isCurrent}
              offset={slot.offset}
            >
              <SlotIcon>{config.icon}</SlotIcon>
              <SlotName>{config.name}</SlotName>
              {isCurrent && <CurrentIndicator />}
            </SlotCard>
          )
        })}
      </SlotsContainer>

      {/* Roll Button - Now on the board */}
      <RollButtonContainer>
        <RollButton onClick={handleRoll} disabled={isRolling}>
          <RollButtonInner>
            <FingerprintIcon viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M12 2v4M12 18v4" stroke="currentColor" strokeWidth="1.5"/>
            </FingerprintIcon>
          </RollButtonInner>
          <RollLabel>{isRolling ? '掷骰中...' : '点击掷骰'}</RollLabel>
        </RollButton>
      </RollButtonContainer>
    </BoardContainer>
  )
}

export default Board

//#region styled components
const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
`

const shake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
`

const BoardContainer = styled.div({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  minHeight: 'calc(100vh - 120px)',
  background: 'linear-gradient(180deg, #3D4B6A 0%, #2A3550 100%)',
  overflow: 'hidden',
})

const RoadTitle = styled.div({
  position: 'absolute',
  left: '24px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  zIndex: 1,
})

const RoadChar = styled.span({
  color: 'rgba(255, 255, 255, 0.12)',
  fontSize: '32px',
  fontWeight: 700,
  letterSpacing: '2px',
})

const LaneMarkings = styled.div({
  position: 'absolute',
  left: '80px',
  top: 0,
  bottom: 0,
  width: '80px',
})

const LaneLine = styled.div(({ side }) => ({
  position: 'absolute',
  [side]: 0,
  top: 0,
  bottom: 0,
  width: '4px',
  background: `repeating-linear-gradient(
    to bottom,
    #C4A574 0px,
    #C4A574 24px,
    transparent 24px,
    transparent 48px
  )`,
}))

const PlayerCharacter = styled.div({
  position: 'absolute',
  left: '100px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  zIndex: 10,
})

const CharacterBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const CharacterHead = styled.div({
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
})

const CharacterTorso = styled.div({
  width: '44px',
  height: '30px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  borderRadius: '22px 22px 0 0',
  marginTop: '-10px',
})

const DiceDisplay = styled.div(({ rolling }) => ({
  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  color: '#fff',
  width: '44px',
  height: '44px',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '24px',
  fontWeight: 700,
  boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
  animation: rolling ? `${shake} 0.15s infinite` : 'none',
}))

const SlotsContainer = styled.div({
  position: 'absolute',
  right: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
  width: '130px',
})

const SlotCard = styled.div(({ color, isCurrent, offset }) => ({
  position: 'relative',
  background: isCurrent 
    ? `linear-gradient(135deg, ${color}50 0%, ${color}25 100%)`
    : 'rgba(255, 255, 255, 0.06)',
  border: `2px solid ${isCurrent ? color : 'rgba(255, 255, 255, 0.12)'}`,
  borderRadius: '14px',
  padding: '12px 14px',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transform: isCurrent ? 'scale(1.08)' : `scale(${1 - Math.abs(offset) * 0.04})`,
  opacity: isCurrent ? 1 : 0.7 - Math.abs(offset) * 0.08,
  transition: 'all 0.3s ease',
  boxShadow: isCurrent ? `0 6px 20px ${color}50` : 'none',
}))

const SlotIcon = styled.span({
  fontSize: '22px',
})

const SlotName = styled.span({
  color: '#fff',
  fontSize: '14px',
  fontWeight: 500,
  flex: 1,
})

const CurrentIndicator = styled.div({
  position: 'absolute',
  left: '-24px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 0,
  height: 0,
  borderTop: '10px solid transparent',
  borderBottom: '10px solid transparent',
  borderLeft: '14px solid #fbbf24',
})

const RollButtonContainer = styled.div({
  position: 'absolute',
  bottom: '160px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 20,
})

const RollButton = styled.button(({ disabled }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '10px',
  background: 'none',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1,
  transition: 'transform 0.2s ease',
  '&:active': {
    transform: disabled ? 'none' : 'scale(0.92)',
  },
}))

const RollButtonInner = styled.div({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1f2937 0%, #0f1419 100%)',
  border: '4px solid rgba(255, 255, 255, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 -3px 12px rgba(255,255,255,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.5)',
    boxShadow: '0 8px 40px rgba(0,0,0,0.6), inset 0 -3px 12px rgba(255,255,255,0.15)',
  },
})

const FingerprintIcon = styled.svg({
  width: '44px',
  height: '44px',
  color: 'rgba(255, 255, 255, 0.85)',
})

const RollLabel = styled.span({
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '15px',
  fontWeight: 600,
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
})

// Financial Status Bar Styles
const FinancialStatusBar = styled.div({
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  background: 'rgba(255, 255, 255, 0.95)',
  borderTopLeftRadius: '16px',
  borderTopRightRadius: '16px',
  padding: '12px 16px',
  zIndex: 30,
  boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
})

const FinancialRow = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
})

const FinancialItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  flex: 1,
})

const FinancialLabel = styled.span({
  color: '#6b7280',
  fontSize: '12px',
  fontWeight: 500,
})

const FinancialValue = styled.span({
  color: '#1f2937',
  fontSize: '13px',
  fontWeight: 600,
})

const FinancialHighlightRow = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: '8px',
  borderTop: '1px solid #e5e7eb',
  marginTop: '4px',
})

const FinancialHighlightItem = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
})

const FinancialHighlightIcon = styled.span({
  color: '#f59e0b',
  fontSize: '14px',
  fontWeight: 700,
})

const FinancialHighlightLabel = styled.span({
  color: '#f59e0b',
  fontSize: '12px',
  fontWeight: 600,
})

const FinancialHighlightValue = styled.span(({ positive }) => ({
  color: positive ? '#10b981' : '#ef4444',
  fontSize: '15px',
  fontWeight: 700,
}))
//#endregion styled components
