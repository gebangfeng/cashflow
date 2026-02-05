import styled from '@emotion/styled'
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
    <Container>
      <Title>选择投资类型</Title>

      <DealOptions>
        <DealCard onClick={handleSmallDeal}>
          <DealTitle>小型投资</DealTitle>
          <DealDesc>¥5,000 以下</DealDesc>
        </DealCard>

        <DealCard onClick={handleBigDeal} variant="big">
          <DealTitle>大型投资</DealTitle>
          <DealDesc>¥6,000 以上</DealDesc>
        </DealCard>
      </DealOptions>
    </Container>
  )
}

export default OpportunityDialog

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

const Title = styled.h2({
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  margin: 0,
  textAlign: 'center',
})

const DealOptions = styled.div({
  display: 'flex',
  gap: '10px',
})

const DealCard = styled.button(({ variant }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '16px 12px',
  borderRadius: '10px',
  border: `1px solid ${variant === 'big' ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.4)'}`,
  background: variant === 'big' 
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.2) 100%)'
    : 'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(8, 145, 178, 0.2) 100%)',
  cursor: 'pointer',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  '&:active': {
    transform: 'scale(0.96)',
  },
}))

const DealTitle = styled.div({
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  marginBottom: '4px',
})

const DealDesc = styled.div({
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '12px',
})
//#endregion styled components
