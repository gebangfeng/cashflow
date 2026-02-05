import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { colors, breakpoints } from '@/styles'
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
    <DialogContainer>
      <Header>
        <TurnBadge>Your Turn</TurnBadge>
        <Title>Ready to Roll?</Title>
      </Header>
      <Description>
        Review your financial statement before rolling. You can also manage your finances first.
      </Description>
      <SubActions>
        <SecondaryButton
          variant="outlined"
          startIcon={<img src="/assets/images/bank.png" alt="Borrow" />}
          disableRipple
          onClick={() => setActionType('borrow')}
        >
          Borrow
        </SecondaryButton>
        <SecondaryButton
          variant="outlined"
          startIcon={<img src="/assets/images/repay.png" alt="Repay" />}
          disableRipple
          onClick={() => setActionType('repay')}
        >
          Repay
        </SecondaryButton>
      </SubActions>
      <Spacer />
      <MainActions>
        <PrimaryButton
          variant="contained"
          startIcon={<img src="/assets/images/dice.png" alt="Roll dice" />}
          disableRipple
          onClick={handleRoll}
        >
          Roll Dice
        </PrimaryButton>
      </MainActions>
    </DialogContainer>
  )
}

export default StartDialog

//#region styled components
const DialogContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  gap: '0.75rem',
})

const Header = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
})

const TurnBadge = styled.span({
  display: 'inline-block',
  width: 'fit-content',
  padding: '0.25rem 0.5rem',
  fontSize: '0.625rem',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: colors.primary[700],
  backgroundColor: colors.primary[100],
  borderRadius: '0.25rem',
})

const Title = styled.h2({
  color: colors.neutral[900],
  fontSize: '1.25rem',
  fontWeight: 700,
  margin: 0,
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: '1.5rem',
  },
})

const Description = styled.p({
  fontSize: '0.8125rem',
  color: colors.neutral[600],
  margin: 0,
  lineHeight: 1.5,
})

const SubActions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  gap: '0.75rem',
  marginTop: '0.5rem',
  flexWrap: 'wrap',
})

const SecondaryButton = styled(Button)({
  fontWeight: 600,
  fontSize: '0.8125rem',
  padding: '0.5rem 1rem',
  borderColor: colors.neutral[300],
  color: colors.neutral[700],
  borderRadius: '0.5rem',
  textTransform: 'none',
  '&:hover': {
    borderColor: colors.neutral[400],
    backgroundColor: colors.neutral[50],
  },
  '& img': {
    width: '18px',
    height: '18px',
  },
})

const Spacer = styled.div({
  flex: 1,
})

const MainActions = styled.div({
  display: 'flex',
  justifyContent: 'flex-start',
})

const PrimaryButton = styled(Button)({
  fontWeight: 700,
  fontSize: '0.9375rem',
  padding: '0.75rem 1.5rem',
  backgroundColor: colors.neutral[900],
  color: colors.white,
  borderRadius: '0.5rem',
  textTransform: 'none',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  '&:hover': {
    backgroundColor: colors.neutral[800],
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
  '& img': {
    width: '24px',
    height: '24px',
  },
})
//#endregion styled components
