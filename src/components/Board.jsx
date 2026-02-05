import styled from '@emotion/styled'
import { colors, breakpoints } from '@/styles'
import { BOARD_SLOTS } from '@/utils'
import { Slot } from '@/components'

const Board = () => {
  return (
    <BoardWrapper>
      <BoardContainer>
        <TopLane>
          {BOARD_SLOTS.filter((slot) => slot.id < 6).map((slot) => (
            <Slot key={slot.id} id={slot.id} name={slot.name} />
          ))}
        </TopLane>
        <RightLane>
          {BOARD_SLOTS.filter((slot) => slot.id >= 6 && slot.id < 12).map(
            (slot) => (
              <Slot key={slot.id} id={slot.id} name={slot.name} />
            )
          )}
        </RightLane>
        <BottomLane>
          {BOARD_SLOTS.filter((slot) => slot.id >= 12 && slot.id < 18)
            .reverse()
            .map((slot) => (
              <Slot key={slot.id} id={slot.id} name={slot.name} />
            ))}
        </BottomLane>
        <LeftLane>
          {BOARD_SLOTS.filter((slot) => slot.id >= 18)
            .reverse()
            .map((slot) => (
              <Slot key={slot.id} id={slot.id} name={slot.name} />
            ))}
        </LeftLane>
        <CenterArea>
          <CenterTitle>RAT RACE</CenterTitle>
        </CenterArea>
      </BoardContainer>
    </BoardWrapper>
  )
}

export default Board

//#region styled components
const BoardWrapper = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  padding: '0.5rem',
})

const BoardContainer = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  gridTemplateRows: 'repeat(7, 1fr)',
  width: '100%',
  maxWidth: '20rem',
  aspectRatio: '1',
  boxSizing: 'border-box',
  backgroundColor: colors.white,
  borderRadius: '0.75rem',
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  padding: '0.5rem',
  [`@media (min-width: ${breakpoints.sm})`]: {
    maxWidth: '22rem',
    padding: '0.75rem',
  },
  [`@media (min-width: ${breakpoints.md})`]: {
    maxWidth: '26rem',
  },
})

const LaneStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: colors.white,
  fontSize: '1rem',
  fontWeight: 'bold',
  gap: '0.125rem',
}

const TopLane = styled.div({
  ...LaneStyle,
  gridColumn: '1 / 7',
  gridRow: '1 / 2',
})

const RightLane = styled.div({
  ...LaneStyle,
  gridColumn: '7 / 8',
  gridRow: '1 / 7',
  flexDirection: 'column',
})

const BottomLane = styled.div({
  ...LaneStyle,
  gridColumn: '2 / 8',
  gridRow: '7 / 8',
})

const LeftLane = styled.div({
  ...LaneStyle,
  gridColumn: '1 / 2',
  gridRow: '2 / 8',
  flexDirection: 'column',
})

const CenterArea = styled.div({
  gridColumn: '2 / 7',
  gridRow: '2 / 7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: colors.neutral[100],
  borderRadius: '0.5rem',
  margin: '0.25rem',
})

const CenterTitle = styled.span({
  fontSize: '0.875rem',
  fontWeight: 800,
  color: colors.neutral[400],
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  [`@media (min-width: ${breakpoints.md})`]: {
    fontSize: '1.125rem',
  },
})
//#endregion styled components
