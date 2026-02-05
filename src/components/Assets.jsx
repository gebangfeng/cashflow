import styled from '@emotion/styled'
import { colors } from '@/styles'
import PropTypes from 'prop-types'
import { currencyFormatter, GameContext } from '@/utils'
import { useContext } from 'react'
import PaymentIcon from '@mui/icons-material/Payment'

const Assets = ({ assets }) => {
  const {
    card,
    isSellingAssets,
    playerData,
    setPlayerData,
    setIsSellingAssets,
    setActionType,
  } = useContext(GameContext)

  const handleSell = (asset) => {
    let newPlayerData = playerData
    const cash =
      asset.unit * card.arg1 - asset.mortgage > 0
        ? asset.unit * card.arg1 - asset.mortgage
        : 0
    newPlayerData.assets = [
      ...newPlayerData.assets.filter((a) => a.id !== asset.id),
    ]
    newPlayerData.cash += cash
    setIsSellingAssets(false)
    setPlayerData(newPlayerData)
    setActionType('start')
  }

  return (
    <CardContainer>
      <CardHeader>
        <HeaderIcon>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
          </svg>
        </HeaderIcon>
        <HeaderTitle>Assets</HeaderTitle>
      </CardHeader>
      <CardBody>
        <ListHeader>
          <span>Item</span>
          <span>Cost</span>
        </ListHeader>
        <StyledList>
          {assets && assets.length > 0 ? (
            assets.map((i) => (
              <ListItem key={i.id}>
                <ListItemLeft>
                  {i.quantity >= 1 ? `${i.quantity}x ` : ''}{i.name}
                </ListItemLeft>
                <ListItemRight>
                  ${currencyFormatter.format(i.cost)}
                </ListItemRight>
                {isSellingAssets &&
                  i.type === card.type &&
                  i.subtype === card.subtype && (
                    <SellButton onClick={() => handleSell(i)}>
                      <PaymentIcon fontSize="small" />
                    </SellButton>
                  )}
              </ListItem>
            ))
          ) : (
            <EmptyState>No assets owned</EmptyState>
          )}
        </StyledList>
      </CardBody>
    </CardContainer>
  )
}

//#region prop types
Assets.propTypes = {
  assets: PropTypes.array,
}
//#endregion prop types

export default Assets

//#region styled components
const CardContainer = styled.div({
  backgroundColor: colors.white,
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
})

const CardHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1rem',
  backgroundColor: colors.info.base,
  color: colors.white,
})

const HeaderIcon = styled.span({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.5rem',
  height: '1.5rem',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '0.375rem',
})

const HeaderTitle = styled.h3({
  margin: 0,
  fontSize: '0.875rem',
  fontWeight: 700,
  letterSpacing: '0.025em',
})

const CardBody = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  padding: '0.75rem',
  minHeight: 0,
})

const StyledList = styled.ul({
  flex: 1,
  overflowY: 'auto',
  paddingInlineStart: 0,
  margin: 0,
  listStyle: 'none',
})

const ListHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: '0.625rem',
  fontWeight: 700,
  color: colors.neutral[500],
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  paddingBottom: '0.5rem',
  marginBottom: '0.5rem',
  borderBottom: `1px solid ${colors.neutral[200]}`,
})

const ListItem = styled.li({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0.5rem 0',
  gap: '0.5rem',
  borderBottom: `1px solid ${colors.neutral[100]}`,
  '&:last-child': {
    borderBottom: 'none',
  },
})

const ListItemLeft = styled.span({
  flex: 1,
  fontSize: '0.8125rem',
  color: colors.neutral[700],
  fontWeight: 500,
})

const ListItemRight = styled.span({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: colors.info.dark,
})

const SellButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.25rem',
  border: 'none',
  background: colors.warning.light,
  borderRadius: '0.25rem',
  cursor: 'pointer',
  color: colors.warning.dark,
  transition: 'all 0.15s ease',
  '&:hover': {
    background: colors.warning.base,
    color: colors.white,
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
})

const EmptyState = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flex: 1,
  fontSize: '0.75rem',
  color: colors.neutral[400],
  fontStyle: 'italic',
})
//#endregion styled components
