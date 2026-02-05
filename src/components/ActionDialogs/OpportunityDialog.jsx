import styled from '@emotion/styled'
import { Button } from '@mui/material'
import { colors } from '@/styles'
import { useContext } from 'react'
import { GameContext, drawCard } from '@/utils'

const OpportunityDialog = () => {
  const { setCard, setActionType } = useContext(GameContext)

  const handleSmallDeal = () => {
    let card = drawCard('opportunity', false)
    updateAction(card.type)
    setCard(card)
  }

  const handleBigDeal = () => {
    let card = drawCard('opportunity', true)
    setCard(card)
    updateAction(card.type)
    setCard(card)
  }

  const updateAction = (cardType) => {
    switch (cardType) {
      case 'stock':
        setActionType('opportunity-stock')
        break
      case 'stock-split':
        setActionType('opportunity-stock-split')
        break
      case 'estate':
      case 'gold':
      case 'land':
        setActionType('opportunity-estate')
        break
      case 'estate-auto':
        setActionType('opportunity-estate-auto')
        break
      default:
        setActionType('start')
        break
    }
  }

  return (
    <>
      <Header>
        <Title>投资机会</Title>
        <ThumbnailImg src="./assets/images/opportunity-thumb.png" alt="opportunity" />
      </Header>
      <Description>你想要哪种交易类型？</Description>
      <Note>
        小交易成本在$5,000以下，大交易成本在$6,000以上。
      </Note>
      <Note style={{ flex: 1 }} />
      <MainActions>
        <ActionButton
          variant="contained"
          disableRipple
          onClick={handleSmallDeal}
        >
          小交易
        </ActionButton>
        <ActionButton
          variant="contained"
          disableRipple
          onClick={handleBigDeal}
          big
        >
          大交易
        </ActionButton>
      </MainActions>
    </>
  )
}

export default OpportunityDialog

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
  color: colors.teal.base,
  margin: 0,
  fontSize: '1.5rem',
  fontWeight: 700,
})

const Description = styled.span({
  fontWeight: 500,
  width: '100%',
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

const MainActions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  columnGap: '1rem',
  width: '100%',
  marginTop: '1rem',
})

const ActionButton = styled(Button)(({ big }) => ({
  fontWeight: 700,
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  backgroundColor: big ? colors.pink.base : colors.teal.base,
  color: colors.white,
  textTransform: 'none',
  fontSize: '1rem',
  minWidth: '100px',
  '&:hover': {
    backgroundColor: big ? colors.pink.dark : colors.teal.dark,
  },
  '&:active': {
    opacity: 0.8,
    transform: 'scale(0.95)',
  },
}))
//#endregion styled components
