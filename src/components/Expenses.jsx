import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { currencyFormatter } from '@/utils'

const Expenses = ({ expenses }) => {
  if (!expenses || expenses.length === 0) {
    return <EmptyState>暂无支出</EmptyState>
  }

  return (
    <List>
      {expenses.map((expense) => (
        <ListItem key={expense.id}>
          <ItemName>{expense.name}</ItemName>
          <ItemValue>-¥{currencyFormatter.format(expense.amount)}</ItemValue>
        </ListItem>
      ))}
    </List>
  )
}

Expenses.propTypes = {
  expenses: PropTypes.array,
  childNum: PropTypes.number,
  expensePerChild: PropTypes.number,
}

export default Expenses

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

const ItemName = styled.span({
  color: 'rgba(255, 255, 255, 0.8)',
  fontSize: '12px',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
})

const ItemValue = styled.span({
  color: '#ef4444',
  fontSize: '12px',
  fontWeight: 600,
  marginLeft: '8px',
})

const EmptyState = styled.div({
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '12px',
  textAlign: 'center',
  padding: '16px',
})
//#endregion styled components
