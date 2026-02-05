import styled from '@emotion/styled'
import { useContext, useState, useEffect, useRef } from 'react'
import { GameContext, rollDice, playSFX, BOARD_SLOTS, drawCard } from '@/utils'

const Board = () => {
  const { currentSlot, setCurrentSlot, setPrevSlot, setActionType, playerData, setPlayerData, setCard } = useContext(GameContext)
  const [diceValues, setDiceValues] = useState([0, 0, 0])
  const [isRolling, setIsRolling] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevSlotRef = useRef(currentSlot)

  // When current slot changes, animate the road scrolling
  useEffect(() => {
    if (prevSlotRef.current !== currentSlot) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
      prevSlotRef.current = currentSlot
    }
  }, [currentSlot])

  const getSlotDisplay = (slot) => {
    const slotConfig = {
      'Payday': { label: '发薪日', color: 'green', icon: '💰' },
      'Opportunity': { label: '机会', color: 'cyan', icon: '?' },
      'Market': { label: '市场风云', color: 'blue', icon: '📈' },
      'Doodads': { label: '生活小插曲', color: 'pink', icon: '🎵' },
      'Baby': { label: '添丁', color: 'yellow', icon: '👶' },
      'Downsized': { label: '失业', color: 'red', icon: '📉' },
      'Charity': { label: '慈善', color: 'purple', icon: '❤️' },
    }
    return slotConfig[slot.name] || { label: slot.name, color: 'grey', icon: '?' }
  }

  const handleRoll = () => {
    if (isRolling) return
    
    setIsRolling(true)
    playSFX('/assets/sounds/roll.mp3')
    
    // Handle charity effect (multiple dice)
    if (playerData.charityTurnLeft === 1) {
      setPlayerData((prev) => ({
        ...prev,
        diceNum: 1,
      }))
    }
    if (playerData.charityTurnLeft > 0) {
      setPlayerData((prev) => ({
        ...prev,
        charityTurnLeft: playerData.charityTurnLeft - 1,
      }))
    }
    
    // Animate dice
    let count = 0
    const interval = setInterval(() => {
      setDiceValues([
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
        Math.floor(Math.random() * 6) + 1,
      ])
      count++
      if (count > 10) {
        clearInterval(interval)
        const finalRoll = rollDice(playerData.diceNum)
        const d1 = Math.min(finalRoll, 6)
        const d2 = finalRoll > 6 ? Math.min(finalRoll - 6, 6) : 0
        const d3 = finalRoll > 12 ? finalRoll - 12 : 0
        setDiceValues([d1, d2, d3])
        
        setPrevSlot(currentSlot)
        const newSlot = (currentSlot + finalRoll) % 24
        setCurrentSlot(newSlot)
        setIsRolling(false)
        
        // Draw card and set action based on slot type
        const card = drawCard(BOARD_SLOTS[newSlot].type)
        setCard(card)
        
        setTimeout(() => {
          setActionType(BOARD_SLOTS[newSlot].type)
        }, 500)
      }
    }, 100)
  }

  // Generate slots to display - show 7 slots around current position (all on right side like trees)
  const getSlotsToRender = () => {
    const slots = []
    // Show 7 slots: 3 behind, current, 3 ahead
    for (let i = -3; i <= 3; i++) {
      const slotIndex = (currentSlot + i + 24) % 24
      slots.push({
        ...BOARD_SLOTS[slotIndex],
        relativePosition: i,
        slotIndex
      })
    }
    return slots
  }

  const slotsToRender = getSlotsToRender()

  return (
    <BoardContainer>
      {/* Main game area */}
      <RoadSection>
        {/* Left side - Road with character */}
        <RoadArea>
          {/* Lane markings */}
          <LaneMarking side="left" />
          <LaneMarking side="right" />
          
          {/* Road text - vertical "财务自由路" */}
          <RoadText>
            <RoadChar style={{ opacity: 0.5 }}>财</RoadChar>
            <RoadChar style={{ opacity: 0.6 }}>务</RoadChar>
            <RoadChar style={{ opacity: 0.75 }}>自</RoadChar>
            <RoadChar style={{ opacity: 0.85 }}>由</RoadChar>
            <RoadChar>路</RoadChar>
          </RoadText>

          {/* Player character - fixed in center */}
          <PlayerCharacter>
            <CharacterBody>
              <CharacterHat />
              <CharacterFace />
              <CharacterTorso />
            </CharacterBody>
          </PlayerCharacter>

          {/* Money sign next to character */}
          <MoneySign>钱</MoneySign>
        </RoadArea>

        {/* Right side - All slots like trees along the road */}
        <SlotsArea isAnimating={isAnimating}>
          {slotsToRender.map((slot, index) => {
            const config = getSlotDisplay(slot)
            const isPassed = slot.relativePosition < 0
            const isCurrent = slot.relativePosition === 0
            
            return (
              <SlotCard 
                key={`slot-${slot.slotIndex}`}
                color={config.color}
                isPassed={isPassed}
                isCurrent={isCurrent}
                position={slot.relativePosition}
                index={index}
              >
                <SlotIcon isCurrent={isCurrent}>{config.icon}</SlotIcon>
                <SlotLabel>{config.label}</SlotLabel>
                {isCurrent && <CurrentIndicator />}
              </SlotCard>
            )
          })}
        </SlotsArea>
      </RoadSection>

      {/* Dice and Roll Section */}
      <ControlSection>
        <DiceContainer>
          {diceValues.map((value, index) => (
            <Dice key={index} rolling={isRolling}>
              {value}
            </Dice>
          ))}
        </DiceContainer>
        
        {/* Roll Button - Fingerprint */}
        <RollButton onClick={handleRoll} disabled={isRolling}>
          <FingerprintIcon />
        </RollButton>

        {/* Music toggle */}
        <MusicToggle>
          <MusicNote>&#9835;</MusicNote>
        </MusicToggle>
      </ControlSection>
    </BoardContainer>
  )
}

export default Board

//#region styled components
const BoardContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
})

const RoadSection = styled.div({
  flex: 1,
  display: 'flex',
  alignItems: 'stretch',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
})

const RoadArea = styled.div({
  width: '180px',
  minWidth: '180px',
  backgroundColor: '#3D4B6A',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 4px 0 20px rgba(0,0,0,0.3)',
})

const LaneMarking = styled.div(({ side }) => ({
  position: 'absolute',
  top: '0',
  bottom: '0',
  [side]: '25px',
  width: '5px',
  background: `repeating-linear-gradient(
    to bottom,
    #C4A574 0px,
    #C4A574 30px,
    transparent 30px,
    transparent 55px
  )`,
}))

const RoadText = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
  zIndex: 1,
})

const RoadChar = styled.span({
  color: '#5A6B8A',
  fontSize: '2.2rem',
  fontWeight: 700,
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
})

const PlayerCharacter = styled.div({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
})

const CharacterBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const CharacterHat = styled.div({
  width: '42px',
  height: '16px',
  backgroundColor: '#6B21A8',
  borderRadius: '50% 50% 0 0',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-4px',
    left: '-6px',
    right: '-6px',
    height: '8px',
    backgroundColor: '#6B21A8',
    borderRadius: '2px',
  },
})

const CharacterFace = styled.div({
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  backgroundColor: '#F5F5F5',
  marginTop: '4px',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
})

const CharacterTorso = styled.div({
  width: '56px',
  height: '36px',
  backgroundColor: '#7C3AED',
  borderRadius: '28px 28px 0 0',
  marginTop: '-10px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
})

const MoneySign = styled.div({
  position: 'absolute',
  top: '50%',
  right: '-45px',
  transform: 'translateY(-50%)',
  backgroundColor: '#FBBF24',
  color: '#1F2937',
  padding: '0.5rem 0.75rem',
  borderRadius: '4px',
  fontWeight: 700,
  fontSize: '1rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  zIndex: 15,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-10px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '0',
    height: '0',
    borderTop: '8px solid transparent',
    borderBottom: '8px solid transparent',
    borderRight: '10px solid #FBBF24',
  },
})

const SlotsArea = styled.div(({ isAnimating }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '1rem 1rem 1rem 2.5rem',
  gap: '0.6rem',
  transition: isAnimating ? 'transform 0.5s ease-out' : 'none',
}))

const SlotCard = styled.div(({ color, isPassed, isCurrent, position }) => {
  const colorMap = {
    cyan: { bg: '#00BCD4', border: '#00ACC1' },
    pink: { bg: '#E91E63', border: '#D81B60' },
    green: { bg: '#4CAF50', border: '#43A047' },
    blue: { bg: '#2196F3', border: '#1E88E5' },
    yellow: { bg: '#FFC107', border: '#FFB300' },
    red: { bg: '#F44336', border: '#E53935' },
    purple: { bg: '#9C27B0', border: '#8E24AA' },
    grey: { bg: '#607D8B', border: '#546E7A' },
  }
  const colors = colorMap[color] || colorMap.grey
  
  // Scale and opacity based on position
  const scale = isCurrent ? 1.08 : Math.max(0.8, 1 - Math.abs(position) * 0.06)
  const opacity = isPassed ? 0.45 : 1
  
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: isCurrent ? '0.65rem 1rem' : '0.5rem 0.85rem',
    borderRadius: '10px',
    backgroundColor: colors.bg,
    border: isCurrent ? '3px solid #FFD700' : `2px solid ${colors.border}`,
    color: '#fff',
    fontWeight: 600,
    fontSize: isCurrent ? '0.95rem' : '0.85rem',
    boxShadow: isCurrent 
      ? '0 0 25px rgba(255, 215, 0, 0.6), 0 6px 20px rgba(0,0,0,0.4)' 
      : '0 3px 12px rgba(0,0,0,0.25)',
    transition: 'all 0.4s ease',
    whiteSpace: 'nowrap',
    transform: `scale(${scale})`,
    transformOrigin: 'left center',
    opacity,
    zIndex: isCurrent ? 10 : 5 - Math.abs(position),
    position: 'relative',
  }
})

const SlotIcon = styled.span(({ isCurrent }) => ({
  width: isCurrent ? '28px' : '24px',
  height: isCurrent ? '28px' : '24px',
  borderRadius: '50%',
  backgroundColor: isCurrent ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: isCurrent ? '0.9rem' : '0.8rem',
  flexShrink: 0,
}))

const SlotLabel = styled.span({
  fontSize: 'inherit',
})

const CurrentIndicator = styled.div({
  position: 'absolute',
  left: '-18px',
  top: '50%',
  transform: 'translateY(-50%)',
  width: '0',
  height: '0',
  borderTop: '8px solid transparent',
  borderBottom: '8px solid transparent',
  borderLeft: '10px solid #FFD700',
})

const ControlSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: 'rgba(0,0,0,0.2)',
})

const DiceContainer = styled.div({
  display: 'flex',
  gap: '0.35rem',
})

const Dice = styled.div(({ rolling }) => ({
  width: '50px',
  height: '60px',
  backgroundColor: '#0F0F0F',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#fff',
  border: '2px solid #2A2A2A',
  fontFamily: 'monospace',
  animation: rolling ? 'shake 0.1s infinite' : 'none',
  '@keyframes shake': {
    '0%, 100%': { transform: 'rotate(-3deg)' },
    '50%': { transform: 'rotate(3deg)' },
  },
}))

const RollButton = styled.button({
  width: '70px',
  height: '70px',
  borderRadius: '50%',
  backgroundColor: '#1A1A1A',
  border: '3px solid #3A3A3A',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#2A2A2A',
    transform: 'scale(1.05)',
    borderColor: '#4A4A4A',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '&:disabled': {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
})

const FingerprintIcon = () => (
  <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
    <path d="M2 12a10 10 0 0 1 18-6" />
    <path d="M2 16h.01" />
    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
    <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
    <path d="M8.65 22c.21-.66.45-1.32.57-2" />
    <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
  </svg>
)

const MusicToggle = styled.button({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#00BCD4',
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  '&:hover': {
    transform: 'scale(1.1)',
    backgroundColor: '#00ACC1',
  },
})

const MusicNote = styled.span({
  fontSize: '1.1rem',
  color: '#fff',
})
//#endregion styled components
