import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { colors } from '@/styles'
import { useContext, useEffect } from 'react'
import {
  GameContext,
  currencyFormatter,
  getTotalExpenseAmount,
  getLoanAmount,
  playSFX,
  takeLoan,
} from '@/utils'

const DownsizedDialog = () => {
  const { playerData, setPlayerData, setActionType } = useContext(GameContext)

  const handleDownsized = () => {
    let newPlayerData = playerData
    let totalExpenses = getTotalExpenseAmount(newPlayerData)
    if (newPlayerData.cash < totalExpenses) {
      newPlayerData = takeLoan(newPlayerData, totalExpenses)
    } else {
      newPlayerData.cash -= totalExpenses
    }
    newPlayerData.diceNum = 1
    newPlayerData.charityTurnLeft = 0
    setPlayerData(newPlayerData)
    setActionType('start')
  }

  useEffect(() => {
    setTimeout(() => {
      playSFX('/assets/sounds/downsized.mp3')
    }, 600)
  }, [])

  return (
    <>
      <Header>
        <Title>被裁员了！</Title>
        <ThumbnailImg src="./assets/images/downsized-thumb.png" />
      </Header>
      <Description>支付你全部的月支出和慈善捐款（如有）</Description>
      <Note>
        支付 ${currencyFormatter.format(getTotalExpenseAmount(playerData))}
      </Note>
      {playerData.cash - getTotalExpenseAmount(playerData) < 0 && (
        <Note
          style={{ color: colors.red.base }}
        >{`（你没有足够的现金。需要贷款 $${getLoanAmount(
          getTotalExpenseAmount(playerData) - playerData.cash
        )} 来支付）`}</Note>
      )}
      <Note style={{ flex: 1 }} />
      <MainActions>
        <ActionButton
          variant="contained"
          disableRipple
          onClick={handleDownsized}
        >
          支付
        </ActionButton>
      </MainActions>
    </>
  )
}

export default DownsizedDialog

//#region styled components
const Header = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  width: '100%',
})

const ThumbnailImg = styled.img({
  width: '80px',
})

const Title = styled.h2({
  color: colors.red.base,
  margin: 0,
})

const Description = styled.span({
  fontWeight: 500,
  alignSelf: 'flex-start',
})

const Note = styled.span({
  fontWeight: 700,
  alignSelf: 'flex-start',
})

const MainActions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  columnGap: '1rem',
  width: '100%',
  '& button': {
    fontSize: '20px',
  },
  '& img': {
    width: '36px',
  },
})

const ActionButton = styled(Button)({
  fontWeight: 800,
  width: '120px',
  '&:active': {
    opacity: 0.8,
    transform: 'scale(0.9)',
  },
})

//#endregion styled components
