// 中文本地化文件

// 棋盘格子名称
export const SLOT_NAMES = {
  Payday: '发薪日',
  Opportunity: '机会',
  Market: '市场风云',
  Doodads: '生活小插曲',
  Baby: '生孩子',
  Downsized: '被裁员',
  Charity: '慈善捐款',
}

// 通用UI文本
export const UI_TEXT = {
  // 按钮
  buy: '购买',
  sell: '卖出',
  pass: '跳过',
  pay: '支付',
  ok: '确定',
  cancel: '取消',
  donate: '捐款',
  rollDice: '摇骰子',
  
  // 财务相关
  cost: '成本',
  price: '价格',
  downpay: '首付',
  mortgage: '贷款',
  cashflow: '现金流',
  cash: '现金',
  income: '收入',
  expense: '支出',
  assets: '资产',
  liabilities: '负债',
  passiveIncome: '被动收入',
  activeIncome: '主动收入',
  totalIncome: '总收入',
  totalExpense: '总支出',
  monthlyCashflow: '月现金流',
  
  // 投资类型
  stock: '股票',
  fund: '基金',
  estate: '房产',
  gold: '黄金',
  land: '土地',
  business: '企业',
  
  // 负债类型
  homeMortgage: '房贷',
  carLoan: '车贷',
  creditCard: '信用卡',
  retailDebt: '消费贷',
  bankLoan: '银行贷款',
  
  // 状态
  sharesOwned: '持有股数',
  tradingRange: '交易区间',
  units: '单位',
  
  // 提示
  notEnoughCash: '你没有足够的现金',
  mustTakeLoan: '需要贷款',
  noMatchingAssets: '你没有符合条件的资产',
  clickSellIcon: '点击资产列表中的卖出按钮来交易',
}

// 职业名称
export const PROFESSION_NAMES = {
  Doctor: '医生',
  Mechanic: '机械师',
  Nurse: '护士',
  Engineer: '工程师',
  'Business Manager': '企业经理',
  Teacher: '教师',
  Lawyer: '律师',
  Pilot: '飞行员',
  Secretary: '秘书',
  Janitor: '清洁工',
  'Truck Driver': '卡车司机',
  'Police Officer': '警察',
}

// 费用名称
export const EXPENSE_NAMES = {
  Taxes: '个人所得税',
  'Home Mortgage Payment': '房贷月供',
  'Car Loan Payment': '车贷月供',
  'Credit Card Payment': '信用卡还款',
  'Retail Payment': '消费贷还款',
  'Other Expenses': '其他支出',
  'Child Expenses': '子女抚养费',
  'Loans Payment': '银行贷款还款',
}

// 负债名称
export const LIABILITY_NAMES = {
  'Home Mortgage': '房屋贷款',
  'Car Loans': '汽车贷款',
  'Credit Cards': '信用卡债务',
  'Retail Debt': '消费债务',
  Loans: '银行贷款',
}

// 对话框标题
export const DIALOG_TITLES = {
  newBaby: '喜得贵子！',
  babyLimitReached: '已达到孩子数量上限！',
  downsized: '被裁员了！',
  charity: '是否进行慈善捐款？',
  opportunity: '投资机会',
  market: '市场风云',
  doodads: '生活小插曲',
  congratulations: '恭喜你！',
  youLose: '游戏结束',
}

// 对话框描述
export const DIALOG_DESCRIPTIONS = {
  newBaby: '恭喜！你的家庭新添了一个孩子',
  babyLimitReached: '每位玩家最多只能有3个孩子',
  downsized: '支付你全部的月支出',
  charityDesc: '捐出总收入的10%，接下来3回合可以掷2个骰子',
  winMessage: '你的被动收入已经超过了总支出。你已经跳出了老鼠赛跑，可以去追寻你的梦想了！',
  loseMessage: '你的月现金流为负数。你已经破产出局了。',
  childExpenseIncrease: '子女抚养费将增加',
}

// 生活小插曲卡片 (DOODADS)
export const DOODADS_CN = [
  { id: 1, title: '热水器漏水', description: '支付 $450 购买新热水器', info: '', cost: 450 },
  { id: 2, title: '外出就餐', description: '花费 $80', info: '', cost: 80 },
  { id: 3, title: '结婚纪念日！', description: '花费 $200', info: '', cost: 200 },
  { id: 4, title: '违章停车', description: '支付 $100 罚款', info: '', cost: 100 },
  { id: 5, title: '购买大屏电视', description: '支付 $2000', info: '', cost: 2000 },
  { id: 6, title: '孩子的大学学费', description: '花费 $1500', info: '（如果你有孩子）', cost: 1500 },
  { id: 7, title: '给孩子买玩具', description: '花费 $50', info: '', cost: 50 },
  { id: 8, title: '购买新鱼竿', description: '支付 $100', info: '', cost: 100 },
  { id: 9, title: '打高尔夫', description: '支付 $100', info: '', cost: 100 },
  { id: 10, title: '汽车空调坏了', description: '支付 $700', info: '', cost: 700 },
  { id: 11, title: '税务审计', description: '补缴税款 $350', info: '真倒霉！', cost: 350 },
  { id: 12, title: '购物！', description: '花费 $350 买漂亮衣服', info: '', cost: 350 },
  { id: 13, title: '家庭度假！', description: '花费 $2,000', info: '', cost: 2000 },
  { id: 14, title: '去赌场！', description: '输了 $200', info: '', cost: 200 },
  { id: 15, title: '购买新游戏机', description: '支付 $400', info: '', cost: 400 },
  { id: 16, title: '买彩票！', description: '损失 $100', info: '', cost: 100 },
  { id: 17, title: '疯狂购物！', description: '支付 $250', info: '', cost: 250 },
  { id: 18, title: '看球赛', description: '支付 $50', info: '', cost: 50 },
  { id: 19, title: '看牙医', description: '补牙花费 $100', info: '', cost: 100 },
  { id: 20, title: '购买新网球拍', description: '支付 $50', info: '', cost: 50 },
  { id: 21, title: '家具促销', description: '支付 $300', info: '换掉旧的工作桌', cost: 300 },
  { id: 22, title: '去听演唱会', description: '晚餐、门票和咖啡共花费 $180', info: '', cost: 180 },
  { id: 23, title: '购买新手机', description: '买iPhone花费 $1200', info: '', cost: 1200 },
  { id: 24, title: '去咖啡厅', description: '支付 $10', info: '请朋友喝拿铁和卡布奇诺', cost: 10 },
  { id: 25, title: '高中同学聚会', description: '花费 $250', info: '', cost: 250 },
  { id: 26, title: '房屋重新粉刷', description: '花费 $600', info: '', cost: 600 },
  { id: 27, title: '购买画作', description: '花费 $200', info: '忍不住买了本地艺术家的新画', cost: 200 },
  { id: 28, title: '给父母买礼物', description: '给爸妈买按摩椅', info: '花费 $1000', cost: 1000 },
  { id: 29, title: '视频会员订阅', description: '支付 $150', info: '', cost: 150 },
  { id: 30, title: '购买蓝牙耳机', description: '支付 $500', info: '', cost: 500 },
  { id: 31, title: '生日派对！', description: '带家人去游乐园花费 $100', info: '', cost: 100 },
  { id: 32, title: '购买咖啡机', description: '支付 $150', info: '', cost: 150 },
  { id: 33, title: '好友婚礼', description: '花费 $2,000', info: '', cost: 2000 },
  { id: 34, title: '购买新衣服', description: '支付 $250', info: '你的另一半看了某部电影后想买新衣服', cost: 250 },
  { id: 35, title: '裁员传闻', description: '支付 $220 学费和书本费', info: '回学校进修增加技能', cost: 220 },
  { id: 36, title: '去看航展', description: '支付 $120', info: '', cost: 120 },
  { id: 37, title: '必须买新墨镜', description: '支付 $70', info: '', cost: 70 },
  { id: 38, title: '购买厨具', description: '支付 $250', info: '', cost: 250 },
  { id: 39, title: '和朋友吃午餐', description: '支付 $40', info: '', cost: 40 },
  { id: 40, title: '汽车需要换轮胎', description: '支付 $300', info: '', cost: 300 },
]

// 股票/基金名称翻译
export const STOCK_NAMES = {
  'Mutual Fund - GRO4US Fund': '共同基金 - 成长基金',
  'Stock - MYT4U Electronics Co.': '股票 - 美泰电子公司',
  'Stock - OK4U Drug Co.': '股票 - 康乐制药公司',
  'Stock - ON2U Entertainment Co.': '股票 - 欢乐娱乐公司',
  'Preferred Stock - 2BIG Power': '优先股 - 大力电力公司',
}

// 房产类型名称
export const ESTATE_TYPES = {
  house32: '3室2卫房屋',
  house21: '2室1卫公寓',
  plex: '多户住宅',
  apartment: '公寓楼',
  land: '土地',
  business: '商业地产',
}

// 游戏胜利/失败消息
export const GAME_MESSAGES = {
  winTitle: '恭喜你！',
  winText: '你的被动收入已经超过了总支出。你已经跳出了老鼠赛跑，可以去追寻你的梦想了！',
  winButton: '开始新游戏',
  loseTitle: '游戏结束！',
  loseText: '你的月现金流为负数。你已经破产出局了。',
  loseButton: '开始新游戏',
}
