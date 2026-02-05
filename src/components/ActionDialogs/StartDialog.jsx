import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { colors } from '@/styles'
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

  /**
   * > Handle the logic of rolling dice
   * * 1. If player is under the effect of charity (can roll multiple dice):
   * *  - Reduce the number of charityTurn to 1
   * *  - If remaining number of charityTurnLeft is 1, reset the number of dice to 1
   * * 2. Set the prevSlot to the current slotId
   * * 3. Set the currentSlot to the next slotId the player will land on
   * * 4. Set the action type to the type of target slot
   * * 5. Draw a random card and store it in game data context
   */
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
    <>
      <Header>
        <Title>轮到你了</Title>
      </Header>
      <Description>
        准备好后，掷骰子开始你的回合
      </Description>
      <Note>
        开始之前，先查看你的财务报表。你也可以在此时还贷或借款。
      </Note>
      <SubActions>
        <ActionButton
          variant="contained"
          startIcon={<img src="/assets/images/bank.png" alt="borrow" />}
          disableRipple
          onClick={() => {
            setActionType('borrow')
          }}
        >
          借款
        </ActionButton>
        <ActionButton
          variant="contained"
          startIcon={<img src="/assets/images/repay.png" alt="repay" />}
          disableRipple
          onClick={() => {
            setActionType('repay')
          }}
        >
          还款
        </ActionButton>
      </SubActions>
      <Note style={{ flex: 1 }} />
      <MainActions>
        <RollButton
          variant="contained"
          startIcon={<img src="/assets/images/dice.png" alt="dice" />}
          disableRipple
          onClick={handleRoll}
        >
          掷骰子
        </RollButton>
      </MainActions>
    </>
  )
}

export default StartDialog

//#region styled components
const Header = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '0.75rem',
})

const Title = styled.h2({
  color: colors.teal.base,
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 700,
})

const Description = styled.span({
  fontWeight: 500,
  alignSelf: 'flex-start',
  color: colors.white,
  marginBottom: '0.5rem',
})

const Note = styled.span({
  fontWeight: 400,
  alignSelf: 'flex-start',
  flex: 1,
  color: colors.grey.light,
  fontSize: '0.875rem',
  marginBottom: '1rem',
})

const MainActions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  columnGap: '1rem',
  width: '100%',
  marginTop: '0.5rem',
})

const SubActions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  columnGap: '1rem',
  margin: '1rem 0',
  width: '100%',
})

const ActionButton = styled(Button)({
  fontWeight: 700,
  padding: '0.625rem 1.25rem',
  borderRadius: '8px',
  backgroundColor: colors.orange.base,
  color: colors.white,
  textTransform: 'none',
  fontSize: '0.9rem',
  '&:hover': {
    backgroundColor: colors.orange.dark,
  },
  '&:active': {
    opacity: 0.8,
    transform: 'scale(0.95)',
  },
  '& img': {
    width: '20px',
    height: '20px',
  },
})

const RollButton = styled(Button)({
  fontWeight: 700,
  padding: '0.75rem 2rem',
  borderRadius: '8px',
  backgroundColor: colors.teal.base,
  color: colors.white,
  textTransform: 'none',
  fontSize: '1.125rem',
  '&:hover': {
    backgroundColor: colors.teal.dark,
  },
  '&:active': {
    opacity: 0.8,
    transform: 'scale(0.95)',
  },
  '& img': {
    width: '28px',
    height: '28px',
  },
})

//#endregion styled components
