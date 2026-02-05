import { colors } from '@/styles'
import { GameContext, currencyFormatter, playSFX } from '@/utils'
import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { useContext, useEffect } from 'react'

const BabyDialog = () => {
  const { playerData, setPlayerData, setActionType } = useContext(GameContext)
  const childNum = playerData.childNum

  useEffect(() => {
    if (playerData.childNum < 3) {
      setTimeout(() => {
        playSFX('/assets/sounds/baby.mp3')
      }, 600)
    }
  }, [])

  const handleBaby = () => {
    const newPlayerData = playerData
    if (childNum === 0) {
      newPlayerData.childNum += 1
      newPlayerData.expenses.push({
        id: newPlayerData.expenses.length + 1,
        name: `子女抚养费 (${newPlayerData.childNum})`,
        amount: newPlayerData.childNum * newPlayerData.expensePerChild,
      })
    } else if (childNum < 3) {
      let idx = newPlayerData.expenses.findIndex(
        (e) => e.name === `子女抚养费 (${playerData.childNum})`
      )
      newPlayerData.childNum += 1
      newPlayerData.expenses[
        idx
      ].name = `子女抚养费 (${newPlayerData.childNum})`
      newPlayerData.expenses[idx].amount =
        newPlayerData.childNum * newPlayerData.expensePerChild
    }
    setPlayerData({ ...newPlayerData })
    setActionType('start')
  }

  return (
    <>
      <Header>
        <Title>
          {playerData.childNum < 3 ? '喜得贵子！' : '已达到孩子数量上限！'}
        </Title>
        <ThumbnailImg src="./assets/images/baby-thumb.png" />
      </Header>
      <Description>
        {playerData.childNum < 3
          ? '恭喜！你的家庭新添了一个孩子'
          : '每位玩家最多只能有3个孩子'}
      </Description>
      {childNum < 3 && (
        <Note style={{ color: colors.red.base }}>
          子女抚养费将增加 $
          {currencyFormatter.format(playerData.expensePerChild)}
        </Note>
      )}
      <Note style={{ flex: 1 }} />
      <MainActions>
        <ActionButton variant="contained" disableRipple onClick={handleBaby}>
          确定
        </ActionButton>
      </MainActions>
    </>
  )
}

export default BabyDialog

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
  flex: 1,
})

const MainActions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
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
