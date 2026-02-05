import styled from '@emotion/styled'
import { useContext, useState, useEffect, useRef } from 'react'
import { GameContext, rollDice, playSFX, BOARD_SLOTS, drawCard } from '@/utils'

const Board = () => {
  const { currentSlot, setCurrentSlot, setPrevSlot, setActionType, playerData, setPlayerData, setCard } = useContext(GameContext)
  const [diceValues, setDiceValues] = useState([0, 0, 0])
  const [isRolling, setIsRolling] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const prevSlotRef = useRef(currentSlot)

  useEffect(() => {
    if (prevSlotRef.current !== currentSlot) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
      prevSlotRef.current = currentSlot
    }
  }, [currentSlot])

  const getSlotDisplay = (slot) => {
    const slotConfig = {
      'Payday': { label: '发薪日', color: 'green', icon: '?' },
      'Opportunity': { label: '机会', color: 'cyan', icon: '?' },
      'Market': { label: '市场风云', color: 'blue', icon: '?' },
      'Doodads': { label: '生活小插曲', color: 'pink', icon: '?' },
      'Baby': { label: '添丁', color: 'yellow', icon: '?' },
      'Downsized': { label: '失业', color: 'red', icon: '?' },
      'Charity': { label: '慈善', color: 'purple', icon: '?' },
    }
    return slotConfig[slot.name] || { label: slot.name, color: 'grey', icon: '?' }
  }

  const handleRoll = () => {
    if (isRolling) return
    
    setIsRolling(true)
    playSFX('/assets/sounds/roll.mp3')
    
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
        
        const card = drawCard(BOARD_SLOTS[newSlot].type)
        setCard(card)
        
        setTimeout(() => {
          setActionType(BOARD_SLOTS[newSlot].type)
        }, 500)
      }
    }, 100)
  }

  // Get slots to display - show more slots for fuller layout
  const getSlotsToRender = () => {
    const slots = []
    for (let i = -2; i <= 4; i++) {
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
      <GameArea>
        {/* Road Section - centered vertical road */}
        <RoadContainer>
          {/* Lane markings */}
          <LaneMarking side="left" />
          <LaneMarking side="right" />
          
          {/* Road text */}
          <RoadText>
            {'财务自由路'.split('').map((char, i) => (
              <RoadChar key={i} style={{ opacity: 0.4 + i * 0.12 }}>{char}</RoadChar>
            ))}
          </RoadText>

          {/* Player character */}
          <PlayerCharacter>
            <CharacterBody>
              <CharacterHat />
              <CharacterFace />
              <CharacterTorso />
            </CharacterBody>
            <MoneySign>钱</MoneySign>
          </PlayerCharacter>
        </RoadContainer>

        {/* Right side - Slots area taking more space */}
        <SlotsContainer>
          <SlotsWrapper isAnimating={isAnimating}>
            {slotsToRender.map((slot, index) => {
              const config = getSlotDisplay(slot)
              const isPassed = slot.relativePosition < 0
              const isCurrent = slot.relativePosition === 0
              
              return (
                <SlotRow key={`slot-${slot.slotIndex}`}>
                  {/* Connector line from road to slot */}
                  <Connector isCurrent={isCurrent} isPassed={isPassed} />
                  
                  <SlotCard 
                    color={config.color}
                    isPassed={isPassed}
                    isCurrent={isCurrent}
                  >
                    <SlotIconWrapper color={config.color} isCurrent={isCurrent}>
                      {config.icon}
                    </SlotIconWrapper>
                    <SlotLabel isCurrent={isCurrent}>{config.label}</SlotLabel>
                  </SlotCard>
                </SlotRow>
              )
            })}
          </SlotsWrapper>
        </SlotsContainer>
      </GameArea>

      {/* Bottom Control Section */}
      <ControlSection>
        <DiceContainer>
          {diceValues.map((value, index) => (
            <Dice key={index} rolling={isRolling}>
              {value}
            </Dice>
          ))}
        </DiceContainer>
        
        <RollButton onClick={handleRoll} disabled={isRolling}>
          <FingerprintIcon />
        </RollButton>

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
  backgroundColor: '#1B2240',
})

const GameArea = styled.div({
  flex: 1,
  display: 'flex',
  alignItems: 'stretch',
  width: '100%',
  position: 'relative',
  overflow: 'hidden',
})

const RoadContainer = styled.div({
  width: '140px',
  minWidth: '140px',
  backgroundColor: '#3D4B6A',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'inset 0 0 30px rgba(0,0,0,0.5), 4px 0 15px rgba(0,0,0,0.4)',
})

const LaneMarking = styled.div(({ side }) => ({
  position: 'absolute',
  top: '0',
  bottom: '0',
  [side]: '18px',
  width: '4px',
  background: `repeating-linear-gradient(
    to bottom,
    #C4A574 0px,
    #C4A574 28px,
    transparent 28px,
    transparent 50px
  )`,
}))

const RoadText = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.8rem',
  zIndex: 1,
})

const RoadChar = styled.span({
  color: '#5A6B8A',
  fontSize: '1.8rem',
  fontWeight: 700,
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
})

const PlayerCharacter = styled.div({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
})

const CharacterBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const CharacterHat = styled.div({
  width: '36px',
  height: '14px',
  backgroundColor: '#6B21A8',
  borderRadius: '50% 50% 0 0',
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-4px',
    left: '-5px',
    right: '-5px',
    height: '7px',
    backgroundColor: '#6B21A8',
    borderRadius: '2px',
  },
})

const CharacterFace = styled.div({
  width: '42px',
  height: '42px',
  borderRadius: '50%',
  backgroundColor: '#F5F5F5',
  marginTop: '4px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
})

const CharacterTorso = styled.div({
  width: '50px',
  height: '32px',
  backgroundColor: '#7C3AED',
  borderRadius: '25px 25px 0 0',
  marginTop: '-8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
})

const MoneySign = styled.div({
  backgroundColor: '#FBBF24',
  color: '#1F2937',
  padding: '0.4rem 0.6rem',
  borderRadius: '4px',
  fontWeight: 700,
  fontSize: '0.9rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  marginLeft: '8px',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    left: '-8px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '0',
    height: '0',
    borderTop: '6px solid transparent',
    borderBottom: '6px solid transparent',
    borderRight: '8px solid #FBBF24',
  },
})

const SlotsContainer = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '1rem 1.5rem',
  overflow: 'hidden',
})

const SlotsWrapper = styled.div(({ isAnimating }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  transition: isAnimating ? 'transform 0.5s ease-out' : 'none',
}))

const SlotRow = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0',
})

const Connector = styled.div(({ isCurrent, isPassed }) => ({
  width: '30px',
  height: '3px',
  backgroundColor: isCurrent ? '#FFD700' : isPassed ? '#4A5568' : '#6B7280',
  opacity: isPassed ? 0.4 : 1,
  flexShrink: 0,
  borderRadius: '2px',
  boxShadow: isCurrent ? '0 0 8px rgba(255, 215, 0, 0.5)' : 'none',
}))

const SlotCard = styled.div(({ color, isPassed, isCurrent }) => {
  const colorMap = {
    cyan: { bg: '#00BCD4', border: '#00ACC1', shadow: 'rgba(0, 188, 212, 0.4)' },
    pink: { bg: '#E91E63', border: '#D81B60', shadow: 'rgba(233, 30, 99, 0.4)' },
    green: { bg: '#4CAF50', border: '#43A047', shadow: 'rgba(76, 175, 80, 0.4)' },
    blue: { bg: '#2196F3', border: '#1E88E5', shadow: 'rgba(33, 150, 243, 0.4)' },
    yellow: { bg: '#FFC107', border: '#FFB300', shadow: 'rgba(255, 193, 7, 0.4)' },
    red: { bg: '#F44336', border: '#E53935', shadow: 'rgba(244, 67, 54, 0.4)' },
    purple: { bg: '#9C27B0', border: '#8E24AA', shadow: 'rgba(156, 39, 176, 0.4)' },
    grey: { bg: '#607D8B', border: '#546E7A', shadow: 'rgba(96, 125, 139, 0.4)' },
  }
  const colors = colorMap[color] || colorMap.grey
  
  return {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: isCurrent ? '0.85rem 1.25rem' : '0.65rem 1rem',
    borderRadius: '12px',
    backgroundColor: colors.bg,
    border: isCurrent ? '3px solid #FFD700' : `2px solid ${colors.border}`,
    color: '#fff',
    fontWeight: 600,
    boxShadow: isCurrent 
      ? `0 0 20px rgba(255, 215, 0, 0.5), 0 6px 20px ${colors.shadow}` 
      : `0 4px 15px ${colors.shadow}`,
    transition: 'all 0.4s ease',
    opacity: isPassed ? 0.5 : 1,
    transform: isCurrent ? 'scale(1.02)' : 'scale(1)',
  }
})

const SlotIconWrapper = styled.div(({ isCurrent }) => ({
  width: isCurrent ? '36px' : '30px',
  height: isCurrent ? '36px' : '30px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.25)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: isCurrent ? '1.1rem' : '0.95rem',
  fontWeight: 700,
  flexShrink: 0,
  border: '2px solid rgba(255,255,255,0.3)',
}))

const SlotLabel = styled.span(({ isCurrent }) => ({
  fontSize: isCurrent ? '1.1rem' : '0.95rem',
  fontWeight: 600,
  letterSpacing: '0.5px',
}))

const ControlSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1rem',
  padding: '1rem',
  backgroundColor: 'rgba(0,0,0,0.25)',
  borderTop: '1px solid rgba(255,255,255,0.1)',
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
