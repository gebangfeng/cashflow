import { useEffect, useState, useCallback } from 'react'
import {
  GameContext,
  generatePlayerData,
  getPayday,
  checkLosingCondition,
  getMonthlyLoanPayment,
} from '@/utils'
import PropTypes from 'prop-types'

const GameProvider = ({ children }) => {
  const [actionType, setActionType] = useState('start')
  const [prevSlot, setPrevSlot] = useState(-1)
  const [currentSlot, setCurrentSlot] = useState(0)
  const [playerData, setPlayerData] = useState(generatePlayerData)
  const [card, setCard] = useState(null)
  const [isSellingAssets, setIsSellingAssets] = useState(false)
  const [selectedProfession, setSelectedProfession] = useState(null)

  // Initialize player data from selected profession
  const initializePlayerFromProfession = useCallback((profession) => {
    const newPlayerData = {
      profession: profession.name,
      professionCn: profession.nameCn,
      salary: profession.salary,
      cash: profession.cash,
      childNum: 0,
      incomes: [
        { id: 1, name: `${profession.name} Salary`, amount: profession.salary, type: 'salary' },
      ],
      assets: [],
      liabilities: [...profession.liabilities],
      expenses: [
        { id: 1, name: 'Taxes', amount: Math.floor(profession.salary * 0.18) },
        {
          id: 2,
          name: 'Home Mortgage Payment',
          amount: getMonthlyLoanPayment(profession.liabilities[0]),
        },
        {
          id: 3,
          name: 'Car Loan Payment',
          amount: getMonthlyLoanPayment(profession.liabilities[1]),
        },
        {
          id: 4,
          name: 'Credit Card Payment',
          amount: getMonthlyLoanPayment(profession.liabilities[2]),
        },
        {
          id: 5,
          name: 'Retail Payment',
          amount: getMonthlyLoanPayment(profession.liabilities[3]),
        },
        {
          id: 6,
          name: 'Other Expenses',
          amount: profession.otherExpenses,
        },
      ],
      expensePerChild: profession.expensePerChild,
      diceNum: 1,
      charityTurnLeft: 0,
    }
    setPlayerData(newPlayerData)
    setSelectedProfession(profession)
    setCurrentSlot(0)
    setPrevSlot(-1)
    setActionType('start')
  }, [])

  useEffect(() => {
    if (prevSlot > 0) {
      // > Check if player passes the payday slot with prevSlot (there is a payslot between prevSlot and currentSlot)
      if (
        prevSlot > currentSlot ||
        (prevSlot < 8 && currentSlot >= 8) ||
        (prevSlot < 16 && currentSlot >= 16)
      ) {
        checkLosingCondition(playerData)
      }
      let newCash =
        playerData.cash + getPayday(prevSlot, currentSlot, playerData)
      setPlayerData((data) => ({ ...data, cash: newCash }))
    }
  }, [currentSlot])

  return (
    <GameContext.Provider
      value={{
        actionType,
        setActionType,
        currentSlot,
        setCurrentSlot,
        playerData,
        setPlayerData,
        prevSlot,
        setPrevSlot,
        card,
        setCard,
        isSellingAssets,
        setIsSellingAssets,
        selectedProfession,
        setSelectedProfession,
        initializePlayerFromProfession,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

GameProvider.propTypes = {
  children: PropTypes.node,
}

export default GameProvider
