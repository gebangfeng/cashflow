import styled from '@emotion/styled'
import { useContext } from 'react'
import { GameContext, getLoanAmount, takeLoan, currencyFormatter } from '@/utils'

const DoodadDialog = () => {
  const { card, playerData, setPlayerData, setActionType } = useContext(GameContext)
  const doodads = card

  const handleDoodads = () => {
    if (playerData.cash < doodads.cost) {
      let newPlayerData = takeLoan(playerData, doodads.cost)
      setPlayerData(newPlayerData)
    } else {
      setPlayerData((data) => ({ ...data, cash: data.cash - doodads.cost }))
    }
    setActionType('start')
  }

  const needsLoan = playerData.cash < doodads.cost
  const loanAmount = needsLoan ? getLoanAmount(doodads.cost - playerData.cash) : 0

  return (
    <Container>
      <Header>
        <HeaderIcon>🛒</HeaderIcon>
        <Title>额外支出</Title>
      </Header>

      <EventCard>
        <EventTitle>{doodads.title}</EventTitle>
        <EventDesc>{doodads.description}</EventDesc>
        {doodads.info && <EventInfo>{doodads.info}</EventInfo>}
      </EventCard>

      <CostSection>
        <CostLabel>需支付</CostLabel>
        <CostValue>¥{currencyFormatter.format(doodads.cost)}</CostValue>
      </CostSection>

      {needsLoan && (
        <WarningCard>
          <WarningIcon>⚠️</WarningIcon>
          <WarningText>
            现金不足，需贷款 ¥{currencyFormatter.format(loanAmount)} 来支付此费用
          </WarningText>
        </WarningCard>
      )}

      <Spacer />

      <ActionButton onClick={handleDoodads}>
        {needsLoan ? '贷款并支付' : '确认支付'}
      </ActionButton>
    </Container>
  )
}

export default DoodadDialog

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

const EventCard = styled.div({
  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.15) 100%)',
  border: '1px solid rgba(236, 72, 153, 0.3)',
  borderRadius: '12px',
  padding: '16px',
})

const EventTitle = styled.div({
  color: '#f472b6',
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

const CostSection = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  padding: '16px',
})

const CostLabel = styled.span({
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '14px',
})

const CostValue = styled.span({
  color: '#ef4444',
  fontSize: '24px',
  fontWeight: 700,
})

const WarningCard = styled.div({
  display: 'flex',
  alignItems: 'flex-start',
  gap: '10px',
  background: 'rgba(239, 68, 68, 0.1)',
  border: '1px solid rgba(239, 68, 68, 0.3)',
  borderRadius: '12px',
  padding: '12px',
})

const WarningIcon = styled.span({
  fontSize: '18px',
})

const WarningText = styled.span({
  color: '#fca5a5',
  fontSize: '13px',
  lineHeight: 1.5,
})

const Spacer = styled.div({
  flex: 1,
})

const ActionButton = styled.button({
  width: '100%',
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '16px',
  fontWeight: 600,
  background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
  color: '#fff',
  transition: 'all 0.2s ease',
  '&:active': {
    transform: 'scale(0.98)',
  },
})
//#endregion styled components
