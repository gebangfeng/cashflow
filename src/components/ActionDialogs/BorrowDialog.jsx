import styled from '@emotion/styled'
import { useContext, useState } from 'react'
import { GameContext } from '@/utils'

const BorrowDialog = () => {
  const { setActionType } = useContext(GameContext)
  const [amount, setAmount] = useState(1000)

  const handleBorrow = (e) => {
    e.preventDefault()
    alert('贷款功能暂未实现')
    setActionType('start')
  }

  const adjustAmount = (delta) => {
    setAmount(prev => Math.max(1000, prev + delta))
  }

  return (
    <Container>
      <Header>
        <HeaderIcon>🏦</HeaderIcon>
        <Title>银行贷款</Title>
      </Header>
      
      <Description>
        贷款金额必须是 ¥1,000 的整数倍，月利率 10%
      </Description>

      <AmountSection>
        <AmountLabel>贷款金额</AmountLabel>
        <AmountInputGroup>
          <AdjustButton onClick={() => adjustAmount(-1000)}>-</AdjustButton>
          <AmountInput
            type="number"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseInt(e.target.value) || 0))}
          />
          <AdjustButton onClick={() => adjustAmount(1000)}>+</AdjustButton>
        </AmountInputGroup>
        <AmountHint>月还款: ¥{(amount * 0.1).toLocaleString()}</AmountHint>
      </AmountSection>

      <ButtonGroup>
        <ActionButton variant="primary" onClick={handleBorrow}>
          确认贷款
        </ActionButton>
        <ActionButton variant="secondary" onClick={() => setActionType('start')}>
          取消
        </ActionButton>
      </ButtonGroup>
    </Container>
  )
}

export default BorrowDialog

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

const Description = styled.p({
  color: 'rgba(255, 255, 255, 0.7)',
  fontSize: '14px',
  margin: 0,
  lineHeight: 1.5,
})

const AmountSection = styled.div({
  background: 'rgba(255, 255, 255, 0.05)',
  borderRadius: '12px',
  padding: '16px',
})

const AmountLabel = styled.div({
  color: 'rgba(255, 255, 255, 0.6)',
  fontSize: '12px',
  marginBottom: '12px',
})

const AmountInputGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

const AdjustButton = styled.button({
  width: '40px',
  height: '40px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  fontSize: '20px',
  fontWeight: 600,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&:active': {
    transform: 'scale(0.95)',
  },
})

const AmountInput = styled.input({
  flex: 1,
  height: '48px',
  borderRadius: '10px',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  background: 'rgba(255, 255, 255, 0.05)',
  color: '#fff',
  fontSize: '24px',
  fontWeight: 600,
  textAlign: 'center',
  outline: 'none',
  '&:focus': {
    borderColor: '#6366f1',
  },
})

const AmountHint = styled.div({
  color: '#f59e0b',
  fontSize: '13px',
  marginTop: '12px',
  textAlign: 'center',
})

const ButtonGroup = styled.div({
  display: 'flex',
  gap: '12px',
})

const ActionButton = styled.button(({ variant }) => ({
  flex: 1,
  padding: '14px',
  borderRadius: '12px',
  border: 'none',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  background: variant === 'primary'
    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
    : 'rgba(255, 255, 255, 0.1)',
  color: '#fff',
  '&:active': {
    transform: 'scale(0.98)',
  },
}))
//#endregion styled components
