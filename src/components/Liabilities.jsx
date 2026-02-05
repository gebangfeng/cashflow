import styled from '@emotion/styled'
import { colors } from '@/styles'
import PropTypes from 'prop-types'
import { currencyFormatter, GameContext } from '@/utils'
import PaymentIcon from '@mui/icons-material/Payment'
import { useContext } from 'react'

const Liabilities = ({ liabilities }) => {
  const { actionType } = useContext(GameContext)
  const handleRepay = () => {
    alert('Repay logic not implemented!')
  }
  return (
    <CardContainer>
      <CardHeader>
        <HeaderIcon>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </HeaderIcon>
        <HeaderTitle>Liabilities</HeaderTitle>
      </CardHeader>
      <CardBody>
        <ListHeader>
          <span>Debt</span>
          <span>Amount</span>
        </ListHeader>
        <StyledList>
          {liabilities && liabilities.length > 0 ? (
            liabilities.map((i) => (
              <ListItem key={i.id}>
                <ListItemLeft>{i.name}</ListItemLeft>
                <ListItemRight>
                  ${currencyFormatter.format(i.amount)}
                </ListItemRight>
                {actionType === 'repay' && (
                  <RepayButton onClick={handleRepay}>
                    <PaymentIcon fontSize="small" />
                  </RepayButton>
                )}
              </ListItem>
            ))
          ) : (
            <EmptyState>No liabilities</EmptyState>
          )}
        </StyledList>
      </CardBody>
    </CardContainer>
  )
}

//#region prop types
Liabilities.propTypes = {
  liabilities: PropTypes.array,
}
//#endregion prop types

export default Liabilities

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
  backgroundColor: colors.warning.base,
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
  color: colors.warning.dark,
})

const RepayButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.25rem',
  border: 'none',
  background: colors.primary[100],
  borderRadius: '0.25rem',
  cursor: 'pointer',
  color: colors.primary[700],
  transition: 'all 0.15s ease',
  '&:hover': {
    background: colors.primary[600],
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
