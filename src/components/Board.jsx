import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { useContext, useState } from 'react'
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
    for (let i = -3; i <= 3; i++) {
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
      {/* Left side - Road area */}
      <RoadArea>
        {/* Road Title - vertical text */}
        <RoadTitle>
          {'财务自由路'.split('').map((char, i) => (
            <RoadChar key={i}>{char}</RoadChar>
          ))}
        </RoadTitle>

        {/* Lane markings */}
        <LaneMarkings>
          <LaneLine side="left" />
          <CenterLine />
          <LaneLine side="right" />
        </LaneMarkings>

        {/* Player Character */}
        <PlayerSection>
          <CharacterBody>
            <CharacterHead />
            <CharacterTorso />
          </CharacterBody>
          {showDice && (
            <DiceDisplay rolling={isRolling}>
              {diceValue}
            </DiceDisplay>
          )}
        </PlayerSection>

        {/* Roll Button */}
        <RollButtonWrapper>
          <RollButton onClick={handleRoll} disabled={isRolling}>
            <RollButtonInner rolling={isRolling}>
              <FingerprintIcon viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12 2v4M12 18v4" stroke="currentColor" strokeWidth="1.5"/>
              </FingerprintIcon>
            </RollButtonInner>
            <RollLabel>{isRolling ? '掷骰中...' : '点击掷骰'}</RollLabel>
          </RollButton>
        </RollButtonWrapper>
      </RoadArea>

      {/* Right side - Slots */}
      <SlotsArea>
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
                <SlotConnector color={isCurrent ? config.color : 'rgba(255,255,255,0.2)'} />
                <SlotContent isCurrent={isCurrent} color={config.color}>
                  <SlotIcon>{config.icon}</SlotIcon>
                  <SlotName>{config.name}</SlotName>
                </SlotContent>
              </SlotCard>
            )
          })}
        </SlotsContainer>
      </SlotsArea>
    </BoardContainer>
  )
}

export default Board

//#region styled components
const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`

const shake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(-10deg); }
  75% { transform: rotate(10deg); }
`

const BoardContainer = styled.div({
  display: 'flex',
  width: '100%',
  height: '100%',
  background: 'linear-gradient(180deg, #3D4B6A 0%, #2A3550 100%)',
  overflow: 'hidden',
})

const RoadArea = styled.div({
  width: '140px',
  minWidth: '140px',
  height: '100%',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
})

const RoadTitle = styled.div({
  position: 'absolute',
  left: '12px',
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  zIndex: 1,
})

const RoadChar = styled.span({
  color: 'rgba(255, 255, 255, 0.12)',
  fontSize: '24px',
  fontWeight: 700,
})

const LaneMarkings = styled.div({
  position: 'absolute',
  left: '50px',
  top: 0,
  bottom: 0,
  width: '70px',
})

const LaneLine = styled.div(({ side }) => ({
  position: 'absolute',
  [side]: 0,
  top: 0,
  bottom: 0,
  width: '3px',
  background: `repeating-linear-gradient(
    to bottom,
    #B8956E 0px,
    #B8956E 20px,
    transparent 20px,
    transparent 40px
  )`,
}))

const CenterLine = styled.div({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  top: 0,
  bottom: 0,
  width: '2px',
  background: `repeating-linear-gradient(
    to bottom,
    #fff 0px,
    #fff 12px,
    transparent 12px,
    transparent 24px
  )`,
  opacity: 0.3,
})

const PlayerSection = styled.div({
  position: 'absolute',
  left: '60px',
  top: '35%',
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
  marginTop: '-6px',
})

const DiceDisplay = styled.div(({ rolling }) => ({
  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  color: '#fff',
  width: '36px',
  height: '36px',
  borderRadius: '6px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
  animation: rolling ? `${shake} 0.15s infinite` : 'none',
}))

const RollButtonWrapper = styled.div({
  position: 'absolute',
  left: '50%',
  bottom: '20px',
  transform: 'translateX(-50%)',
  zIndex: 20,
})

const RollButton = styled.button(({ disabled }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
  background: 'none',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.7 : 1,
  transition: 'all 0.2s ease',
  '&:active': {
    transform: disabled ? 'none' : 'scale(0.95)',
  },
}))

const RollButtonInner = styled.div(({ rolling }) => ({
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  border: '2px solid rgba(255, 255, 255, 0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
  transition: 'all 0.2s ease',
  animation: rolling ? `${pulse} 0.5s infinite` : 'none',
}))

const FingerprintIcon = styled.svg({
  width: '28px',
  height: '28px',
  color: 'rgba(255, 255, 255, 0.85)',
})

const RollLabel = styled.span({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '10px',
  fontWeight: 500,
})

const SlotsArea = styled.div({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 12px',
  overflow: 'hidden',
})

const SlotsContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  width: '100%',
  maxWidth: '200px',
})

const SlotCard = styled.div(({ color, isCurrent, offset }) => ({
  display: 'flex',
  alignItems: 'center',
  transform: isCurrent ? 'scale(1.05) translateX(-4px)' : `scale(${1 - Math.abs(offset) * 0.03})`,
  opacity: isCurrent ? 1 : 0.65 - Math.abs(offset) * 0.06,
  transition: 'all 0.3s ease',
}))

const SlotConnector = styled.div(({ color }) => ({
  width: '16px',
  height: '2px',
  background: color,
  flexShrink: 0,
}))

const SlotContent = styled.div(({ isCurrent, color }) => ({
  flex: 1,
  background: isCurrent ? `${color}22` : 'rgba(255, 255, 255, 0.06)',
  border: isCurrent ? `1px solid ${color}66` : '1px solid transparent',
  borderRadius: '8px',
  padding: '10px 12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
}))

const SlotIcon = styled.span({
  fontSize: '16px',
})

const SlotName = styled.span({
  color: '#fff',
  fontSize: '13px',
  fontWeight: 500,
})
//#endregion styled components
