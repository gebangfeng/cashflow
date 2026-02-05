import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { useContext, useState, useEffect } from 'react'
import { GameContext, BOARD_SLOTS, rollDice, playSFX, drawCard } from '@/utils'

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
    for (let i = -2; i <= 3; i++) {
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

  return (
    <BoardContainer>
      {/* Road Area */}
      <RoadSection>
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
      </RoadSection>

      {/* Roll Button */}
      <RollSection>
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
      </RollSection>
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
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  gap: '16px',
})

const RoadSection = styled.div({
  position: 'relative',
  background: 'linear-gradient(180deg, #3D4B6A 0%, #2A3550 100%)',
  borderRadius: '16px',
  padding: '20px 16px',
  minHeight: '360px',
  overflow: 'hidden',
})

const RoadTitle = styled.div({
  position: 'absolute',
  left: '24px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  zIndex: 1,
})

const RoadChar = styled.span({
  color: 'rgba(255, 255, 255, 0.15)',
  fontSize: '28px',
  fontWeight: 700,
})

const LaneMarkings = styled.div({
  position: 'absolute',
  left: '70px',
  top: 0,
  bottom: 0,
  width: '60px',
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
    #C4A574 20px,
    transparent 20px,
    transparent 40px
  )`,
}))

const PlayerCharacter = styled.div({
  position: 'absolute',
  left: '80px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  zIndex: 10,
})

const CharacterBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const CharacterHead = styled.div({
  width: '28px',
  height: '28px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #fef3c7 0%, #fcd34d 100%)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
})

const CharacterTorso = styled.div({
  width: '36px',
  height: '24px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
  borderRadius: '18px 18px 0 0',
  marginTop: '-8px',
})

const DiceDisplay = styled.div(({ rolling }) => ({
  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  color: '#fff',
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  animation: rolling ? `${shake} 0.15s infinite` : 'none',
}))

const SlotsContainer = styled.div({
  position: 'absolute',
  right: '16px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '120px',
})

const SlotCard = styled.div(({ color, isCurrent, offset }) => ({
  position: 'relative',
  background: isCurrent 
    ? `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`
    : 'rgba(255, 255, 255, 0.05)',
  border: `2px solid ${isCurrent ? color : 'rgba(255, 255, 255, 0.1)'}`,
  borderRadius: '12px',
  padding: '10px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transform: isCurrent ? 'scale(1.05)' : `scale(${1 - Math.abs(offset) * 0.05})`,
  opacity: isCurrent ? 1 : 0.6 - Math.abs(offset) * 0.1,
  transition: 'all 0.3s ease',
  boxShadow: isCurrent ? `0 4px 16px ${color}40` : 'none',
}))

const SlotIcon = styled.span({
  fontSize: '20px',
})

const SlotName = styled.span({
  color: '#fff',
  fontSize: '13px',
  fontWeight: 500,
  flex: 1,
})

const CurrentIndicator = styled.div({
  position: 'absolute',
  left: '-20px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: 0,
  height: 0,
  borderTop: '8px solid transparent',
  borderBottom: '8px solid transparent',
  borderLeft: '12px solid #fbbf24',
})

const RollSection = styled.div({
  display: 'flex',
  justifyContent: 'center',
  padding: '8px 0',
})

const RollButton = styled.button(({ disabled }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  background: 'none',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1,
  '&:active': {
    transform: disabled ? 'none' : 'scale(0.95)',
  },
}))

const RollButtonInner = styled.div({
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  border: '3px solid rgba(255, 255, 255, 0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 -2px 10px rgba(255,255,255,0.1)',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
})

const FingerprintIcon = styled.svg({
  width: '40px',
  height: '40px',
  color: 'rgba(255, 255, 255, 0.8)',
})

const RollLabel = styled.span({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '14px',
  fontWeight: 500,
})
//#endregion styled components
