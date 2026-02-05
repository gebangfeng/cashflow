import styled from '@emotion/styled'
import { useState } from 'react'
import { colors, breakpoints } from '@/styles'
import { PROFESSIONS, PROFESSION_TIERS, currencyFormatter, getMonthlyLoanPayment } from '@/utils'
import PropTypes from 'prop-types'

const CharacterSelect = ({ onSelect, onBack }) => {
  const [selectedProfession, setSelectedProfession] = useState(null)

  // Group professions by tier
  const professionsByTier = PROFESSION_TIERS.map(tier => ({
    ...tier,
    professions: PROFESSIONS.filter(p => p.tier === tier.level)
  }))

  // Calculate financial stats for the selected profession
  const getFinancialStats = (profession) => {
    if (!profession) return null
    
    const totalLiabilities = profession.liabilities.reduce((sum, l) => sum + l.amount, 0)
    const monthlyExpenses = profession.liabilities.reduce((sum, l) => sum + getMonthlyLoanPayment(l), 0) 
      + Math.floor(profession.salary * 0.18) // taxes
      + profession.otherExpenses
    const monthlyCashFlow = profession.salary - monthlyExpenses
    const initialNetWorth = profession.cash
    
    return {
      initialNetWorth,
      monthlySalary: profession.salary,
      monthlyExpenses,
      monthlyCashFlow,
      cash: profession.cash,
    }
  }

  const handleCardClick = (profession, unlocked) => {
    if (unlocked) {
      setSelectedProfession(profession)
    }
  }

  const handleConfirm = () => {
    if (selectedProfession) {
      onSelect(selectedProfession)
    }
  }

  const handleClose = () => {
    setSelectedProfession(null)
  }

  const stats = getFinancialStats(selectedProfession)

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack} aria-label="Go back">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6" />
          </svg>
        </BackButton>
        <Title>选择职业</Title>
        <Placeholder />
      </Header>

      <Content>
        {professionsByTier.map(tier => (
          <TierSection key={tier.level}>
            {tier.level > 1 && (
              <TierHeader>
                <TierBadge style={{ backgroundColor: tier.color }}>
                  <span>Lv{tier.level}</span>
                  <TierName>{tier.name}</TierName>
                </TierBadge>
                <TierLabel>{tier.name}等级解锁</TierLabel>
              </TierHeader>
            )}
            <ProfessionGrid>
              {tier.professions.map(profession => (
                <ProfessionCard
                  key={profession.id}
                  onClick={() => handleCardClick(profession, tier.unlocked)}
                  disabled={!tier.unlocked}
                >
                  <AvatarWrapper>
                    <Avatar style={{ backgroundColor: profession.avatarColor }}>
                      <AvatarIcon>
                        {getAvatarIcon(profession.name)}
                      </AvatarIcon>
                    </Avatar>
                    {!tier.unlocked && (
                      <LockedOverlay>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                        </svg>
                      </LockedOverlay>
                    )}
                  </AvatarWrapper>
                  <ProfessionName>{profession.nameCn}</ProfessionName>
                  <SalaryTag>${currencyFormatter.format(profession.salary)}/月</SalaryTag>
                </ProfessionCard>
              ))}
            </ProfessionGrid>
          </TierSection>
        ))}
      </Content>

      <MusicButton aria-label="Toggle music">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      </MusicButton>

      {/* Confirmation Modal */}
      {selectedProfession && stats && (
        <ModalOverlay onClick={handleClose}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalAvatar style={{ backgroundColor: selectedProfession.avatarColor }}>
                <ModalAvatarIcon>{getAvatarIcon(selectedProfession.name)}</ModalAvatarIcon>
              </ModalAvatar>
              <CoinDecoration>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#fbbf24">
                  <circle cx="12" cy="12" r="10" />
                  <text x="12" y="16" textAnchor="middle" fill="#92400e" fontSize="10" fontWeight="bold">$</text>
                </svg>
              </CoinDecoration>
            </ModalHeader>

            <ModalBody>
              <ModalTitle>{selectedProfession.nameCn}</ModalTitle>
              <ModalSubtitle>{selectedProfession.name}</ModalSubtitle>

              <StatsCard>
                <StatsHeader>
                  初始净资产: {currencyFormatter.format(stats.initialNetWorth)}
                </StatsHeader>
                <StatsList>
                  <StatItem>
                    <StatLabel>月工资:</StatLabel>
                    <StatValue>{currencyFormatter.format(stats.monthlySalary)}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>月总支出:</StatLabel>
                    <StatValue>{currencyFormatter.format(stats.monthlyExpenses)}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>月现金流:</StatLabel>
                    <StatValue positive={stats.monthlyCashFlow > 0}>
                      {currencyFormatter.format(stats.monthlyCashFlow)}
                    </StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>现金:</StatLabel>
                    <StatValue>{currencyFormatter.format(stats.cash)}</StatValue>
                  </StatItem>
                </StatsList>
              </StatsCard>

              <CareerPaths>
                <CareerPath>
                  <CareerTitle>物流主管</CareerTitle>
                  <CareerSalary>8400</CareerSalary>
                </CareerPath>
                <CareerPath>
                  <CareerTitle>片区经理</CareerTitle>
                  <CareerSalary>12600</CareerSalary>
                </CareerPath>
              </CareerPaths>
            </ModalBody>

            <ModalActions>
              <CloseButton onClick={handleClose}>关闭</CloseButton>
              <ConfirmButton onClick={handleConfirm}>确认</ConfirmButton>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

// Helper function to get avatar icon based on profession
const getAvatarIcon = (name) => {
  const icons = {
    'Office Clerk': '👩‍💼',
    'Delivery Driver': '🚚',
    'Nurse': '👩‍⚕️',
    'Sales': '💼',
    'Bank Teller': '🏦',
    'Journalist': '📰',
    'E-commerce Operator': '🛒',
    'Product Manager': '📊',
    'Doctor': '👨‍⚕️',
    'Engineer': '👨‍💻',
  }
  return icons[name] || '👤'
}

CharacterSelect.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onBack: PropTypes.func,
}

CharacterSelect.defaultProps = {
  onBack: () => {},
}

export default CharacterSelect

//#region styled components
const Container = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  minHeight: '100vh',
  backgroundColor: colors.accent[100],
  position: 'relative',
})

const Header = styled.header({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0.75rem 1rem',
  backgroundColor: colors.white,
  borderBottom: `1px solid ${colors.neutral[200]}`,
  position: 'sticky',
  top: 0,
  zIndex: 10,
  [`@media (min-width: ${breakpoints.md})`]: {
    padding: '1rem 1.5rem',
  },
})

const BackButton = styled.button({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '2.5rem',
  height: '2.5rem',
  border: 'none',
  background: 'transparent',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  color: colors.neutral[700],
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: colors.neutral[100],
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
})

const Title = styled.h1({
  margin: 0,
  fontSize: '1.25rem',
  fontWeight: 800,
  color: colors.neutral[900],
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: '1.5rem',
  },
})

const Placeholder = styled.div({
  width: '2.5rem',
})

const Content = styled.main({
  flex: 1,
  padding: '1rem',
  paddingBottom: '5rem',
  overflowY: 'auto',
  [`@media (min-width: ${breakpoints.md})`]: {
    padding: '1.5rem',
    maxWidth: '48rem',
    margin: '0 auto',
    width: '100%',
  },
})

const TierSection = styled.section({
  marginBottom: '1.5rem',
})

const TierHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  marginBottom: '1rem',
  marginTop: '0.5rem',
})

const TierBadge = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  padding: '0.25rem 0.5rem',
  borderRadius: '0.25rem',
  color: colors.white,
  fontSize: '0.75rem',
  fontWeight: 700,
})

const TierName = styled.span({
  fontSize: '0.625rem',
  backgroundColor: 'rgba(255,255,255,0.3)',
  padding: '0.125rem 0.25rem',
  borderRadius: '0.125rem',
})

const TierLabel = styled.span({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: colors.neutral[700],
})

const ProfessionGrid = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '1rem',
  [`@media (min-width: ${breakpoints.sm})`]: {
    gridTemplateColumns: 'repeat(3, 1fr)',
  },
  [`@media (min-width: ${breakpoints.md})`]: {
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.25rem',
  },
})

const ProfessionCard = styled.button(({ disabled }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '1rem 0.5rem',
  backgroundColor: colors.white,
  border: 'none',
  borderRadius: '0.75rem',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.6 : 1,
  transition: 'all 0.2s ease',
  boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  '&:hover': {
    transform: disabled ? 'none' : 'translateY(-2px)',
    boxShadow: disabled ? '0 1px 3px 0 rgb(0 0 0 / 0.1)' : '0 4px 12px -2px rgb(0 0 0 / 0.15)',
  },
  '&:active': {
    transform: disabled ? 'none' : 'scale(0.98)',
  },
}))

const AvatarWrapper = styled.div({
  position: 'relative',
  width: '4.5rem',
  height: '4.5rem',
  [`@media (min-width: ${breakpoints.md})`]: {
    width: '5rem',
    height: '5rem',
  },
})

const Avatar = styled.div({
  width: '100%',
  height: '100%',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 2px 8px -2px rgb(0 0 0 / 0.2)',
})

const AvatarIcon = styled.span({
  fontSize: '2rem',
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: '2.25rem',
  },
})

const LockedOverlay = styled.div({
  position: 'absolute',
  inset: 0,
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.white,
})

const ProfessionName = styled.span({
  fontSize: '0.875rem',
  fontWeight: 600,
  color: colors.neutral[800],
  textAlign: 'center',
})

const SalaryTag = styled.span({
  fontSize: '0.625rem',
  fontWeight: 500,
  color: colors.neutral[500],
  backgroundColor: colors.neutral[100],
  padding: '0.125rem 0.375rem',
  borderRadius: '0.25rem',
})

const MusicButton = styled.button({
  position: 'fixed',
  bottom: '1.5rem',
  right: '1.5rem',
  width: '3rem',
  height: '3rem',
  borderRadius: '50%',
  border: 'none',
  backgroundColor: colors.primary[500],
  color: colors.white,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px -2px rgb(0 0 0 / 0.2)',
  transition: 'all 0.15s ease',
  zIndex: 5,
  '&:hover': {
    backgroundColor: colors.primary[600],
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
})

// Modal styles
const ModalOverlay = styled.div({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: '1rem',
})

const ModalContent = styled.div({
  width: '100%',
  maxWidth: '22rem',
  borderRadius: '1rem',
  overflow: 'hidden',
  background: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
  boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  animation: 'modalSlideIn 0.3s ease',
  '@keyframes modalSlideIn': {
    from: {
      opacity: 0,
      transform: 'scale(0.95) translateY(10px)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
    },
  },
})

const ModalHeader = styled.div({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  padding: '1.5rem 1rem 0.5rem',
})

const ModalAvatar = styled.div({
  width: '6rem',
  height: '6rem',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 8px 24px -4px rgb(0 0 0 / 0.2)',
  border: '3px solid rgba(255, 255, 255, 0.3)',
  [`@media (min-width: ${breakpoints.md})`]: {
    width: '7rem',
    height: '7rem',
  },
})

const ModalAvatarIcon = styled.span({
  fontSize: '3rem',
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: '3.5rem',
  },
})

const CoinDecoration = styled.div({
  position: 'absolute',
  top: '1rem',
  right: '1.5rem',
  animation: 'coinBounce 2s ease-in-out infinite',
  '@keyframes coinBounce': {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-5px)' },
  },
})

const ModalBody = styled.div({
  padding: '0.5rem 1.25rem 1rem',
  textAlign: 'center',
})

const ModalTitle = styled.h2({
  margin: 0,
  fontSize: '1.75rem',
  fontWeight: 800,
  color: colors.white,
  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
})

const ModalSubtitle = styled.p({
  margin: '0.25rem 0 1rem',
  fontSize: '0.875rem',
  color: 'rgba(255, 255, 255, 0.85)',
  fontWeight: 500,
})

const StatsCard = styled.div({
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  borderRadius: '0.75rem',
  padding: '0.75rem 1rem',
  textAlign: 'left',
})

const StatsHeader = styled.div({
  fontSize: '0.875rem',
  fontWeight: 700,
  color: colors.neutral[800],
  paddingBottom: '0.5rem',
  marginBottom: '0.5rem',
  borderBottom: `1px solid ${colors.neutral[200]}`,
})

const StatsList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
})

const StatItem = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

const StatLabel = styled.span({
  fontSize: '0.8125rem',
  color: colors.neutral[600],
})

const StatValue = styled.span(({ positive }) => ({
  fontSize: '0.8125rem',
  fontWeight: 600,
  color: positive ? colors.primary[600] : colors.neutral[800],
}))

const CareerPaths = styled.div({
  display: 'flex',
  gap: '0.75rem',
  marginTop: '1rem',
  padding: '0.75rem',
  backgroundColor: 'rgba(0, 0, 0, 0.15)',
  borderRadius: '0.5rem',
})

const CareerPath = styled.div({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.125rem',
})

const CareerTitle = styled.span({
  fontSize: '0.75rem',
  color: 'rgba(255, 255, 255, 0.9)',
  fontWeight: 500,
})

const CareerSalary = styled.span({
  fontSize: '0.875rem',
  fontWeight: 700,
  color: colors.white,
})

const ModalActions = styled.div({
  display: 'flex',
  gap: '0.75rem',
  padding: '0 1.25rem 1.25rem',
  justifyContent: 'center',
})

const CloseButton = styled.button({
  flex: 1,
  padding: '0.75rem 1.5rem',
  border: `2px solid ${colors.neutral[300]}`,
  borderRadius: '2rem',
  backgroundColor: colors.white,
  color: colors.neutral[700],
  fontSize: '0.9375rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: colors.neutral[100],
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
})

const ConfirmButton = styled.button({
  flex: 1,
  padding: '0.75rem 1.5rem',
  border: '2px solid #fbbf24',
  borderRadius: '2rem',
  backgroundColor: '#fef3c7',
  color: colors.neutral[800],
  fontSize: '0.9375rem',
  fontWeight: 700,
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  '&:hover': {
    backgroundColor: '#fde68a',
  },
  '&:active': {
    transform: 'scale(0.98)',
  },
})
//#endregion styled components
