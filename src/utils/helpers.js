import { createTheme } from '@mui/material'
import Swal from 'sweetalert2'

//#region 游戏辅助方法
/**
 * 数字格式化实例，用于将数字转为货币格式的字符串
 * 示例: currencyFormatter.format(1000) -> 1,000
 */
export const currencyFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  useGrouping: true,
})
/**
 * 计算负债项的月还款金额
 * 负债参数的结构
 *    ? 金额(amount)
 *    ? 类型(type)
 * @param {*} liability 负债对象
 * @returns 月还款金额
 */
export const getMonthlyLoanPayment = (liability) => {
  if (liability.amount === 0) {
    return 0
  }
  /**
   * 房贷/车贷 计算公式
   * M = ( P * r * (1+r)^n ) / ( (1 + r)^n - 1 )
   * M: 月还款额
   * r: 月利率（%）
   * P: 贷款本金
   * n: 贷款期限（月）
   *
   * 信用卡/消费贷/银行贷款 计算公式
   * M = P * r
   */
  let r, n, M
  let P = liability.amount
  switch (liability.type) {
    case 'home':
      r = LOAN_DETAILS.HOME.monthly_interest / 100
      n = LOAN_DETAILS.HOME.loan_term
      M = Math.floor((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
      break
    case 'car':
      r = LOAN_DETAILS.CAR.monthly_interest / 100
      n = LOAN_DETAILS.CAR.loan_term
      M = Math.floor((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1))
      break
    case 'credit':
      r = LOAN_DETAILS.CREDIT.monthly_interest / 100
      M = Math.floor(P * r)
      break
    case 'retail':
      r = LOAN_DETAILS.RETAIL.monthly_interest / 100
      M = Math.floor(P * r)
      break
    case 'bank':
      r = LOAN_DETAILS.BANK.monthly_interest / 100
      M = Math.floor(P * r)
      break
    default:
      return 0
  }
  return parseInt(M.toFixed())
}

/**
 * 根据骰子数量，返回所有骰子的点数总和
 * 单个骰子最小值1，最大值6
 * @param {*} diceNo 可选参数，骰子数量，不传默认值为1
 * @returns 所有骰子的点数总和
 */
export const rollDice = (diceNo = 1) => {
  const min = diceNo
  const max = diceNo * 6 + 1
  const moves = Math.floor(Math.random() * (max - min) + min)
  return moves
}

/**
 * 播放掷骰子的音效
 */
export const playSFX = (url) => {
  const sfx = new Audio(url)
  sfx.play().catch((err) => console.log(err))
}

/**
 * 游戏开始时生成玩家初始数据
 * @returns 玩家初始数据对象
 */
export const generatePlayerData = () => {
  const id = Math.floor(Math.random() * (PROFESSIONS.length - 1))
  const p = PROFESSIONS[id] // 为玩家随机分配职业
  const playerData = {
    profession: p.name,
    salary: p.salary,
    cash: p.cash,
    childNum: 0,
    incomes: [
      { id: 1, name: `${p.name}薪资`, amount: p.salary, type: 'salary' },
    ],
    assets: [],
    liabilities: [...p.liabilities],
    expenses: [
      { id: 1, name: '税费', amount: p.salary * 0.18 },
      {
        id: 2,
        name: '房屋按揭还款',
        amount: getMonthlyLoanPayment(p.liabilities[0]),
      },
      {
        id: 3,
        name: '汽车贷款还款',
        amount: getMonthlyLoanPayment(p.liabilities[1]),
      },
      {
        id: 4,
        name: '信用卡还款',
        amount: getMonthlyLoanPayment(p.liabilities[2]),
      },
      {
        id: 5,
        name: '消费贷还款',
        amount: getMonthlyLoanPayment(p.liabilities[3]),
      },
      {
        id: 6,
        name: '其他开支',
        amount: p.otherExpenses,
      },
    ],
    expensePerChild: p.expensePerChild,
    diceNum: 1,
    charityTurnLeft: 0,
  }
  return playerData
}

/**
 * 根据资产列表计算被动收入总额
 * @param {*} assets 资产列表
 * 资产对象结构
 *    ? 编号(id):
 *    ? 名称(name): 资产名称
 *    ? 类型(type): 资产类型（股票/房产/黄金/生意）
 *    ? 金额(amount)
 */
export const getPassiveIncome = (incomes) => {
  if (incomes.length === 0) {
    return 0
  }
  return incomes
    .filter((income) => income.type !== 'salary')
    .reduce((total, income) => total + income.amount, 0)
}

/**
 * 计算玩家的月收入总额
 * @param {*} data 包含玩家财务数据的对象
 * @returns 玩家月收入总额
 */
export const getTotalIncomeAmount = (data) => {
  return data.incomes.reduce((total, income) => total + income.amount, 0)
}

/**
 * 计算玩家的月支出总额
 * @param {*} data 包含玩家财务数据的对象
 * @returns 玩家月支出总额
 */
export const getTotalExpenseAmount = (data) => {
  return data.expenses.reduce((total, expense) => total + expense.amount, 0)
}

/**
 * 计算玩家经过棋盘上「发薪日」格子可获得的资金
 * @param {*} lastPos 玩家上一步所在的格子编号
 * @param {*} currentPos 玩家即将落地的格子编号
 * @param {*} playerData 玩家的游戏数据对象
 * @returns 玩家可获得的发薪资金
 */
export const getPayday = (lastPos, currentPos, playerData) => {
  let totalIncome = getTotalIncomeAmount(playerData)
  let totalExpense = getTotalExpenseAmount(playerData)

  let paydaySlotsCount
  // 边界情况：上一步位置编号 > 当前位置编号（绕棋盘一周）
  if (lastPos > currentPos) {
    paydaySlotsCount =
      BOARD_SLOTS.filter(
        (s) => s.id > lastPos && s.id <= 23 && s.type === 'payday'
      ).length +
      BOARD_SLOTS.filter(
        (s) => s.id >= 0 && s.id <= currentPos && s.type === 'payday'
      ).length
  } else {
    // 常规情况：上一步位置编号 < 当前位置编号
    paydaySlotsCount = BOARD_SLOTS.filter(
      (s) => s.id > lastPos && s.id <= currentPos && s.type === 'payday'
    ).length
  }
  return (totalIncome - totalExpense) * paydaySlotsCount
}

/**
 * 计算玩家需要向银行借贷的金额
 * @param {*} diff 玩家现金与某笔支出的差额
 * @returns 玩家需要借贷的金额（按1000的整数倍计算）
 */
export const getLoanAmount = (diff) => {
  if (diff < 1000) {
    return 1000
  }
  return Math.ceil(diff / 1000) * 1000
}

/**
 * 抽取对应类型的游戏卡牌
 * @param {*} type 卡牌类型（日常消费/机会/市场）
 * @param {*} isBigOpportunity 是否为大机会牌，仅在玩家落在「机会」格子时生效
 * @returns 随机抽取的卡牌
 */
export const drawCard = (type, isBigOpportunity = false) => {
  let card = null
  switch (type) {
    case 'doodads':
      card = DOODADS[Math.floor(Math.random() * DOODADS.length)]
      break
    case 'opportunity':
      if (isBigOpportunity) {
        card = BIG_DEALS[Math.floor(Math.random() * BIG_DEALS.length)]
      } else {
        card = SMALL_DEALS[Math.floor(Math.random() * SMALL_DEALS.length)]
      }
      break
    case 'market':
      card = MARKETS[Math.floor(Math.random() * MARKETS.length)]
      break
    default:
      break
  }
  return card
}

/**
 * 玩家申请贷款，并返回更新后的玩家数据
 * @param {*} playerData 玩家当前的游戏数据对象
 * @param {*} cost 拟购买资产的花费
 * @returns 贷款后的新玩家数据
 */
export const takeLoan = (playerData, cost) => {
  let loanAmount = getLoanAmount(cost - playerData.cash)
  playerData.cash += loanAmount - cost
  let idx = playerData.liabilities.findIndex((l) => l.name === '银行贷款')
  if (idx > -1) {
    playerData.liabilities[idx].amount += loanAmount
    playerData.expenses.find((e) => e.name === '银行贷款还款').amount +=
      loanAmount * 0.1
  } else {
    playerData.liabilities.push({
      id:
        playerData.liabilities.length === 0
          ? 1
          : playerData.liabilities.at(-1).id + 1,
      name: '银行贷款',
      amount: loanAmount,
      type: 'bank',
    })
    playerData.expenses.push({
      id: playerData.expenses.length + 1,
      name: '银行贷款还款',
      amount: loanAmount * 0.1,
    })
  }
  return playerData
}

/**
 * 根据玩家当前数据，检查是否达成游戏胜利条件
 * 胜利条件：被动收入 > 总支出，达成后：
 *    弹出恭喜弹窗，包含「开始新游戏」按钮
 * @param {*} data 玩家数据对象
 */
export const checkWinningCondition = (data) => {
  let passiveIncome = getPassiveIncome(data.incomes)
  let totalExpense = getTotalExpenseAmount(data)
  if (passiveIncome > totalExpense) {
    Swal.fire({
      title: '恭喜你！',
      text: '你的被动收入现已超过总支出，成功走出老鼠赛跑，开启梦想人生！',
      imageUrl: 'https://cdn-icons-png.flaticon.com/128/9281/9281540.png',
      imageWidth: 96,
      imageHeight: 96,
      imageAlt: '老鼠赛跑 - 胜利',
      confirmButtonText: '开始新游戏',
      allowOutsideClick: false,
    }).then(() => {
      window.location.reload() // 刷新浏览器开始新游戏
    })
  }
}

/**
 * 检查玩家是否达成游戏失败条件
 * 失败条件：经过发薪日格子时，总支出 > 总收入且现金不足以弥补差额，达成后：
 *    弹出失败提示弹窗，包含「开始新游戏」按钮
 * @param {*} data 玩家数据对象
 */
export const checkLosingCondition = (data) => {
  const expenses = getTotalExpenseAmount(data)
  const incomes = getTotalIncomeAmount(data)
  if (expenses > incomes && data.cash < expenses - incomes) {
    setTimeout(() => {
      playSFX('/assets/sounds/gameover.mp3')
      Swal.fire({
        title: '游戏结束！',
        text: '你的月现金流为负，已正式退出游戏。',
        imageUrl: 'https://cdn-icons-png.flaticon.com/128/9995/9995982.png',
        imageWidth: 96,
        imageHeight: 96,
        imageAlt: '失败',
        confirmButtonText: '开始新游戏',
        allowOutsideClick: false,
      }).then(() => {
        window.location.reload()
      })
    }, 400)
  }
}

//#endregion 游戏辅助方法

//#region 游戏数据

//#region 贷款详情
// 游戏中各类型贷款的固定配置信息
export const LOAN_DETAILS = {
  HOME: {
    loan_term: 240, // 贷款期限（月）
    monthly_interest: 0.9, // 月利率（%）
  },
  CAR: {
    loan_term: 60,
    monthly_interest: 0.8,
  },
  CREDIT: {
    monthly_interest: 3,
  },
  RETAIL: {
    monthly_interest: 5,
  },
  BANK: {
    monthly_interest: 10,
  },
}
//#endregion 贷款详情

//#region 棋盘格子
export const BOARD_SLOTS = [
  { id: 0, name: '发薪日', type: 'payday' },
  { id: 1, name: '机会', type: 'opportunity' },
  { id: 2, name: '市场', type: 'market' },
  { id: 3, name: '机会', type: 'opportunity' },
  { id: 4, name: '日常消费', type: 'doodads' },
  { id: 5, name: '机会', type: 'opportunity' },
  { id: 6, name: '添丁', type: 'baby' },
  { id: 7, name: '机会', type: 'opportunity' },
  { id: 8, name: '发薪日', type: 'payday' },
  { id: 9, name: '机会', type: 'opportunity' },
  { id: 10, name: '市场', type: 'market' },
  { id: 11, name: '机会', type: 'opportunity' },
  { id: 12, name: '日常消费', type: 'doodads' },
  { id: 13, name: '机会', type: 'opportunity' },
  { id: 14, name: '失业', type: 'downsized' },
  { id: 15, name: '机会', type: 'opportunity' },
  { id: 16, name: '发薪日', type: 'payday' },
  { id: 17, name: '机会', type: 'opportunity' },
  { id: 18, name: '市场', type: 'market' },
  { id: 19, name: '机会', type: 'opportunity' },
  { id: 20, name: '日常消费', type: 'doodads' },
  { id: 21, name: '机会', type: 'opportunity' },
  { id: 22, name: '慈善', type: 'charity' },
  { id: 23, name: '机会', type: 'opportunity' },
]
//#endregion 棋盘格子

//#region 日常消费卡
export const DOODADS = [
  {
    id: 1,
    title: '热水器漏水',
    description: '花费450元更换新热水器',
    info: '',
    cost: 450,
  },
  {
    id: 2,
    title: '外出就餐',
    description: '花费80元',
    info: '',
    cost: 80,
  },
  {
    id: 3,
    title: '结婚纪念日！',
    description: '花费200元庆祝',
    cost: 0,
  },
  {
    id: 4,
    title: '占用残疾人车位',
    description: '缴纳100元罚款',
    info: '',
    cost: 100,
  },
  {
    id: 5,
    title: '购买大屏电视',
    description: '花费2000元',
    info: '',
    cost: 2000,
  },
  {
    id: 6,
    title: '儿子的大学学费',
    description: '花费1500元',
    info: '（如有子女则触发）',
    cost: 1500,
  },
  {
    id: 7,
    title: '给孩子买玩具',
    description: '花费50元',
    info: '',
    cost: 50,
  },
  {
    id: 8,
    title: '购买新鱼竿',
    description: '花费100元',
    info: '',
    cost: 100,
  },
  {
    id: 9,
    title: '打两场高尔夫',
    description: '花费100元',
    info: '',
    cost: 100,
  },
  {
    id: 10,
    title: '汽车空调损坏',
    description: '花费700元维修',
    info: '',
    cost: 700,
  },
  {
    id: 11,
    title: '税务稽查',
    description: '向税务局缴纳350元',
    info: '太倒霉了！',
    cost: 350,
  },
  {
    id: 12,
    title: '购物狂欢！',
    description: '花费350元买漂亮衣服',
    info: '',
    cost: 350,
  },
  {
    id: 13,
    title: '家庭旅行！',
    description: '花费2000元',
    info: '',
    cost: 2000,
  },
  {
    id: 14,
    title: '去赌场！',
    description: '赌桌输了200元',
    info: '',
    cost: 200,
  },
  {
    id: 15,
    title: '购买新游戏机',
    description: '',
    info: '花费400元',
    cost: 400,
  },
  {
    id: 16,
    title: '买幸运数字彩票！',
    description: '亏了100元',
    info: '',
    cost: 100,
  },
  {
    id: 17,
    title: '疯狂购物！',
    description: '花费250元',
    info: '',
    cost: 250,
  },
  {
    id: 18,
    title: '去看球赛',
    description: '花费50元',
    info: '',
    cost: 50,
  },
  {
    id: 19,
    title: '看牙医',
    description: '补牙花费100元',
    info: '',
    cost: 0,
  },
  {
    id: 20,
    title: '购买新网球拍',
    description: '花费50元',
    info: '',
    cost: 50,
  },
  {
    id: 21,
    title: '家具促销',
    description: '花费300元',
    info: '换掉还能用的旧桌子',
    cost: 300,
  },
  {
    id: 22,
    title: '去看演唱会',
    description: '晚餐、门票、咖啡总共花费180元',
    info: '',
    cost: 180,
  },
  {
    id: 23,
    title: '购买新智能手机',
    description: '花1200元买苹果手机',
    info: '',
    cost: 1200,
  },
  {
    id: 24,
    title: '去咖啡馆',
    description: '花费10元',
    info: '和朋友各点一杯拿铁和卡布奇诺',
    cost: 10,
  },
  {
    id: 25,
    title: '高中同学聚会',
    description: '花费250元',
    info: '',
    cost: 250,
  },
  {
    id: 26,
    title: '房屋重新刷漆',
    description: '花费600元',
    info: '',
    cost: 600,
  },
  {
    id: 27,
    title: '购买画作',
    description: '花费200元',
    info: '没忍住买了本地艺术家的新作',
    cost: 200,
  },
  {
    id: 28,
    title: '给父母买礼物',
    description: '给爸妈买一台全新的按摩仪',
    info: '',
    cost: 1000,
  },
  {
    id: 29,
    title: '网飞高级会员',
    description: '花费150元订阅',
    info: '',
    cost: 150,
  },
  {
    id: 30,
    title: '购买新蓝牙耳机',
    description: '花费500元',
    info: '',
    cost: 500,
  },
  {
    id: 31,
    title: '生日！',
    description: '带家人去游乐园，花费100元',
    info: '',
    cost: 100,
  },
  {
    id: 32,
    title: '购买咖啡机',
    description: '花费150元',
    info: '',
    cost: 150,
  },
  {
    id: 33,
    title: '好友结婚',
    description: '花费2000元随礼/庆祝',
    info: '',
    cost: 2000,
  },
  {
    id: 34,
    title: '购买新衣服',
    description: '花费250元',
    info: '老婆被电影种草，需要买新衣服',
    cost: 250,
  },
  {
    id: 35,
    title: '裁员传闻',
    description: '花费220元报课买书',
    info: '重返校园提升技能',
    cost: 220,
  },
  {
    id: 36,
    title: '去看航展',
    description: '花费120元',
    info: '',
    cost: 120,
  },
  {
    id: 37,
    title: '必须买新墨镜',
    description: '花费70元',
    info: '',
    cost: 70,
  },
  {
    id: 38,
    title: '购买新厨具',
    description: '花费250元',
    info: '',
    cost: 250,
  },
  {
    id: 39,
    title: '和朋友吃午餐',
    description: '花费40元',
    info: '',
    cost: 40,
  },
  {
    id: 40,
    title: '汽车需要换轮胎',
    description: '花费300元',
    info: '',
    cost: 30,
  },
]
//#endregion 日常消费卡

//#region 小机会卡
/**
 * 类型：股票/基金
 *   ? 参数1: 单价
 *   ? 参数2: 最低交易数
 *   ? 参数3: 最高交易数
 *
 * 类型：优先股
 *   ? 参数1: 单价
 *   ? 参数2: 最低交易数
 *   ? 参数3: 最高交易数
 *   ? 参数4: 股息
 *
 * 类型：房产
 *   ? 参数1: 总价
 *   ? 参数2: 首付
 *   ? 参数3: 按揭贷款
 *   ? 参数4: 现金流
 *   ? 参数5: 套数/面积单位
 */
export const SMALL_DEALS = [
  {
    id: 1,
    title: '共同基金 - 美国成长4号基金',
    description: '低利率推动市场走高，基金表现亮眼',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 30,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 2,
    title: '共同基金 - 美国成长4号基金',
    description:
      '天才年轻基金经理掌舵，所有人都认为他有点石成金的能力',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 20,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 3,
    title: '共同基金 - 美国成长4号基金',
    description: '多数公司业绩不佳，导致基金价格走低',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 10,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 4,
    title: '共同基金 - 美国成长4号基金',
    description: '市场行情火爆，基金价格创历史新高',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 40,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 5,
    title: '共同基金 - 美国成长4号基金',
    description: '市场整体向好，管理优秀的基金价格大幅上涨',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 30,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 6,
    title: '股票 - 美特优电子有限公司',
    description: '市场繁荣，这家家电零售商股价创纪录',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 40,
    arg2: 5,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 7,
    title: '股票 - 美特优电子有限公司',
    description: '高通胀导致这家家电零售商股价低迷',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 5,
    arg2: 5,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 8,
    title: '股票 - 美特优电子有限公司',
    description: '公司重组！过度扩张和经济衰退导致巨额亏损，股东持股比例缩水一半',
    info: '1股并2股（反向拆股）',
    type: 'stock-split',
    subtype: null,
    arg1: true, // true=反向拆股，false=正向拆股
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 9,
    title: '股票 - 美特优电子有限公司',
    description: '利率高企，这家家电零售商股价表现不佳',
    info: '',
    type: 'stock',
    arg1: 5,
    arg2: 5,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 10,
    title: '股票 - 美特优电子有限公司',
    description: '市场走强，这家家电零售商股价上涨',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 30,
    arg2: 5,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 11,
    title: '股票 - 美特优电子有限公司',
    description: '业务大幅增长，公司发展向好，股票刚刚完成拆股！',
    info: '2股拆1股（正向拆股）',
    type: 'stock-split',
    subtype: null,
    arg1: false,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 12,
    title: '股票 - 美特优电子有限公司',
    description: '贸易战恐慌，这家家电零售商股价创历史新低',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 1,
    arg2: 5,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 13,
    title: '股票 - 美特优电子有限公司',
    description: '市场低迷，这家家电零售商股价下跌',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 10,
    arg2: 5,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 14,
    title: '股票 - 美特优电子有限公司',
    description: '由32岁哈佛毕业生掌舵的家电零售新锐，业务高速增长',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 20,
    arg2: 5,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 15,
    title: '股票 - 美特优电子有限公司',
    description: '低利率推动，这家家电零售商股价大幅上涨',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 30,
    arg2: 5,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 16,
    title: '租客损坏房产',
    description:
      '租客拖欠2个月房租后跑路，还损坏了出租屋。保险覆盖大部分损失，但你仍需自付500元',
    info: '若拥有出租房产，支付500元（银行可按常规条款放贷）',
    type: 'estate-auto',
    subtype: null,
    arg1: 500,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 17,
    title: '股票 - 奥凯优制药有限公司',
    description: '市场走强，这家老牌制药企业股价走高',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 40,
    arg2: 5,
    arg3: 40,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 18,
    title: '股票 - 奥凯优制药有限公司',
    description: '低通胀，这家老牌制药企业股价走高',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 20,
    arg2: 5,
    arg3: 40,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 19,
    title: '股票 - 奥凯优制药有限公司',
    description: '公司经营不善！药品污染丑闻导致巨额亏损，所有股东持股比例缩水一半',
    info: '1股并2股（反向拆股）',
    type: 'stock-split',
    subtype: null,
    arg1: true,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 20,
    title: '股票 - 奥凯优制药有限公司',
    description: '市场繁荣，这家老牌制药企业股价大涨',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 50,
    arg2: 5,
    arg3: 40,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 21,
    title: '股票 - 奥凯优制药有限公司',
    description: '高利率拖累，这家老牌制药企业股价低迷',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 5,
    arg2: 5,
    arg3: 40,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 22,
    title: '股票 - 奥凯优制药有限公司',
    description: '高利率导致这家老牌制药企业股价表现不佳',
    info: '',
    type: '',
    arg1: 10,
    arg2: 5,
    arg3: 40,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 23,
    title: '股票 - 奥凯优制药有限公司',
    description: '通胀担忧，这家老牌制药企业股价走低',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 10,
    arg2: 5,
    arg3: 40,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 24,
    title: '股票 - 奥凯优制药有限公司',
    description: '市场恐慌，这家老牌制药企业股价暴跌',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 1,
    arg2: 5,
    arg3: 40,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 25,
    title: '股票 - 奥凯优制药有限公司',
    description: '老牌制药企业，主打70岁以上人群用药',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 30,
    arg2: 5,
    arg3: 40,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 26,
    title: '股票 - 奥凯优制药有限公司',
    description: '公司发展势头良好，股票刚刚完成拆股！所有股东持股数量翻倍',
    info: '2股拆1股（正向拆股）',
    type: 'stock-split',
    arg1: false,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 27,
    title: '股票 - 昂途娱乐有限公司',
    description: '儿童板块票房大卖，股价创纪录',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 40,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 28,
    title: '股票 - 昂途娱乐有限公司',
    description: '经典电影视频库需求旺盛，股价表现良好',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 30,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 29,
    title: '股票 - 昂途娱乐有限公司',
    description: '儿童板块票房大卖，股价创纪录',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 40,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 30,
    title: '股票 - 昂途娱乐有限公司',
    description: '经典电影视频库需求旺盛，股价表现良好',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 30,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 31,
    title: '股票 - 昂途娱乐有限公司',
    description: '新任影视采购总监上任，股价前景向好',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 20,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 32,
    title: '股票 - 昂途娱乐有限公司',
    description: '连续三部大片票房扑街，采购总监被解雇，股价大跌，董事长奖金取消',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 5,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 33,
    title: '股票 - 昂途娱乐有限公司',
    description: '成人板块票房爆款，股价上涨',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 30,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 34,
    title: '股票 - 昂途娱乐有限公司',
    description: '近期合并提升了行业份额，龙头企业前景良好',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 20,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 35,
    title: '股票 - 昂途娱乐有限公司',
    description: '最新主题公园巨额亏损，股价创历史新低',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 10,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 36,
    title: '股票 - 昂途娱乐有限公司',
    description: '核心板块音乐大片票房惨淡，股价表现不佳',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 10,
    arg2: 10,
    arg3: 30,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 37,
    title: '优先股 - 双巨电力公司',
    description: '国内大型电力公司高收益优先股，股息和价格由州公用事业委员会核定为合理水平',
    info: '',
    type: 'stock',
    subtype: null,
    arg1: 1200,
    arg2: 1200,
    arg3: 1200,
    arg4: 10,
    arg5: 0,
  },
  {
    id: 38,
    title: '3室2厅住宅',
    description: '政府机构收回的老旧3室2厅住宅，可享政府融资，已有租客，拎包可投',
    info: '',
    type: 'estate',
    subtype: 'house32',
    arg1: 35000, // 总价
    arg2: 2000, // 首付
    arg3: 33000, // 按揭贷款
    arg4: 220, // 现金流
    arg5: 1,
  },
  {
    id: 39,
    title: '3室2厅住宅',
    description: '企业转让高管的3室2厅住宅，目前无租客，已挂牌6个月，刚降价',
    info: '',
    type: 'estate',
    subtype: 'house32',
    arg1: 45000,
    arg2: 2000,
    arg3: 43000,
    arg4: 250,
    arg5: 1,
  },
  {
    id: 40,
    title: '出售公寓 - 2室1厅',
    description:
      '业主结婚转让2室1厅公寓，地段一般，需要翻新',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house21',
    arg1: 50000,
    arg2: 5000,
    arg3: 45000,
    arg4: 100,
    arg5: 1,
  },
  {
    id: 41,
    title: '出售公寓 - 2室1厅',
    description: '父母出售子女在大学城的2室1厅公寓，该区域租房需求旺盛',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house21',
    arg1: 40000,
    arg2: 4000,
    arg3: 36000,
    arg4: 140,
    arg5: 1,
  },
  {
    id: 42,
    title: '出售公寓 - 2室1厅',
    description:
      '年轻夫妇因家庭人口增加，计划换3室2厅住宅，转让老旧2室1厅公寓，即将可交易',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house21',
    arg1: 55000,
    arg2: 5000,
    arg3: 50000,
    arg4: 160,
    arg5: 1,
  },
  {
    id: 43,
    title: '出售公寓 - 2室1厅',
    description: '业主事业成功，转让精装2室1厅公寓，欲置换更高端房产，你也可以',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house21',
    arg1: 60000,
    arg2: 5000,
    arg3: 55000,
    arg4: -100,
    arg5: 1,
  },
  {
    id: 44,
    title: '出售公寓 - 2室1厅',
    description: '银行法拍房！位于就业和商业核心区的优质2室1厅公寓，可出价，银行提供优惠融资',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house21',
    arg1: 40000,
    arg2: 5000,
    arg3: 35000,
    arg4: 220,
    arg5: 1,
  },
  {
    id: 45,
    title: '出售住宅 - 3室2厅',
    description: '银行法拍房，空置6个月刚降价，贷款包含预估维修费用',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 50000,
    arg2: 0,
    arg3: 50000,
    arg4: 100,
    arg5: 1,
  },
  {
    id: 46,
    title: '出售住宅 - 3室2厅',
    description: '业主突发异地调动，3室2厅住宅低首付转让，慧眼识珠者可获高回报',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 50000,
    arg2: 3000,
    arg3: 47000,
    arg4: 100,
    arg5: 1,
  },
  {
    id: 47,
    title: '出售住宅 - 3室2厅',
    description: '公路局转让老城区3室2厅住宅，市场暴跌，上周拍卖流拍',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 50000,
    arg2: 0,
    arg3: 50000,
    arg4: -100,
    arg5: 1,
  },
  {
    id: 48,
    title: '出售住宅 - 3室2厅',
    description: '业主离世，遗产处置转让精装3室2厅出租房，老房子保养良好，已有租客',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 65000,
    arg2: 5000,
    arg3: 60000,
    arg4: 160,
    arg5: 1,
  },
  {
    id: 49,
    title: '出售住宅 - 3室2厅',
    description: '裁员潮导致市场低迷，3室2厅住宅转让，适合长期投资客',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 50000,
    arg2: 4000,
    arg3: 46000,
    arg4: 200,
    arg5: 1,
  },
  {
    id: 50,
    title: '_raw土地10英亩',
    description: '未开发区域10英亩原生态地块，临溪流，公园式环境，无道路、无配套、无噪音',
    info: '可自用或转售给其他玩家',
    type: 'land',
    subtype: null,
    arg1: 5000, // 总价
    arg2: 5000, // 首付
    arg3: 0,
    arg4: 0,
    arg5: 1,
  },
  {
    id: 51,
    title: '稀有金币',
    description: '在跳蚤市场发现一枚品相良好的16世纪西班牙新世界（仅限哈瓦那铸币厂）八里亚尔金币，仅此一枚，卖家喊价500元',
    info: '可自用或转售给其他玩家',
    type: 'gold',
    subtype: null,
    arg1: 500, // 总价
    arg2: 500, // 首付
    arg3: 0,
    arg4: 0,
    arg5: 1,
  },
]
//#endregion 小机会卡

//#region 大机会卡
/**
 * 大机会卡结构
 *
 * 房产类
 *   ? 参数1: 总价
 *   ? 参数2: 首付
 *   ? 参数3: 按揭贷款
 *   ? 参数4: 现金流
 *   ? 参数5: 0
 */
export const BIG_DEALS = [
  {
    id: 1,
    title: '8户联排公寓出售',
    description:
      '再投资的业主以合理价格出售8户联排公寓，融资已到位，仅需你支付首付',
    info: '可自用或转售给其他玩家，投资回报率51%，转售价可达20万-28万元',
    type: 'estate',
    subtype: 'plex',
    arg1: 220000,
    arg2: 40000,
    arg3: 180000,
    arg4: 1700,
    arg5: 8,
  },
  {
    id: 2,
    title: '8户联排公寓出售',
    description:
      '企业主急需现金挽救合伙生意，出售8户联排公寓回笼资金，慧眼者可把握良机',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 160000,
    arg2: 32000,
    arg3: 128000,
    arg4: 1700,
    arg5: 8,
  },
  {
    id: 3,
    title: '8户联排公寓出售',
    description:
      '退休投资者按当前评估价出售8户联排公寓，含专业草坪维护和管理服务，账目齐全',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 240000,
    arg2: 40000,
    arg3: 200000,
    arg4: 950,
    arg5: 8,
  },
  {
    id: 4,
    title: '8户联排公寓出售',
    description:
      '业主涉法被迫出售8户联排公寓，贷款无需资质审核，抵押权人配合交易',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 200000,
    arg2: 40000,
    arg3: 160000,
    arg4: 1600,
    arg5: 8,
  },
  {
    id: 5,
    title: '4户联排公寓出售',
    description:
      '异地业主财务困境，多年欠税，4户联排公寓被迫出售，部分账目可查',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 80000,
    arg2: 16000,
    arg3: 64000,
    arg4: 750,
    arg5: 4,
  },
  {
    id: 6,
    title: '4户联排公寓出售',
    description:
      '业主因欠缴个税被强制执行，4户联排公寓项目出售',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 80000,
    arg2: 20000,
    arg3: 60000,
    arg4: 400,
    arg5: 4,
  },
  {
    id: 7,
    title: '4户联排公寓出售',
    description:
      '紧邻新高速的老旧4户联排公寓出售，业主/自住者欲迁往安静区域，低价急售',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 90000,
    arg2: 15000,
    arg3: 75000,
    arg4: 500,
    arg5: 4,
  },
  {
    id: 8,
    title: '4户联排公寓出售',
    description:
      '业主迁居外地，自售4户联排公寓，账目齐全、满租、优质地段租客流动率低',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 140000,
    arg2: 32000,
    arg3: 108000,
    arg4: 2000,
    arg5: 4,
  },
  {
    id: 9,
    title: '4户联排公寓出售',
    description:
      '优质地段精装4户联排公寓，租客稳定、现金流为正、问题少，账目齐全',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 125000,
    arg2: 15000,
    arg3: 110000,
    arg4: 600,
    arg5: 4,
  },
  {
    id: 10,
    title: '4户联排公寓出售',
    description:
      '复苏期区域4户联排公寓，满租、维护到位，需你的首付和耐心等待升值',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 100000,
    arg2: 20000,
    arg3: 80000,
    arg4: 800,
    arg5: 4,
  },
  {
    id: 11,
    title: '3室2厅住宅出售',
    description:
      '业主离婚出售3室2厅住宅，该区域以自住为主，已挂牌5个月',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 70000,
    arg2: 20000,
    arg3: 50000,
    arg4: 500,
    arg5: 1,
  },
  {
    id: 12,
    title: '3室2厅住宅出售',
    description:
      '3室2厅住宅长期投资潜力大，尽管当前租金低迷，仍可实现正现金流',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 65000,
    arg2: 8000,
    arg3: 57000,
    arg4: 300,
    arg5: 1,
  },
  {
    id: 13,
    title: '3室2厅住宅出售',
    description:
      '高尔夫球场旁3室2厅住宅，兼具增值潜力和稳定现金流，租金可观、融资优惠',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 75000,
    arg2: 7000,
    arg3: 68000,
    arg4: 300,
    arg5: 1,
  },
  {
    id: 14,
    title: '3室2厅住宅出售',
    description:
      '商人清算3室2厅住宅，急需现金挽救生意，目前租客稳定',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 65000,
    arg2: 7000,
    arg3: 58000,
    arg4: 150,
    arg5: 1,
  },
  {
    id: 15,
    title: '3室2厅住宅出售',
    description:
      '业主继承人出售高尔夫球场旁错层3室2厅住宅，赠送高尔夫会籍',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 115000,
    arg2: 10000,
    arg3: 105000,
    arg4: -100,
    arg5: 1,
  },
  {
    id: 16,
    title: '3室2厅住宅出售',
    description:
      '中高端区域精装3室2厅住宅，带泳池和全套家电，学区优质',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 125000,
    arg2: 20000,
    arg3: 105000,
    arg4: -100,
    arg5: 1,
  },
  {
    id: 17,
    title: '3室2厅住宅出售',
    description:
      '业主降薪后无力承担月供，必须出售3室2厅住宅，该区域正处于转型期',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 70000,
    arg2: 9000,
    arg3: 61000,
    arg4: 300,
    arg5: 1,
  },
  {
    id: 18,
    title: '3室2厅住宅出售',
    description:
      '技术工人因工作调动转让3室2厅住宅，房屋保养极佳，在老城区可租出高价',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'house32',
    arg1: 67000,
    arg2: 12000,
    arg3: 55000,
    arg4: 400,
    arg5: 1,
  },
  {
    id: 23,
    title: '土地20英亩出售',
    description:
      '20英亩空置土地，目前为住宅用地，若调整为商业用地可实现大幅增值',
    info: '可自用或转售给其他玩家',
    type: 'land',
    subtype: null,
    arg1: 20000, // 总价
    arg2: 20000, // 首付
    arg3: 0,
    arg4: 0,
    arg5: 1,
  },
  {
    id: 24,
    title: '租客损坏房产',
    description:
      '租客失业后拒缴房租，驱逐后发现房产严重损坏，保险覆盖大部分损失，你仍需自付1000元',
    info: '若拥有出租房产，支付1000元（银行可按常规条款放贷）',
    type: 'estate-auto',
    subtype: null,
    arg1: 1000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 30,
    title: '双拼公寓出售',
    description:
      '业主因支付医药费必须出售双拼公寓，已有两名租客，账目齐全，优质投资机会',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 60000,
    arg2: 12000,
    arg3: 48000,
    arg4: 400,
    arg5: 2,
  },
  {
    id: 31,
    title: '双拼公寓出售',
    description:
      '业主涉个税问题，急售双拼公寓，目前满租',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 45000,
    arg2: 8000,
    arg3: 37000,
    arg4: 320,
    arg5: 2,
  },
  {
    id: 32,
    title: '双拼公寓出售',
    description:
      '业主退休迁居外地，与孙辈团聚，出售片区优质双拼公寓',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 70000,
    arg2: 7000,
    arg3: 63000,
    arg4: 140,
    arg5: 2,
  },
  {
    id: 33,
    title: '双拼公寓出售',
    description:
      '业主工作调动，转让优质地段精装双拼公寓，慧眼投资者可把握',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 60000,
    arg2: 6000,
    arg3: 54000,
    arg4: 300,
    arg5: 2,
  },
  {
    id: 34,
    title: '双拼公寓出售',
    description:
      '业主因家庭人口增加迁居，租客保留，房屋保养良好、绿化优秀',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'plex',
    arg1: 50000,
    arg2: 8000,
    arg3: 42000,
    arg4: 240,
    arg5: 2,
  },
  {
    id: 36,
    title: '公寓楼出售',
    description:
      '两栋建筑共24户公寓出售，业主自主管理并配备现场助理，因退休转让',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'apartment',
    arg1: 575000,
    arg2: 75000,
    arg3: 500000,
    arg4: 3400,
    arg5: 24,
  },
  {
    id: 37,
    title: '公寓楼出售',
    description:
      '12户公寓楼由异地业主继承人出售，该楼租房排队等候人数众多',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'apartment',
    arg1: 350000,
    arg2: 50000,
    arg3: 300000,
    arg4: 2400,
    arg5: 12,
  },
  {
    id: 38,
    title: '公寓楼出售',
    description:
      '紧邻社区大学的24户老旧公寓楼，由退休业主/开发商出售，满租、现金流可观',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'apartment',
    arg1: 550000,
    arg2: 50000,
    arg3: 500000,
    arg4: 2800,
    arg5: 24,
  },
  {
    id: 40,
    title: '公寓小区出售',
    description:
      '养老基金法拍开发商60户公寓小区，现场管理团队已到位',
    info: '可自用或转售给其他玩家',
    type: 'estate',
    subtype: 'apartment',
    arg1: 1200000,
    arg2: 200000,
    arg3: 1000000,
    arg4: 11000,
    arg5: 60,
  },
  {
    id: 41,
    title: '下水道管线破裂',
    description:
      '你的联排公寓水管爆裂！积水严重，需立即维修下水道管线',
    info: '若拥有联排公寓（双拼/4户/8户），支付2000元更换管线（银行可按常规条款放贷）',
    type: 'estate-auto',
    subtype: null,
    arg1: 2000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 1,
  },
]
//#endregion 大机会卡

//#region 市场卡
export const MARKETS = [
  {
    id: 1,
    title: '联排公寓买家',
    description:
      '买家愿以每户25000元收购任意数量的双拼/4户/8户联排公寓，自有资金无需融资',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'plex',
    arg1: 30000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 2,
    title: '联排公寓买家',
    description:
      '买家愿以每户30000元收购任意数量的双拼/4户/8户联排公寓，自有资金无需融资',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'plex',
    arg1: 40000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 3,
    title: '联排公寓买家',
    description:
      '买家愿以每户35000元收购任意数量的双拼/4户/8户联排公寓，自有资金无需融资',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'plex',
    arg1: 35000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 4,
    title: '联排公寓买家',
    description:
      '买家愿以每户40000元收购任意数量的双拼/4户/8户联排公寓，自有资金无需融资',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'plex',
    arg1: 40000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 5,
    title: '联排公寓买家',
    description:
      '买家愿以每户45000元收购任意数量的双拼/4户/8户联排公寓，自有资金无需融资',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'plex',
    arg1: 45000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 6,
    title: '联排公寓买家',
    description:
      '买家愿以每户20000元收购任意数量的双拼/4户/8户联排公寓，自有资金无需融资',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'plex',
    arg1: 20000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 7,
    title: '公寓楼买家',
    description:
      '买家愿以每户25000元收购任意规模公寓楼，自有资金（1031延税置换窗口期将满）',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'apartment',
    arg1: 25000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 8,
    title: '公寓楼买家',
    description:
      '买家愿以每户45000元收购任意规模公寓楼，自有资金（1031延税置换窗口期将满）',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'apartment',
    arg1: 45000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 9,
    title: '公寓楼买家',
    description:
      '买家愿以每户30000元收购任意规模公寓楼，自有资金（出售异地小区回笼资金）',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'apartment',
    arg1: 30000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 10,
    title: '公寓楼买家',
    description:
      '买家愿以每户40000元收购任意规模公寓楼，自有资金，急需即时投资',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'apartment',
    arg1: 40000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 11,
    title: '3室2厅住宅买家',
    description:
      '买家愿以135000元收购一套3室2厅出租房，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house32',
    arg1: 135000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 12,
    title: '3室2厅住宅买家',
    description:
      '买家愿以110000元收购一套3室2厅出租房，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house32',
    arg1: 110000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 13,
    title: '3室2厅住宅买家',
    description:
      '买家愿以140000元收购一套3室2厅出租房，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house32',
    arg1: 140000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 14,
    title: '3室2厅住宅买家',
    description:
      '买家愿以100000元收购一套3室2厅出租房，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house32',
    arg1: 100000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 15,
    title: '3室2厅住宅买家',
    description:
      '买家愿以65000元收购一套3室2厅出租房，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house32',
    arg1: 65000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 16,
    title: '2室1厅公寓买家',
    description:
      '买家愿以50000元收购一套2室1厅出租公寓，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house21',
    arg1: 50000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 17,
    title: '2室1厅公寓买家',
    description:
      '买家愿以65000元收购一套2室1厅出租公寓，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house21',
    arg1: 65000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 18,
    title: '2室1厅公寓买家',
    description:
      '买家愿以55000元收购一套2室1厅出租公寓，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house21',
    arg1: 55000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 19,
    title: '2室1厅公寓买家',
    description:
      '买家愿以60000元收购一套2室1厅出租公寓，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house21',
    arg1: 60000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 20,
    title: '2室1厅公寓买家',
    description:
      '买家愿以70000元收购一套2室1厅出租公寓，自有资金',
    info: '若出售，结清相关按揭贷款，并放弃该房产当前的现金流',
    type: 'estate',
    subtype: 'house21',
    arg1: 70000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 25,
    title: '开发商收地',
    description:
      '城市规划要求开发商配建10英亩公园，否则不予批准新小区规划，开发商急需临溪流的10英亩土地',
    info: '若拥有该类地块，可获现金150000元',
    type: 'land',
    subtype: null,
    arg1: 150000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 31,
    title: '20英亩土地买家',
    description:
      '开发商急需20英亩地块，计划将其从住宅用地调整为商业用地',
    info: '所有拥有20英亩住宅用地的玩家，可获现金200000元',
    type: 'land',
    subtype: null,
    arg1: 0,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 33,
    title: '黄金价格暴涨',
    description:
      '中东动乱，油价告急，黄金价格飙升至每盎司600元',
    info: '若拥有1盎司克鲁格金币，可按此价格出售',
    type: 'gold',
    subtype: null,
    arg1: 600,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
  {
    id: 34,
    title: '收藏家收金币',
    description:
      '收藏家高价收购16世纪西班牙新世界（仅限哈瓦那铸币厂）八里亚尔真品金币',
    info: '每枚金币可获现金5000元',
    type: 'gold',
    subtype: null,
    arg1: 5000,
    arg2: 0,
    arg3: 0,
    arg4: 0,
    arg5: 0,
  },
]
//#endregion 市场卡

//#region 职业卡
export const PROFESSIONS = [
  {
    id: 1,
    name: '医生',
    salary: 13200,
    cash: 400,
    expensePerChild: 640,
    otherExpenses: 2880,
    liabilities: [
      { id: 1, name: '房屋按揭', amount: 202000, type: 'home' }, // 房屋按揭
      { id: 2, name: '汽车贷款', amount: 19000, type: 'car' }, // 汽车贷款
      { id: 3, name: '信用卡欠款', amount: 9000, type: 'credit' }, // 信用卡欠款
      { id: 4, name: '消费贷欠款', amount: 1000, type: 'retail' }, // 消费贷欠款
    ],
  },
  {
    id: 2,
    name: '机械师',
    salary: 2000,
    cash: 400,
    expensePerChild: 110,
    otherExpenses: 450,
    liabilities: [
      { id: 1, name: '房屋按揭', amount: 31000, type: 'home' }, // 房屋按揭
      { id: 2, name: '汽车贷款', amount: 3000, type: 'car' }, // 汽车贷款
      { id: 3, name: '信用卡欠款', amount: 2000, type: 'credit' }, // 信用卡欠款
      { id: 4, name: '消费贷欠款', amount: 1000, type: 'retail' }, // 消费贷欠款
    ],
  },
  {
    id: 3,
    name: '护士',
    salary: 3100,
    cash: 480,
    expensePerChild: 170,
    otherExpenses: 710,
    liabilities: [
      { id: 1, name: '房屋按揭', amount: 47000, type: 'home' }, // 房屋按揭
      { id: 2, name: '汽车贷款', amount: 5000, type: 'car' }, // 汽车贷款
      { id: 3, name: '信用卡欠款', amount: 3000, type: 'credit' }, // 信用卡欠款
      { id: 4, name: '消费贷欠款', amount: 1000, type: 'retail' }, // 消费贷欠款
    ],
  },
  {
    id: 4,
    name: '工程师',
    salary: 4900,
    cash: 500,
    expensePerChild: 250,
    otherExpenses: 1090,
    liabilities: [
      { id: 1, name: '房屋按揭', amount: 75000, type: 'home' }, // 房屋按揭
      { id: 2, name: '汽车贷款', amount: 7000, type: 'car' }, // 汽车贷款
      { id: 3, name: '信用卡欠款', amount: 4000, type: 'credit' }, // 信用卡欠款
      { id: 4, name: '消费贷欠款', amount: 1000, type: 'retail' }, // 消费贷欠款
    ],
  },
  {
    id: 5,
    name: '运营经理',
    salary: 4600,
    cash: 400,
    expensePerChild: 480,
    otherExpenses: 1000,
    liabilities: [
      { id: 1, name: '房屋按揭', amount: 75000, type: 'home' }, // 房屋按揭
      { id: 2, name: '汽车贷款', amount: 6000, type: 'car' }, // 汽车贷款
      { id: 3, name: '信用卡欠款', amount: 3000, type: 'credit' }, // 信用卡欠款
      { id: 4, name: '消费贷欠款', amount: 1000, type: 'retail' }, // 消费贷欠款
    ],
  },
]
//#endregion 职业卡

//#endregion 游戏数据

//#region 自定义MUI主题
export const theme = createTheme({
  typography: {
    fontFamily: [
      'Nunito',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})
//#endregion 自定义MUI主题
