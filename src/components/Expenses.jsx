import styled from '@emotion/styled'
import { colors } from '@/styles'
import PropTypes from 'prop-types'
import { currencyFormatter } from '@/utils'

const Expenses = ({ expenses }) => {
  return (
    <CardContainer>
      <CardHeader>
        <HeaderIcon>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23,18 13.5,8.5 8.5,13.5 1,6" />
            <polyline points="17,18 23,18 23,12" />
          </svg>
        </HeaderIcon>
        <HeaderTitle>Expenses</HeaderTitle>
      </CardHeader>
      <CardBody>
        <ListHeader>
          <span>Category</span>
          <span>Amount</span>
        </ListHeader>
        <StyledList>
          {expenses && expenses.length > 0 ? (
            expenses.map((i) => (
              <ListItem key={i.id}>
                <ListItemLeft>{i.name}</ListItemLeft>
                <ListItemRight>
                  ${currencyFormatter.format(i.amount)}
                </ListItemRight>
              </ListItem>
            ))
          ) : (
            <EmptyState>No expenses recorded</EmptyState>
          )}
        </StyledList>
      </CardBody>
    </CardContainer>
  )
}

//#region prop types
Expenses.propTypes = {
  expenses: PropTypes.array,
  childNum: PropTypes.number.isRequired,
  expensePerChild: PropTypes.number.isRequired,
}
//#endregion prop types

export default Expenses

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
  backgroundColor: colors.error.base,
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
  borderBottom: `1px solid ${colors.neutral[100]}`,
  '&:last-child': {
    borderBottom: 'none',
  },
})

const ListItemLeft = styled.span({
  fontSize: '0.8125rem',
  color: colors.neutral[700],
  fontWeight: 500,
})

const ListItemRight = styled.span({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: colors.error.base,
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
