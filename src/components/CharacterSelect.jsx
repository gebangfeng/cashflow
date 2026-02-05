import styled from '@emotion/styled'
import { colors, breakpoints } from '@/styles'
import { PROFESSIONS, PROFESSION_TIERS, currencyFormatter } from '@/utils'
import PropTypes from 'prop-types'

const CharacterSelect = ({ onSelect, onBack }) => {
  // Group professions by tier
  const professionsByTier = PROFESSION_TIERS.map(tier => ({
    ...tier,
    professions: PROFESSIONS.filter(p => p.tier === tier.level)
  }))

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
                  onClick={() => tier.unlocked && onSelect(profession)}
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
  '&:hover': {
    backgroundColor: colors.primary[600],
    transform: 'scale(1.05)',
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
})
//#endregion styled components
