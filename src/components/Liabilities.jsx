import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { currencyFormatter, GameContext } from '@/utils'
import { useContext } from 'react'

const Liabilities = ({ liabilities }) => {
  const { actionType } = useContext(GameContext)

  if (!liabilities || liabilities.length === 0) {
    return <EmptyState>暂无负债</EmptyState>
  }

  return (
    <List>
      {liabilities.map((liability) => (
        <ListItem key={liability.id}>
          <ItemInfo>
            <ItemName>{liability.name}</ItemName>
            <ItemValue>¥{currencyFormatter.format(liability.amount)}</ItemValue>
          </ItemInfo>
          {actionType === 'repay' && (
            <RepayButton>
              还款
            </RepayButton>
          )}
        </ListItem>
      ))}
    </List>
  )
}

Liabilities.propTypes = {
  liabilities: PropTypes.array,
}

export default Liabilities

//#region styled components
const List = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
})

const ListItem = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '6px 8px',
  borderRadius: '6px',
  background: 'rgba(255, 255, 255, 0.03)',
})

const ItemInfo = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  flex: 1,
  gap: '8px',
})

const ItemName = styled.span({
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '12px',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const ItemValue = styled.span({
  color: '#f59e0b',
  fontSize: '12px',
  fontWeight: 600,
})

const RepayButton = styled.button({
  background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '11px',
  fontWeight: 600,
  cursor: 'pointer',
  marginLeft: '8px',
  '&:active': {
    transform: 'scale(0.95)',
  },
})

const EmptyState = styled.div({
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '12px',
  textAlign: 'center',
  padding: '16px',
})
//#endregion styled components
