import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { useContext, useEffect, useState } from 'react'
import { GameContext } from '@/utils'
import { breakpoints } from '@/styles/styles'

const Slot = ({ id, name }) => {
  const [url, setUrl] = useState(null)
  const { currentSlot } = useContext(GameContext)
  const isActive = currentSlot === id

  const updateSlotUI = (slotName) => {
    switch (slotName) {
      case 'Payday':
        setUrl(
          isActive
            ? '/assets/images/payday-visited.png'
            : '/assets/images/payday.png'
        )
        break
      case 'Opportunity':
        setUrl(
          isActive
            ? '/assets/images/opportunity-visited.png'
            : '/assets/images/opportunity.png'
        )
        break
      case 'Market':
        setUrl(
          isActive
            ? '/assets/images/market-visited.png'
            : '/assets/images/market.png'
        )
        break
      case 'Doodads':
        setUrl(
          isActive
            ? '/assets/images/doodads-visited.png'
            : '/assets/images/doodads.png'
        )
        break
      case 'Baby':
        setUrl(
          isActive
            ? '/assets/images/baby-visited.png'
            : '/assets/images/baby.png'
        )
        break
      case 'Downsized':
        setUrl(
          isActive
            ? '/assets/images/downsized-visited.png'
            : '/assets/images/downsized.png'
        )
        break
      default:
        setUrl(
          isActive
            ? '/assets/images/charity-visited.png'
            : '/assets/images/charity.png'
        )
        break
    }
  }
  useEffect(() => {
    updateSlotUI(name)
  }, [id, name, currentSlot])

  return (
    <SlotWrapper isActive={isActive}>
      <StyleImg src={url} alt={name} />
    </SlotWrapper>
  )
}

//#region Props Type
Slot.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
}
//#endregion Props Type

export default Slot

//#region styled components
const SlotWrapper = styled.div(({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.125rem',
  borderRadius: '0.375rem',
  transition: 'all 0.2s ease',
  transform: isActive ? 'scale(1.1)' : 'scale(1)',
  filter: isActive ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' : 'none',
}))

const StyleImg = styled.img({
  width: '2.25rem',
  height: '2.25rem',
  objectFit: 'contain',
  [`@media (min-width: ${breakpoints.sm})`]: {
    width: '2.75rem',
    height: '2.75rem',
  },
  [`@media (min-width: ${breakpoints.md})`]: {
    width: '3.25rem',
    height: '3.25rem',
  },
})
//#endregion
