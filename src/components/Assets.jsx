import styled from '@emotion/styled'
import PropTypes from 'prop-types'
import { currencyFormatter, GameContext } from '@/utils'
import { useContext } from 'react'

const Assets = ({ assets }) => {
  const {
    card,
    isSellingAssets,
    playerData,
    setPlayerData,
    setIsSellingAssets,
    setActionType,
  } = useContext(GameContext)

  const handleSell = (asset) => {
    let newPlayerData = playerData
    const cash =
      asset.unit * card.arg1 - asset.mortgage > 0
        ? asset.unit * card.arg1 - asset.mortgage
        : 0
    newPlayerData.assets = [
      ...newPlayerData.assets.filter((a) => a.id !== asset.id),
    ]
    newPlayerData.cash += cash
    setIsSellingAssets(false)
    setPlayerData(newPlayerData)
    setActionType('start')
  }

  if (!assets || assets.length === 0) {
    return <EmptyState>暂无资产</EmptyState>
  }

  return (
    <List>
      {assets.map((asset) => (
        <ListItem key={asset.id}>
          <ItemInfo>
            <ItemName>
              {asset.quantity >= 1 ? `${asset.quantity}x ` : ''}{asset.name}
            </ItemName>
            <ItemValue>¥{currencyFormatter.format(asset.cost)}</ItemValue>
          </ItemInfo>
          {isSellingAssets && asset.type === card?.type && asset.subtype === card?.subtype && (
            <SellButton onClick={() => handleSell(asset)}>
              出售
            </SellButton>
          )}
        </ListItem>
      ))}
    </List>
  )
}

Assets.propTypes = {
  assets: PropTypes.array,
}

export default Assets

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

const ItemInfo = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  flex: 1,
  gap: '8px',
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
  color: '#06b6d4',
  fontSize: '12px',
  fontWeight: 600,
})

const SellButton = styled.button({
  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '4px 8px',
  fontSize: '11px',
  fontWeight: 600,
  cursor: 'pointer',
  marginLeft: '8px',
  '&:active': {
    transform: 'scale(0.95)',
  },
})

const EmptyState = styled.div({
  color: 'rgba(255, 255, 255, 0.4)',
  fontSize: '12px',
  textAlign: 'center',
  padding: '16px',
})
//#endregion styled components
