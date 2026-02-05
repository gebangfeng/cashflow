import styled from '@emotion/styled'
import { useContext, useState, useEffect, useRef } from 'react'
import { GameContext, rollDice, playSFX, BOARD_SLOTS, drawCard } from '@/utils'

const Board = () => {
  const { currentSlot, setCurrentSlot, setPrevSlot, setActionType, playerData, setPlayerData, setCard } = useContext(GameContext)
  const [diceValues, setDiceValues] = useState([0, 0, 0])
  const [isRolling, setIsRolling] = useState(false)
  const [scrollOffset, setScrollOffset] = useState(0)
  const prevSlotRef = useRef(currentSlot)

  // When current slot changes, animate the road scrolling
  useEffect(() => {
    if (prevSlotRef.current !== currentSlot) {
      const diff = (currentSlot - prevSlotRef.current + 24) % 24
      setScrollOffset(prev => prev + diff)
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

  // Generate slots to display - show slots around current position
  const getSlotsToRender = () => {
    const slots = []
    // Show 7 slots: 3 passed and 3 ahead
    for (let i = -3; i <= 3; i++) {
      const slotIndex = (currentSlot + i + 24) % 24
      slots.push({
        ...BOARD_SLOTS[slotIndex],
        relativePosition: i, // negative = passed, positive = upcoming
        slotIndex
      })
    }
    return slots
  }

  const slotsToRender = getSlotsToRender()

  return (
    <BoardContainer>
      {/* Road with scrolling slots */}
      <RoadSection>
        {/* Left side slots (trees) */}
        <SlotColumn side="left">
          {slotsToRender.filter((_, i) => i % 2 === 0).map((slot) => {
            const config = getSlotDisplay(slot)
            const isPassed = slot.relativePosition < 0
            const isCurrent = slot.relativePosition === 0
            
            return (
              <SlotCard 
                key={`left-${slot.slotIndex}`}
                color={config.color}
                isPassed={isPassed}
                isCurrent={isCurrent}
                position={slot.relativePosition}
              >
                <SlotIcon isCurrent={isCurrent}>{config.icon}</SlotIcon>
                <SlotLabel>{config.label}</SlotLabel>
              </SlotCard>
            )
          })}
        </SlotColumn>

        {/* Center Road */}
        <RoadCenter>
          {/* Lane markings */}
          <LaneMarking side="left" />
          <LaneMarking side="right" />
          
          {/* Road text */}
          <RoadText>
            <RoadChar style={{ opacity: 0.6 }}>财</RoadChar>
            <RoadChar style={{ opacity: 0.7 }}>务</RoadChar>
            <RoadChar style={{ opacity: 0.85 }}>自</RoadChar>
            <RoadChar style={{ opacity: 0.9 }}>由</RoadChar>
            <RoadChar>路</RoadChar>
          </RoadText>

          {/* Player character - stays in center */}
          <PlayerCharacter>
            <CharacterBody>
              <CharacterHat />
              <CharacterFace />
              <CharacterTorso />
            </CharacterBody>
          </PlayerCharacter>

          {/* Money sign indicator */}
          <MoneySign>钱</MoneySign>
        </RoadCenter>

        {/* Right side slots (trees) */}
        <SlotColumn side="right">
          {slotsToRender.filter((_, i) => i % 2 === 1).map((slot) => {
            const config = getSlotDisplay(slot)
            const isPassed = slot.relativePosition < 0
            const isCurrent = slot.relativePosition === 0
            
            return (
              <SlotCard 
                key={`right-${slot.slotIndex}`}
                color={config.color}
                isPassed={isPassed}
                isCurrent={isCurrent}
                position={slot.relativePosition}
              >
                <SlotIcon isCurrent={isCurrent}>{config.icon}</SlotIcon>
                <SlotLabel>{config.label}</SlotLabel>
              </SlotCard>
            )
          })}
        </SlotColumn>
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
          <MusicNote>♪</MusicNote>
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
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
  padding: '1rem 0',
})

const SlotColumn = styled.div(({ side }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  alignItems: side === 'left' ? 'flex-end' : 'flex-start',
  padding: '1.5rem 0.5rem',
  width: '40%',
  gap: '0.75rem',
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
  
  // Scale based on position - closer to player = larger
  const scale = isCurrent ? 1.1 : Math.max(0.75, 1 - Math.abs(position) * 0.1)
  const opacity = isPassed ? 0.5 : 1
  
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '8px',
    backgroundColor: colors.bg,
    border: isCurrent ? '3px solid #FFD700' : `2px solid ${colors.border}`,
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.8rem',
    boxShadow: isCurrent 
      ? '0 0 20px rgba(255, 215, 0, 0.7), 0 4px 15px rgba(0,0,0,0.4)' 
      : '0 3px 10px rgba(0,0,0,0.3)',
    transition: 'all 0.5s ease',
    whiteSpace: 'nowrap',
    transform: `scale(${scale})`,
    opacity,
    zIndex: isCurrent ? 10 : 5 - Math.abs(position),
  }
})

const SlotIcon = styled.span(({ isCurrent }) => ({
  width: '24px',
  height: '24px',
  borderRadius: '50%',
  backgroundColor: isCurrent ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.8rem',
  flexShrink: 0,
}))

const SlotLabel = styled.span({
  fontSize: '0.85rem',
})

const RoadCenter = styled.div({
  width: '90px',
  minWidth: '90px',
  backgroundColor: '#3D4B6A',
  borderRadius: '45px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)',
})

const LaneMarking = styled.div(({ side }) => ({
  position: 'absolute',
  top: '5%',
  bottom: '5%',
  [side]: '18px',
  width: '3px',
  background: `repeating-linear-gradient(
    to bottom,
    #C4A574 0px,
    #C4A574 20px,
    transparent 20px,
    transparent 35px
  )`,
}))

const RoadText = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  zIndex: 1,
})

const RoadChar = styled.span({
  color: '#5A6B8A',
  fontSize: '1.5rem',
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
  width: '30px',
  height: '10px',
  backgroundColor: '#6B21A8',
  borderRadius: '50% 50% 0 0',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-2px',
    left: '-4px',
    right: '-4px',
    height: '5px',
    backgroundColor: '#6B21A8',
    borderRadius: '2px',
  },
})

const CharacterFace = styled.div({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  backgroundColor: '#F5F5F5',
  marginTop: '2px',
  position: 'relative',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
})

const CharacterTorso = styled.div({
  width: '38px',
  height: '25px',
  backgroundColor: '#7C3AED',
  borderRadius: '19px 19px 0 0',
  marginTop: '-6px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
})

const MoneySign = styled.div({
  position: 'absolute',
  top: '48%',
  right: '-40px',
  backgroundColor: '#FBBF24',
  color: '#1F2937',
  padding: '0.3rem 0.5rem',
  borderRadius: '4px',
  fontWeight: 700,
  fontSize: '0.75rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  zIndex: 5,
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-6px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '0',
    height: '0',
    borderTop: '5px solid transparent',
    borderBottom: '5px solid transparent',
    borderRight: '6px solid #FBBF24',
  },
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
