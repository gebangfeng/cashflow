import styled from '@emotion/styled'
import { colors } from '@/styles'
import { useContext, useState } from 'react'
import { GameContext, rollDice, playSFX } from '@/utils'

const Board = () => {
  const { currentSlot, setCurrentSlot, setPrevSlot, setActionType, playerData } = useContext(GameContext)
  const [diceValues, setDiceValues] = useState([0, 0, 0])
  const [isRolling, setIsRolling] = useState(false)

  const handleRoll = () => {
    if (isRolling) return
    
    setIsRolling(true)
    playSFX('/assets/sounds/roll.mp3')
    
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
        
        // Set action based on slot type
        setTimeout(() => {
          const slotTypes = ['payday', 'opportunity', 'market', 'opportunity', 'doodads', 'opportunity', 
                           'baby', 'opportunity', 'payday', 'opportunity', 'market', 'opportunity',
                           'doodads', 'opportunity', 'downsized', 'opportunity', 'payday', 'opportunity',
                           'market', 'opportunity', 'doodads', 'opportunity', 'charity', 'opportunity']
          setActionType(slotTypes[newSlot])
        }, 500)
      }
    }, 100)
  }

  return (
    <BoardContainer>
      {/* Road with vertical text */}
      <RoadSection>
        <RoadBackground>
          {/* Left lane markings */}
          <LaneMarking style={{ left: '25%' }} />
          {/* Right lane markings */}
          <LaneMarking style={{ left: '75%' }} />
          
          {/* Vertical road text */}
          <RoadText>
            <RoadChar>财</RoadChar>
            <RoadChar>务</RoadChar>
            <RoadChar>自</RoadChar>
            <RoadChar>由</RoadChar>
            <RoadChar>路</RoadChar>
          </RoadText>

          {/* Event cards on road */}
          <EventCard color="cyan" style={{ top: '5%', right: '-60%' }}>
            <EventIcon>?</EventIcon>
            <EventLabel>机会</EventLabel>
          </EventCard>

          <EventCard color="pink" style={{ top: '25%', right: '-60%' }}>
            <EventIcon>🎵</EventIcon>
            <EventLabel>生活小插曲</EventLabel>
          </EventCard>

          <EventCard color="cyan" style={{ top: '50%', right: '-60%' }}>
            <EventIcon>?</EventIcon>
            <EventLabel>机会</EventLabel>
          </EventCard>

          {/* Player character */}
          <PlayerCharacter style={{ top: '60%' }}>
            <CharacterBody>
              <CharacterHead />
              <CharacterTorso />
            </CharacterBody>
          </PlayerCharacter>

          {/* Money sign */}
          <MoneySign style={{ top: '58%', right: '-40%' }}>
            钱
          </MoneySign>
        </RoadBackground>
      </RoadSection>

      {/* Dice Section */}
      <DiceSection>
        <DiceContainer>
          {diceValues.map((value, index) => (
            <Dice key={index} rolling={isRolling}>
              {value}
            </Dice>
          ))}
        </DiceContainer>
        
        {/* Roll Button */}
        <RollButton onClick={handleRoll} disabled={isRolling}>
          <FingerprintIcon />
        </RollButton>
      </DiceSection>

      {/* Music toggle */}
      <MusicToggle>
        <MusicIcon>🎵</MusicIcon>
      </MusicToggle>
    </BoardContainer>
  )
}

export default Board

//#region styled components
const BoardContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  height: '100%',
  position: 'relative',
})

const RoadSection = styled.div({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  position: 'relative',
})

const RoadBackground = styled.div({
  width: '120px',
  height: '450px',
  backgroundColor: colors.midnight.base,
  borderRadius: '60px',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
})

const LaneMarking = styled.div({
  position: 'absolute',
  top: '10%',
  bottom: '10%',
  width: '4px',
  background: `repeating-linear-gradient(
    to bottom,
    ${colors.yellow.dark} 0px,
    ${colors.yellow.dark} 30px,
    transparent 30px,
    transparent 50px
  )`,
})

const RoadText = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1.5rem',
  zIndex: 1,
})

const RoadChar = styled.span({
  color: colors.blilet.light,
  fontSize: '2rem',
  fontWeight: 700,
  textShadow: '0 2px 4px rgba(0,0,0,0.3)',
})

const EventCard = styled.div(({ color }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.625rem 1.25rem',
  borderRadius: '8px',
  backgroundColor: color === 'cyan' ? colors.teal.base : colors.pink.base,
  color: colors.white,
  fontWeight: 600,
  fontSize: '0.9rem',
  boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  whiteSpace: 'nowrap',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}))

const EventIcon = styled.span({
  width: '20px',
  height: '20px',
  borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '0.75rem',
})

const EventLabel = styled.span({
  fontSize: '0.9rem',
})

const PlayerCharacter = styled.div({
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 2,
})

const CharacterBody = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
})

const CharacterHead = styled.div({
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: colors.purple.dark,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    bottom: '-5px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '30px',
    height: '20px',
    backgroundColor: colors.white,
    borderRadius: '50%',
  },
})

const CharacterTorso = styled.div({
  width: '50px',
  height: '35px',
  backgroundColor: colors.purple.base,
  borderRadius: '25px 25px 0 0',
  marginTop: '-10px',
})

const MoneySign = styled.div({
  position: 'absolute',
  backgroundColor: colors.yellow.base,
  color: colors.black.base,
  padding: '0.375rem 0.75rem',
  borderRadius: '4px',
  fontWeight: 700,
  fontSize: '0.9rem',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
})

const DiceSection = styled.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  paddingBottom: '1rem',
})

const DiceContainer = styled.div({
  display: 'flex',
  gap: '0.5rem',
})

const Dice = styled.div(({ rolling }) => ({
  width: '60px',
  height: '70px',
  backgroundColor: colors.black.base,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  fontWeight: 700,
  color: colors.white,
  border: `2px solid ${colors.black.lighter}`,
  animation: rolling ? 'shake 0.1s infinite' : 'none',
  '@keyframes shake': {
    '0%, 100%': { transform: 'rotate(-2deg)' },
    '50%': { transform: 'rotate(2deg)' },
  },
}))

const RollButton = styled.button({
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: colors.black.base,
  border: `3px solid ${colors.grey.dark}`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: colors.black.light,
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '&:disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
})

const FingerprintIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={colors.grey.light} strokeWidth="2">
    <path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4" />
    <path d="M5 19.5C5.5 18 6 15 6 12c0-.7.12-1.37.34-2" />
    <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
    <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
    <path d="M8.65 22c.21-.66.45-1.32.57-2" />
    <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
    <path d="M2 16h.01" />
    <path d="M21.8 16c.2-2 .131-5.354 0-6" />
    <path d="M9 6.8a6 6 0 0 1 9 5.2c0 .47 0 1.17-.02 2" />
  </svg>
)

const MusicToggle = styled.button({
  position: 'absolute',
  bottom: '20px',
  right: '20px',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: colors.teal.base,
  border: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.1)',
  },
})

const MusicIcon = styled.span({
  fontSize: '1.25rem',
})
//#endregion styled components
