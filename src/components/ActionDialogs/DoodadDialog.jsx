import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { colors } from '@/styles'
import { useContext } from 'react'
import { GameContext, getLoanAmount, takeLoan } from '@/utils'

const DoodadDialog = () => {
  const { card, playerData, setPlayerData, setActionType } =
    useContext(GameContext)
  const doodads = card
  /**
   * > Handle Doodads logic
   */
  const handleDoodads = () => {
    if (playerData.cash < doodads.cost) {
      let newPlayerData = takeLoan(playerData, doodads.cost)
      setPlayerData(newPlayerData)
    } else {
      setPlayerData((data) => ({ ...data, cash: data.cash - doodads.cost }))
    }
    setActionType('start')
  }

  return (
    <>
      <Header>
        <Title>{doodads.title}</Title>
        <ThumbnailImg src="./assets/images/doodads-thumb.png" alt="doodads" />
      </Header>
      <Description>{doodads.description}</Description>
      {doodads.info && <Note>{doodads.info}</Note>}
      {playerData.cash < doodads.cost && (
        <WarningNote>
          (你没有足够的现金。你需要贷款 ${getLoanAmount(doodads.cost - playerData.cash)} 来支付。)
        </WarningNote>
      )}
      <Note style={{ flex: 1 }} />
      <MainActions>
        <ActionButton variant="contained" disableRipple onClick={handleDoodads}>
          支付
        </ActionButton>
      </MainActions>
    </>
  )
}

export default DoodadDialog

//#region styled components
const Header = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  width: '100%',
  marginBottom: '0.75rem',
})

const ThumbnailImg = styled.img({
  width: '64px',
  borderRadius: '8px',
})

const Title = styled.h2({
  color: colors.pink.base,
  margin: 0,
  fontSize: '1.375rem',
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
  color: colors.grey.light,
  fontSize: '0.875rem',
})

const WarningNote = styled.span({
  fontWeight: 500,
  alignSelf: 'flex-start',
  color: colors.red.base,
  fontSize: '0.875rem',
  marginTop: '0.5rem',
})

const MainActions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  width: '100%',
  marginTop: '1rem',
})

const ActionButton = styled(Button)({
  fontWeight: 700,
  padding: '0.75rem 2rem',
  borderRadius: '8px',
  backgroundColor: colors.pink.base,
  color: colors.white,
  textTransform: 'none',
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: colors.pink.dark,
  },
  '&:active': {
    opacity: 0.8,
    transform: 'scale(0.95)',
  },
})

//#endregion styled components
