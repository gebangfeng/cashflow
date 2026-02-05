import styled from '@emotion/styled'
import { useContext } from 'react'
import { GameContext, rollDice, playSFX, BOARD_SLOTS, drawCard } from '@/utils'

const StartDialog = () => {
  const {
    playerData,
    setPlayerData,
    currentSlot,
    setActionType,
    setCurrentSlot,
    setPrevSlot,
    setCard,
  } = useContext(GameContext)

  const handleRoll = () => {
    let move = rollDice(playerData.diceNum)
    let slotId = (currentSlot + move) % 23
    let card = drawCard(BOARD_SLOTS[slotId].type)

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

    setPrevSlot(currentSlot)
    setCurrentSlot((slot) => (slot + move) % 23)
    setActionType(BOARD_SLOTS[slotId].type)
    setCard(card)
    playSFX('/assets/sounds/roll.mp3')
  }

  return (
    <Container>
      <Header>
        <Title>轮到你了</Title>
        <TurnBadge>回合开始</TurnBadge>
      </Header>
      
      <Description>
        准备好后，点击下方掷骰按钮开始你的回合
      </Description>
      
      <TipCard>
        <TipIcon>💡</TipIcon>
        <TipText>
          开始前请查看你的财务报表，你也可以在此时还款或贷款
        </TipText>
      </TipCard>

      <ButtonGroup>
        <ActionButton 
          variant="secondary"
          onClick={() => setActionType('borrow')}
        >
          <ButtonIcon>🏦</ButtonIcon>
          <span>贷款</span>
        </ActionButton>
        <ActionButton 
          variant="secondary"
          onClick={() => setActionType('repay')}
        >
          <ButtonIcon>💳</ButtonIcon>
          <span>还款</span>
        </ActionButton>
      </ButtonGroup>

      <Spacer />

      <RollButton onClick={handleRoll}>
        <RollIcon>🎲</RollIcon>
        <span>掷骰子</span>
      </RollButton>
    </Container>
  )
}

export default StartDialog

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  height: '100%',
})

const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
})

const Title = styled.h2({
  color: '#fff',
  fontSize: '20px',
  fontWeight: 600,
  margin: 0,
})

const TurnBadge = styled.span({
  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  color: '#fff',
  padding: '4px 12px',
  borderRadius: '12px',
  fontSize: '12px',
  fontWeight: 500,
})

const Description = styled.p({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '14px',
  margin: 0,
  lineHeight: 1.5,
})

const TipCard = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  background: 'rgba(251, 191, 36, 0.1)',
  border: '1px solid rgba(251, 191, 36, 0.3)',
  borderRadius: '12px',
  padding: '12px',
})

const TipIcon = styled.span({
  fontSize: '18px',
})

const TipText = styled.span({
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '13px',
  lineHeight: 1.5,
})

const ButtonGroup = styled.div({
  display: 'flex',
  gap: '12px',
})

const ActionButton = styled.button(({ variant }) => ({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  padding: '12px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: 500,
  transition: 'all 0.2s ease',
  background: variant === 'secondary' 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#fff',
  '&:active': {
    transform: 'scale(0.98)',
  },
}))

const ButtonIcon = styled.span({
  fontSize: '18px',
})

const Spacer = styled.div({
  flex: 1,
})

const RollButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  padding: '14px 24px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#fff',
  boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)',
  transition: 'all 0.2s ease',
  '&:active': {
    transform: 'scale(0.98)',
  },
})

const RollIcon = styled.span({
  fontSize: '24px',
})
//#endregion styled components
