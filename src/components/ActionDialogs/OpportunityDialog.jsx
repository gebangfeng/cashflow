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
      <Header>
        <HeaderIcon>🎯</HeaderIcon>
        <Title>投资机会</Title>
      </Header>
      
      <Description>
        选择你想要的交易类型
      </Description>

      <DealOptions>
        <DealCard onClick={handleSmallDeal}>
          <DealIcon>💼</DealIcon>
          <DealInfo>
            <DealTitle>小型投资</DealTitle>
            <DealDesc>投资额 ¥5,000 以下</DealDesc>
          </DealInfo>
          <DealArrow>→</DealArrow>
        </DealCard>

        <DealCard onClick={handleBigDeal} variant="big">
          <DealIcon>🏢</DealIcon>
          <DealInfo>
            <DealTitle>大型投资</DealTitle>
            <DealDesc>投资额 ¥6,000 以上</DealDesc>
          </DealInfo>
          <DealArrow>→</DealArrow>
        </DealCard>
      </DealOptions>

      <TipCard>
        <TipIcon>💡</TipIcon>
        <TipText>
          小型投资风险较低但收益有限，大型投资可能带来更高回报
        </TipText>
      </TipCard>
    </Container>
  )
}

export default OpportunityDialog

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  height: '100%',
})

const Header = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

const HeaderIcon = styled.span({
  fontSize: '28px',
})

const Title = styled.h2({
  color: '#fff',
  fontSize: '20px',
  fontWeight: 600,
  margin: 0,
})

const Description = styled.p({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '14px',
  margin: 0,
})

const DealOptions = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
})

const DealCard = styled.button(({ variant }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '16px',
  borderRadius: '12px',
  border: `1px solid ${variant === 'big' ? 'rgba(139, 92, 246, 0.3)' : 'rgba(6, 182, 212, 0.3)'}`,
  background: variant === 'big' 
    ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)'
    : 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.15) 100%)',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.2s ease',
  '&:active': {
    transform: 'scale(0.98)',
  },
}))

const DealIcon = styled.span({
  fontSize: '32px',
})

const DealInfo = styled.div({
  flex: 1,
})

const DealTitle = styled.div({
  color: '#fff',
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '4px',
})

const DealDesc = styled.div({
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '13px',
})

const DealArrow = styled.span({
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '20px',
})

const TipCard = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  background: 'rgba(251, 191, 36, 0.1)',
  border: '1px solid rgba(251, 191, 36, 0.3)',
  borderRadius: '12px',
  padding: '12px',
  marginTop: 'auto',
})

const TipIcon = styled.span({
  fontSize: '18px',
})

const TipText = styled.span({
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '13px',
  lineHeight: 1.5,
})
//#endregion styled components
