import styled from '@emotion/styled'
import { colors } from '@/styles'
import PropTypes from 'prop-types'
import { currencyFormatter } from '@/utils/helpers'

const Income = ({ incomes }) => {
  return (
    <CardContainer>
      <CardHeader>收入</CardHeader>
      <CardBody>
        <ListHeader>现金流</ListHeader>
        <StyledList>
          {incomes &&
            incomes.map((i) => (
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
Income.propTypes = {
  incomes: PropTypes.array,
}
//#endregion prop types

export default Income

//#region styled components
const CardContainer = styled.div({
  backgroundColor: colors.blilet.darker,
  border: `1px solid ${colors.blilet.dark}`,
  borderRadius: '12px',
  maxWidth: '400px',
  margin: 0,
  padding: 0,
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
})

const CardHeader = styled.h3({
  backgroundColor: colors.green.base,
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

const ListHeader = styled.div({
  textAlign: 'right',
  fontSize: '.75rem',
  margin: 0,
  fontWeight: 700,
  padding: '0 0 .25rem 0',
  borderBottom: `1px solid ${colors.blilet.dark}`,
  color: colors.grey.light,
})

const ListItem = styled.li({
  display: 'flex',
  fontSize: '.8rem',
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
  color: colors.green.light,
})
//#endregion styled components
