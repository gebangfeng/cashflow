import styled from '@emotion/styled'
import { Button, IconButton } from '@mui/material'
import { useContext, useState } from 'react'
import { GameContext } from '@/utils'
import { colors } from '@/styles'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

const BorrowDialog = () => {
  const { setActionType } = useContext(GameContext)

  const [amount, setAmount] = useState(1000)

  const handleBorrow = (e) => {
    e.preventDefault()
    alert('Borrow Logic is not implemented at the moment')
    setActionType('start')
  }

  const increaseAmount = () => {
    setAmount(prev => prev + 1000)
  }

  const decreaseAmount = () => {
    setAmount(prev => Math.max(0, prev - 1000))
  }

  return (
    <>
      <Header>
        <Title>银行贷款</Title>
        <ThumbnailImg src="./assets/images/borrow-thumb.png" alt="borrow" />
      </Header>
      <Description>
        贷款必须是$1,000的倍数，月利率为10%。
      </Description>
      <Note style={{ flex: 1 }} />
      <BorrowForm onSubmit={handleBorrow}>
        <InputContainer>
          <InputLabel>金额: $</InputLabel>
          <StyledInput
            type="text"
            value={amount}
            onChange={(e) => {
              let num = parseInt(e.target.value)
              setAmount(isNaN(num) ? 0 : num)
            }}
          />
          <InputActions>
            <InputButton aria-label="increase" size="small" onClick={increaseAmount}>
              <ArrowDropUpIcon sx={{ color: colors.grey.light }} />
            </InputButton>
            <InputButton aria-label="decrease" size="small" onClick={decreaseAmount}>
              <ArrowDropDownIcon sx={{ color: colors.grey.light }} />
            </InputButton>
          </InputActions>
        </InputContainer>
        <MainActions>
          <ActionButton type="submit" variant="contained" disableRipple primary>
            借款
          </ActionButton>
          <CancelButton
            variant="contained"
            disableRipple
            onClick={() => {
              setActionType('start')
            }}
          >
            取消
          </CancelButton>
        </MainActions>
      </BorrowForm>
    </>
  )
}

export default BorrowDialog

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
  color: colors.orange.base,
  margin: 0,
  fontSize: '1.5rem',
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

const BorrowForm = styled.form({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '1rem',
})

const InputContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.5rem',
})

const InputLabel = styled.span({
  color: colors.grey.light,
  fontSize: '1rem',
})

const InputActions = styled.div({
  display: 'flex',
  flexDirection: 'column',
})

const InputButton = styled(IconButton)({
  height: '20px',
  width: '20px',
  backgroundColor: colors.blilet.dark,
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: colors.blilet.light,
  },
})

const StyledInput = styled.input({
  fontSize: '1.25rem',
  width: '120px',
  padding: '0.5rem 0.75rem',
  borderRadius: '8px',
  border: `1px solid ${colors.blilet.dark}`,
  backgroundColor: colors.blilet.darker,
  color: colors.white,
  textAlign: 'right',
  '&:focus': {
    outline: 'none',
    borderColor: colors.orange.base,
  },
})

const MainActions = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  columnGap: '1rem',
  width: '100%',
  marginTop: '0.5rem',
})

const ActionButton = styled(Button)({
  fontWeight: 700,
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  backgroundColor: colors.orange.base,
  color: colors.white,
  textTransform: 'none',
  fontSize: '1rem',
  minWidth: '100px',
  '&:hover': {
    backgroundColor: colors.orange.dark,
  },
  '&:active': {
    opacity: 0.8,
    transform: 'scale(0.95)',
  },
})

const CancelButton = styled(Button)({
  fontWeight: 700,
  padding: '0.75rem 1.5rem',
  borderRadius: '8px',
  backgroundColor: colors.grey.dark,
  color: colors.white,
  textTransform: 'none',
  fontSize: '1rem',
  minWidth: '100px',
  '&:hover': {
    backgroundColor: colors.grey.base,
  },
  '&:active': {
    opacity: 0.8,
    transform: 'scale(0.95)',
  },
})

//#endregion styled components
