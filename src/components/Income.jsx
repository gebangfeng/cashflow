import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { currencyFormatter } from '@/utils/helpers'

const Income = ({ incomes }) => {
  if (!incomes || incomes.length === 0) {
    return <EmptyState>暂无收入</EmptyState>
  }

  return (
    <List>
      {incomes.map((income) => (
        <ListItem key={income.id}>
          <ItemName>{income.name}</ItemName>
          <ItemValue>+¥{currencyFormatter.format(income.amount)}</ItemValue>
        </ListItem>
      ))}
    </List>
  )
}

Income.propTypes = {
  incomes: PropTypes.array,
}

export default Income

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
  color: '#22c55e',
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
