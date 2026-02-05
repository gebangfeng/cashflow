import styled from '@emotion/styled'
import { colors } from '@/styles'
import PropTypes from 'prop-types'
import { currencyFormatter } from '@/utils'

const Expenses = ({ expenses }) => {
  return (
    <CardContainer>
      <CardHeader>支出</CardHeader>
      <CardBody>
        <ListItemHeader>
          <ListItemLeft>名称</ListItemLeft>
          <ListItemRight>金额</ListItemRight>
        </ListItemHeader>
        <StyledList>
          {expenses &&
            expenses.map((i) => (
              <ListItem key={i.id}>
                <ListItemLeft>{i.name}</ListItemLeft>
                <ListItemRight>
                  ${currencyFormatter.format(i.amount)}
                </ListItemRight>
              </ListItem>
            ))}
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
  backgroundColor: colors.blilet.darker,
  border: `1px solid ${colors.blilet.dark}`,
  borderRadius: '12px',
  height: '100%',
  maxWidth: '400px',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
})

const CardHeader = styled.h3({
  backgroundColor: colors.red.dark,
  borderRadius: '10px 10px 0 0',
  color: colors.white,
  fontWeight: 700,
  height: '1.75rem',
  margin: 0,
  padding: '.25rem',
  textAlign: 'center',
  fontSize: '0.9rem',
})

const CardBody = styled.div({
  margin: '.5rem .75rem 0',
  paddingRight: '.5rem',
  height: '70%',
})

const StyledList = styled.ul({
  overflowY: 'auto',
  height: '100%',
  scrollbarWidth: 'thin',
  paddingInlineStart: 0,
  margin: 0,
})

const ListItemHeader = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  margin: 0,
  paddingBottom: '.25rem',
  borderBottom: `1px solid ${colors.blilet.dark}`,
  '& span': {
    fontWeight: 700,
    color: colors.grey.light,
    fontSize: '.75rem',
  },
})

const ListItem = styled.li({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  padding: '.375rem 0',
  columnGap: '10px',
})

const ListItemLeft = styled.span({
  borderBottom: `1px solid ${colors.blilet.dark}`,
  flex: '1 1 150px',
  fontSize: '.8rem',
  textAlign: 'left',
  color: colors.grey.lighter,
})
const ListItemRight = styled.span({
  borderBottom: `1px solid ${colors.blilet.dark}`,
  flex: '1 1 auto',
  fontSize: '.8rem',
  textAlign: 'right',
  color: colors.red.light,
})
//#endregion styled components
