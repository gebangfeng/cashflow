import styled from '@emotion/styled'
import { keyframes } from '@emotion/react'
import { useContext, useState, useRef, useEffect } from 'react'
import { GameContext, BOARD_SLOTS, rollDice, playSFX, drawCard } from '@/utils'

// Slot type configurations
const SLOT_CONFIG = {
  payday: { name: '发薪日', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)' },
  opportunity: { name: '机会', color: '#06b6d4', bgColor: 'rgba(6, 182, 212, 0.15)' },
  market: { name: '市场风云', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)' },
  doodads: { name: '额外支出', color: '#ec4899', bgColor: 'rgba(236, 72, 153, 0.15)' },
  baby: { name: '添丁', color: '#f472b6', bgColor: 'rgba(244, 114, 182, 0.15)' },
  downsized: { name: '失业', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)' },
  charity: { name: '慈善', color: '#8b5cf6', bgColor: 'rgba(139, 92, 246, 0.15)' },
}

const Board = () => {
  const { currentSlot, setCurrentSlot, setPrevSlot, setActionType, playerData, setPlayerData, setCard } = useContext(GameContext)
  const [isRolling, setIsRolling] = useState(false)
  const [diceValue, setDiceValue] = useState(1)
  const roadRef = useRef(null)

  // Calculate player position on road
  const playerProgress = (currentSlot / 24) * 100

  const handleRoll = () => {
    if (isRolling) return
    
    setIsRolling(true)
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
          setActionType(BOARD_SLOTS[newSlot].type)
        }, 600)
      }
    }, 80)
  }

  // Get nearby slots to display
  const getVisibleSlots = () => {
    const slots = []
    for (let i = -2; i <= 4; i++) {
      const idx = (currentSlot + i + 24) % 24
      slots.push({ ...BOARD_SLOTS[idx], offset: i })
    }
    return slots
  }

  const visibleSlots = getVisibleSlots()

  return (
    <BoardContainer>
      {/* Road and slots area */}
      <GameRoad ref={roadRef}>
        {/* Road path */}
        <RoadPath>
          {/* Road markings - center dashed line */}
          <RoadCenter />
          
          {/* Road text */}
          <RoadTextContainer>
            {'财务自由路'.split('').map((char, i) => (
              <RoadChar key={i}>{char}</RoadChar>
            ))}
          </RoadTextContainer>

          {/* Player character on road */}
          <PlayerOnRoad>
            <PlayerAvatar>
              <PlayerHead />
              <PlayerBody />
            </PlayerAvatar>
            <PlayerCash>钱</PlayerCash>
          </PlayerOnRoad>
        </RoadPath>

        {/* Slots on the side like trees */}
        <SlotsTrack>
          {visibleSlots.map((slot, index) => {
            const config = SLOT_CONFIG[slot.type] || SLOT_CONFIG.opportunity
            const isCurrent = slot.offset === 0
            const isPast = slot.offset < 0
            
            return (
              <SlotItem 
                key={`${slot.id}-${index}`}
                isCurrent={isCurrent}
                isPast={isPast}
                offset={slot.offset}
              >
                {/* Connection line to road */}
                <SlotConnector color={config.color} isCurrent={isCurrent} />
                
                {/* Slot card */}
                <SlotCard 
                  color={config.color}
                  bgColor={config.bgColor}
                  isCurrent={isCurrent}
                >
                  <SlotName>{config.name}</SlotName>
                  {isCurrent && <CurrentDot />}
                </SlotCard>
              </SlotItem>
            )
          })}
        </SlotsTrack>
      </GameRoad>

      {/* Dice and roll area */}
      <DiceSection>
        <DiceContainer>
          <DiceBox rolling={isRolling}>
            <DiceNumber>{diceValue}</DiceNumber>
          </DiceBox>
          <DiceBox rolling={isRolling} style={{ animationDelay: '0.05s' }}>
            <DiceNumber>{Math.max(1, Math.floor(diceValue / 2))}</DiceNumber>
          </DiceBox>
          <DiceBox rolling={isRolling} style={{ animationDelay: '0.1s' }}>
            <DiceNumber>{diceValue > 3 ? diceValue - 3 : 1}</DiceNumber>
          </DiceBox>
        </DiceContainer>

        <RollButton onClick={handleRoll} disabled={isRolling}>
          <RollButtonRing />
          <RollButtonInner>
            <FingerprintPattern>
              <circle cx="24" cy="24" r="20" />
              <circle cx="24" cy="24" r="15" />
              <circle cx="24" cy="24" r="10" />
              <circle cx="24" cy="24" r="5" />
            </FingerprintPattern>
          </RollButtonInner>
        </RollButton>

        <MusicButton>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </MusicButton>
      </DiceSection>
    </BoardContainer>
  )
}

export default Board

//#region styled components
const shake = keyframes`
  0%, 100% { transform: rotate(0deg) scale(1); }
  25% { transform: rotate(-8deg) scale(1.05); }
  75% { transform: rotate(8deg) scale(1.05); }
`

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(251, 191, 36, 0); }
`

const BoardContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: '16px',
  gap: '16px',
})

const GameRoad = styled.div({
  flex: 1,
  display: 'flex',
  position: 'relative',
  background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
  borderRadius: '20px',
  overflow: 'hidden',
  border: '1px solid rgba(255, 255, 255, 0.08)',
})

const RoadPath = styled.div({
  width: '120px',
  minWidth: '120px',
  background: 'linear-gradient(180deg, #475569 0%, #334155 100%)',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'inset -4px 0 20px rgba(0,0,0,0.3)',
})

const RoadCenter = styled.div({
  position: 'absolute',
  left: '50%',
  top: 0,
  bottom: 0,
  width: '4px',
  marginLeft: '-2px',
  background: `repeating-linear-gradient(
    to bottom,
    #fbbf24 0px,
    #fbbf24 20px,
    transparent 20px,
    transparent 40px
  )`,
})

const RoadTextContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '24px',
  zIndex: 2,
})

const RoadChar = styled.span({
  color: 'rgba(255, 255, 255, 0.2)',
  fontSize: '24px',
  fontWeight: 700,
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
})

const PlayerOnRoad = styled.div({
  position: 'absolute',
  bottom: '80px',
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  zIndex: 10,
})

const PlayerAvatar = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const PlayerHead = styled.div({
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #f5f5f5 0%, #e5e5e5 100%)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
})

const PlayerBody = styled.div({
  width: '40px',
  height: '28px',
  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
  borderRadius: '20px 20px 0 0',
  marginTop: '-8px',
  boxShadow: '0 4px 12px rgba(139, 92, 246, 0.4)',
})

const PlayerCash = styled.div({
  position: 'absolute',
  right: '-40px',
  top: '50%',
  transform: 'translateY(-50%)',
  background: '#fbbf24',
  color: '#1f2937',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 700,
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
})

const SlotsTrack = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: '20px 16px',
  gap: '8px',
})

const SlotItem = styled.div(({ isCurrent, isPast, offset }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  opacity: isCurrent ? 1 : isPast ? 0.4 : 0.7 - Math.abs(offset) * 0.08,
  transform: isCurrent ? 'scale(1)' : `scale(${0.95 - Math.abs(offset) * 0.02})`,
  transition: 'all 0.3s ease',
}))

const SlotConnector = styled.div(({ color, isCurrent }) => ({
  width: isCurrent ? '24px' : '16px',
  height: '3px',
  background: isCurrent 
    ? `linear-gradient(90deg, ${color} 0%, ${color}80 100%)`
    : 'rgba(255, 255, 255, 0.15)',
  borderRadius: '2px',
  transition: 'all 0.3s ease',
}))

const SlotCard = styled.div(({ color, bgColor, isCurrent }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: isCurrent ? '14px 16px' : '10px 14px',
  background: isCurrent ? bgColor : 'rgba(255, 255, 255, 0.03)',
  border: `2px solid ${isCurrent ? color : 'rgba(255, 255, 255, 0.08)'}`,
  borderRadius: '12px',
  transition: 'all 0.3s ease',
  boxShadow: isCurrent ? `0 4px 20px ${color}30` : 'none',
}))

const SlotName = styled.span({
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
})

const CurrentDot = styled.div({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  background: '#fbbf24',
  animation: `${pulse} 1.5s ease infinite`,
})

const DiceSection = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  padding: '12px 0',
})

const DiceContainer = styled.div({
  display: 'flex',
  gap: '8px',
})

const DiceBox = styled.div(({ rolling }) => ({
  width: '44px',
  height: '44px',
  background: 'linear-gradient(135deg, #1f2937 0%, #111827 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  animation: rolling ? `${shake} 0.12s infinite` : 'none',
}))

const DiceNumber = styled.span({
  color: '#fff',
  fontSize: '20px',
  fontWeight: 700,
})

const RollButton = styled.button(({ disabled }) => ({
  position: 'relative',
  width: '72px',
  height: '72px',
  background: 'none',
  border: 'none',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1,
  '&:active': {
    transform: disabled ? 'none' : 'scale(0.95)',
  },
}))

const RollButtonRing = styled.div({
  position: 'absolute',
  inset: 0,
  borderRadius: '50%',
  border: '2px solid rgba(255, 255, 255, 0.2)',
  background: 'transparent',
})

const RollButtonInner = styled.div({
  position: 'absolute',
  inset: '4px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #1f2937 0%, #0f172a 100%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 20px rgba(0,0,0,0.5), inset 0 -2px 10px rgba(255,255,255,0.05)',
})

const FingerprintPattern = styled.svg({
  width: '48px',
  height: '48px',
  '& circle': {
    fill: 'none',
    stroke: 'rgba(255, 255, 255, 0.3)',
    strokeWidth: '1.5',
  },
})

const MusicButton = styled.button({
  width: '40px',
  height: '40px',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'rgba(255, 255, 255, 0.6)',
  '& svg': {
    width: '20px',
    height: '20px',
  },
  '&:active': {
    background: 'rgba(255, 255, 255, 0.12)',
  },
})
//#endregion styled components
