import { colors } from '@/styles'
import {
  GameContext,
  checkWinningCondition,
  currencyFormatter,
  getLoanAmount,
  takeLoan,
} from '@/utils'
import styled from '@emotion/styled'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp'
import {
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  TextField,
} from '@mui/material'
import { useContext, useEffect, useState } from 'react'

const OpportunityStockDetails = () => {
  const { card, playerData, setPlayerData, setActionType } =
    useContext(GameContext)
  const [quantity, setQuantity] = useState(0)
  const [isBuyingMore, setIsBuyingMore] = useState(true)
  const [hasStock] = useState(() => {
    // Check if player has stock
    if (
      playerData.assets.filter(
        (a) => a.type === 'stock' && a.name === card.title
      ).length > 0
    ) {
      return true
    }
    return false
  })

  //#region Side-Effects
  useEffect(() => {
    if (hasStock) {
      setIsBuyingMore(false)
    }
  }, [hasStock])
  //#endregion

  //#region Event handlers
  const handleBuy = (e) => {
    let unitPrice = card.arg1
    let newPlayerData = playerData
    e.preventDefault()
    if (quantity > 0) {
      setActionType('start')

      // > Take the loan
      if (playerData.cash < quantity * unitPrice) {
        newPlayerData = takeLoan(playerData, quantity * unitPrice)
      } else {
        newPlayerData.cash -= quantity * unitPrice
      }
      // > Add new item to the assets
      let newAsset = {
        id:
          playerData.assets.length === 0 ? 1 : playerData.assets.at(-1).id + 1,
        name: card.title,
        type: 'stock',
        subtype: null,
        amount: card.arg1 * quantity,
        cost: card.arg1,
        quantity: quantity,
      }
      newPlayerData.assets.push(newAsset)
      // > Add to player's income, if stock has positive cashflow
      if (card.arg4 > 0) {
        let newIncome = {
          id:
            playerData.assets.length === 0
              ? 1
              : playerData.assets.at(-1).id + 1,
          name: card.title,
          amount: card.arg4,
        }
        newPlayerData.incomes.push(newIncome)
        checkWinningCondition(newPlayerData)
      }
      // > Update the context player context data
      setPlayerData(newPlayerData)
    }
    setActionType('start')
  }

  const handlePass = () => {
    setActionType('start')
  }

  const handleInputChange = (e) => {
    let num = parseInt(e.target.value)
    console.log('num: ', num)
    setQuantity((q) => {
      if (isNaN(num) || num < 0) {
        console.log('Case 1: ', q)
        return q
      }
      console.log('Case 2: ', num)
      return num
    })
  }

  const handleSell = () => {
    let newPlayerData = playerData
    let shares = newPlayerData.assets
      .filter((a) => a.type === 'stock' && a.name === card.title)
      .reduce((total, a) => total + a.quantity, 0)
    let cash = card.arg1 * shares
    // > Add shares to the player cash
    newPlayerData.cash += cash
    // > Remove stocks from player's assets
    newPlayerData.assets = [
      ...newPlayerData.assets.filter((a) => a.name !== card.title),
    ]
    // > Update the player data context
    setPlayerData(newPlayerData)
    setActionType('start')
  }

  const increaseStockCount = () => {
    setQuantity((q) => q + 1)
  }

  const decreaseStockCount = () => {
    if (quantity > 0) {
      setQuantity((q) => q - 1)
    }
  }

  const toggleBuyMode = (e) => {
    if (!e.target.checked) {
      setQuantity(0)
    }
    setIsBuyingMore(e.target.checked)
  }

  //#endregion Event handlers

  return (
    <>
      <Top>
        <Left>
          <Header>
            <Title>{card.title}</Title>
          </Header>
          <Description>{card.description}</Description>
          {card.info !== '' && <Note>{card.info}</Note>}
            {card.type === 'stock' && (
              <Details>
                <DetailsColumn>
                  <Note>成本: ¥{currencyFormatter.format(card.arg1)}</Note>
                  <Note>现金流: ¥{currencyFormatter.format(card.arg4)}</Note>
                </DetailsColumn>
                <DetailsColumn>
                  {card.type === 'stock' && (
                    <Note>
                      交易区间: ¥{currencyFormatter.format(card.arg2)} 至 ¥{currencyFormatter.format(card.arg3)}
                    </Note>
                  )}
                  {card.type === 'stock' && (
                    <Note>
                      {`持有股数: ${playerData.assets
                        .filter(
                          (a) => a.type === 'stock' && a.name === card.title
                        )
                        .reduce((total, asset) => total + asset.quantity, 0)}`}
                    </Note>
                  )}
                  {card.type === 'estate' && (
                    <Note>首付: ¥{currencyFormatter.format(card.arg2)}</Note>
                  )}
                  {hasStock && (
                    <ImportantNote>
                      {`(点击出售可卖出全部股票，获得 ¥${currencyFormatter.format(
                        playerData.assets
                          .filter(
                            (a) => a.type === 'stock' && a.name === card.title
                          )
                          .reduce((total, a) => total + a.quantity, 0) * card.arg1
                      )})`}
                    </ImportantNote>
                  )}
                </DetailsColumn>
              </Details>
            )}
            {card.arg2 > playerData.cash && (
              <ImportantNote>{`(现金不足，需贷款 ¥${currencyFormatter.format(
                getLoanAmount(card.arg2 - playerData.cash)
              )})`}</ImportantNote>
            )}
        </Left>
        <Right>
          <ThumbnailImg src="/assets/images/stocks.png" />
        </Right>
      </Top>
      <Bottom>
        <BuyForm onSubmit={handleBuy}>
          <InputContainer>
            <InputLabel>购买数量</InputLabel>
            <InputWrapper>
              <StyledInput
                size="small"
                type="text"
                value={quantity}
                onChange={handleInputChange}
                disabled={!isBuyingMore}
                placeholder="0"
              />
              <InputActions>
                <InputButton
                  aria-label="增加股票数量"
                  size="small"
                  onClick={increaseStockCount}
                  disabled={!isBuyingMore}
                >
                  <ArrowDropUpIcon />
                </InputButton>
                <InputButton
                  aria-label="减少股票数量"
                  size="small"
                  onClick={decreaseStockCount}
                  disabled={!isBuyingMore}
                >
                  <ArrowDropDownIcon />
                </InputButton>
              </InputActions>
            </InputWrapper>
            {/* Checkbox */}
            {hasStock && (
              <StyledFormControlLabel
                control={<Checkbox onChange={toggleBuyMode} size="small" />}
                label="继续购买"
              />
            )}
          </InputContainer>
          {/* Side note */}
          {quantity > 0 && (
            <PurchaseSummary>
              <SummaryText>
                购买 <SummaryHighlight>{quantity}</SummaryHighlight> 股，
                共计 <SummaryHighlight>¥{currencyFormatter.format(quantity * card.arg1)}</SummaryHighlight>
              </SummaryText>
              {quantity * card.arg1 > playerData.cash && (
                <LoanWarning>
                  需贷款: ¥{getLoanAmount(quantity * card.arg1 - playerData.cash)}
                </LoanWarning>
              )}
            </PurchaseSummary>
          )}

          <MainActions>
            <ActionButton
              type="submit"
              variant="contained"
              disableRipple
              disabled={quantity === 0}
            >
              购买
            </ActionButton>
            {card.type === 'stock' &&
              playerData.assets.filter(
                (a) => a.type === 'stock' && a.name === card.title
              ).length > 0 && (
                <ActionButton
                  variant="contained"
                  disableRipple
                  onClick={handleSell}
                  disabled={isBuyingMore}
                >
                  出售
                </ActionButton>
              )}
            <ActionButton
              variant="contained"
              disableRipple
              onClick={handlePass}
              style={{ alignSelf: 'flex-end' }}
            >
              跳过
            </ActionButton>
          </MainActions>
        </BuyForm>
      </Bottom>
    </>
  )
}

export default OpportunityStockDetails

//#region styled components
const Top = styled.div({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  columnGap: '1rem',
})

const Bottom = styled.div({
  display: 'flex',
  flexDirection: 'row',
})

const Left = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  rowGap: '.125rem',
})

const Right = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
})

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
  width: '100%',
  alignSelf: 'flex-start',
})

const Note = styled.span({
  fontWeight: 700,
  alignSelf: 'flex-start',
  padding: 0,
})

const ImportantNote = styled(Note)({
  fontWeight: 700,
  color: colors.red.base,
})

const InputLabel = styled.span({
  fontSize: '14px',
  fontWeight: 600,
  color: '#475569',
})

const StyledFormControlLabel = styled(FormControlLabel)({
  marginLeft: '8px',
  '& .MuiFormControlLabel-label': {
    fontSize: '13px',
    fontWeight: 500,
    color: '#64748b',
  },
  '& .MuiCheckbox-root': {
    color: '#94a3b8',
    '&.Mui-checked': {
      color: '#3b82f6',
    },
  },
})

const PurchaseSummary = styled.div({
  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  borderRadius: '10px',
  padding: '10px 14px',
  border: '1px solid #fbbf24',
})

const SummaryText = styled.span({
  fontSize: '14px',
  fontWeight: 500,
  color: '#92400e',
})

const SummaryHighlight = styled.span({
  fontWeight: 700,
  color: '#b45309',
  fontSize: '15px',
})

const LoanWarning = styled.div({
  marginTop: '6px',
  fontSize: '13px',
  fontWeight: 600,
  color: '#dc2626',
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

const Details = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  color: colors.blue.dark,
  width: '100%',
  fontSize: '.9rem',
})

const DetailsColumn = styled.div({
  display: 'flex',
  flexDirection: 'column',
  flex: '1 1 auto',
})

const BuyForm = styled.form({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  rowGap: '1rem',
})

const InputContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  columnGap: '12px',
  alignItems: 'center',
  flexWrap: 'wrap',
  rowGap: '8px',
})

const InputWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  borderRadius: '12px',
  border: '2px solid #e2e8f0',
  padding: '4px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  transition: 'all 0.2s ease',
  '&:focus-within': {
    borderColor: '#3b82f6',
    boxShadow: '0 2px 12px rgba(59, 130, 246, 0.2)',
  },
})

const InputActions = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '2px',
})

const InputButton = styled(IconButton)({
  height: '24px',
  width: '24px',
  background: '#fff',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  color: '#64748b',
  transition: 'all 0.15s ease',
  '&:hover': {
    background: '#3b82f6',
    borderColor: '#3b82f6',
    color: '#fff',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
  '& svg': {
    fontSize: '20px',
  },
})

const StyledInput = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: '#fff',
    borderRadius: '8px',
    fontSize: '18px',
    fontWeight: 600,
    width: '100px',
    '& fieldset': {
      border: 'none',
    },
    '& input': {
      textAlign: 'center',
      padding: '8px 12px',
      color: '#1e293b',
    },
  },
  '& .MuiInputLabel-root': {
    display: 'none',
  },
})

//#endregion styled components
