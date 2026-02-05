import styled from '@emotion/styled'
import { Button } from '@mui/material'
import PropTypes from 'prop-types'
import { useContext, useState } from 'react'
import { GameContext } from '@/utils'
import { currencyFormatter } from '@/utils'

const BuyDialog = ({
  title,
  description,
  note,
  cost,
  arg1,
  arg2,
  arg3,
  arg4,
}) => {
  const { setActionType } = useContext(GameContext)

  const [amount, setAmount] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('该功能暂未实现')
    setActionType('start')
  }
  const increaseAmount = () => setAmount((a) => a + 1)
  const decreaseAmount = () => setAmount((a) => (a > 0 ? a - 1 : 0))

  return (
    <>
      <BuyForm onSubmit={handleSubmit}>
        <InputContainer>
          <InputLabel>购买数量</InputLabel>
          <InputWrapper>
            <StyledInput
              type="text"
              value={amount}
              onChange={(e) => {
                let num = parseInt(e.target.value)
                setAmount(isNaN(num) ? 0 : num)
              }}
              placeholder="0"
            />
            <InputActions>
              <InputButton onClick={increaseAmount} type="button">+</InputButton>
              <InputButton onClick={decreaseAmount} type="button">-</InputButton>
            </InputActions>
          </InputWrapper>
        </InputContainer>
        {amount > 0 && (
          <PurchaseSummary>
            购买 <SummaryHighlight>{amount}</SummaryHighlight> 份，
            共计 <SummaryHighlight>¥{currencyFormatter.format(amount * cost)}</SummaryHighlight>
          </PurchaseSummary>
        )}
        <MainActions>
          <ActionButton type="submit" variant="contained" disableRipple>
            购买
          </ActionButton>
          <ActionButton
            variant="contained"
            disableRipple
            onClick={() => {
              setActionType('start')
            }}
            style={{ alignSelf: 'flex-end' }}
          >
            取消
          </ActionButton>
        </MainActions>
      </BuyForm>
    </>
  )
}

BuyDialog.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  info: PropTypes.string,
  type: PropTypes.string,
  note: PropTypes.string,
  arg1: PropTypes.number,
  arg2: PropTypes.number,
  arg3: PropTypes.number,
  arg4: PropTypes.number,
}

export default BuyDialog

//#region styled components
const BuyForm = styled.form({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '16px',
})

const InputContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
})

const InputLabel = styled.span({
  fontSize: '14px',
  fontWeight: 600,
  color: '#475569',
})

const InputWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
  padding: '4px 8px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  transition: 'all 0.2s ease',
  '&:focus-within': {
    borderColor: '#3b82f6',
    boxShadow: '0 2px 12px rgba(59, 130, 246, 0.2)',
  },
})

const StyledInput = styled.input({
  fontSize: '18px',
  fontWeight: 600,
  width: '60px',
  textAlign: 'center',
  border: 'none',
  background: 'transparent',
  color: '#1e293b',
  outline: 'none',
  '&::placeholder': {
    color: '#94a3b8',
  },
})

const InputActions = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

const InputButton = styled.button({
  width: '24px',
  height: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  color: '#64748b',
  fontSize: '14px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: '#3b82f6',
    borderColor: '#3b82f6',
    color: '#fff',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
})

const PurchaseSummary = styled.div({
  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  borderRadius: '10px',
  padding: '10px 14px',
  border: '1px solid #fbbf24',
  fontSize: '14px',
  fontWeight: 500,
  color: '#92400e',
})

const SummaryHighlight = styled.span({
  fontWeight: 700,
  color: '#b45309',
  fontSize: '15px',
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
