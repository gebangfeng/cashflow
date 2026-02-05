import styled from '@emotion/styled'
import { useContext, useEffect } from 'react'
import { GameContext } from '@/utils'

const MarketDialog = () => {
  const { playerData, card, setActionType, setIsSellingAssets } = useContext(GameContext)

  const matchingAssets = playerData.assets.filter(
    (asset) => asset.type === card.type && asset.subtype === card.subtype
  )
  const hasAssets = matchingAssets.length > 0

  useEffect(() => {
    if (hasAssets) {
      setIsSellingAssets(true)
    }
  }, [playerData, hasAssets, setIsSellingAssets])

  const handlePass = () => {
    setIsSellingAssets(false)
    setActionType('start')
  }

  return (
    <Container>
      <Header>
        <HeaderIcon>📈</HeaderIcon>
        <Title>市场风云</Title>
      </Header>

      <EventCard>
        <EventTitle>{card.title}</EventTitle>
        <EventDesc>{card.description}</EventDesc>
        {card.info && <EventInfo>{card.info}</EventInfo>}
      </EventCard>

      {hasAssets ? (
        <InfoCard variant="success">
          <InfoIcon>✅</InfoIcon>
          <InfoContent>
            <InfoTitle>你有可出售的资产</InfoTitle>
            <InfoText>
              在报表页面的资产列表中点击「出售」按钮来完成交易
            </InfoText>
          </InfoContent>
        </InfoCard>
      ) : (
        <InfoCard variant="warning">
          <InfoIcon>ℹ️</InfoIcon>
          <InfoContent>
            <InfoTitle>没有匹配的资产</InfoTitle>
            <InfoText>
              你没有可以参与此市场机会的资产
            </InfoText>
          </InfoContent>
        </InfoCard>
      )}

      <ActionButton onClick={handlePass}>
        {hasAssets ? '跳过机会' : '继续游戏'}
      </ActionButton>
    </Container>
  )
}

export default MarketDialog

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
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

const EventCard = styled.div({
  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.15) 100%)',
  border: '1px solid rgba(245, 158, 11, 0.3)',
  borderRadius: '12px',
  padding: '16px',
})

const EventTitle = styled.div({
  color: '#fbbf24',
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '8px',
})

const EventDesc = styled.div({
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '14px',
  lineHeight: 1.5,
})

const EventInfo = styled.div({
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '13px',
  marginTop: '8px',
  fontStyle: 'italic',
})

const InfoCard = styled.div(({ variant }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '12px',
  background: variant === 'success' 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(251, 191, 36, 0.1)',
  border: `1px solid ${variant === 'success' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(251, 191, 36, 0.3)'}`,
  borderRadius: '12px',
  padding: '14px',
}))

const InfoIcon = styled.span({
  fontSize: '20px',
})

const InfoContent = styled.div({
  flex: 1,
})

const InfoTitle = styled.div({
  color: '#fff',
  fontSize: '14px',
  fontWeight: 600,
  marginBottom: '4px',
})

const InfoText = styled.div({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '13px',
  lineHeight: 1.4,
})

const ActionButton = styled.button({
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  color: '#fff',
  transition: 'all 0.2s ease',
  '&:active': {
    transform: 'scale(0.98)',
  },
})
//#endregion styled components
