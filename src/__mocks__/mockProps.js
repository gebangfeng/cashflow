export const mockFinancialStatus = {
  totalIncome: 2000,
  totalExpenses: 1280,
  cash: 670,
}

export const mockIncomes = [
  {
    id: 1,
    name: '程序员工资',
    amount: 2500,
    type: 'salary',
  },
  {
    id: 2,
    name: '3室2厅房产',
    amount: 100,
    type: 'estate',
  },
  {
    id: 3,
    name: '2室1厅公寓',
    amount: 2500,
    type: 'estate',
  },
  {
    id: 4,
    name: '2BIG股票 20股',
    amount: 200,
    type: 'dividends',
  },
  {
    id: 5,
    name: 'CD股票 100股',
    amount: 2000,
    type: 'dividends',
  },
  {
    id: 6,
    name: 'AB股票 100股',
    amount: 4000,
    type: 'dividends',
  },
]

export const mockAssets = [
  {
    id: 1,
    name: '2BIG股票',
    quantity: 5,
    value: 1200,
    type: '股票/基金/定存',
  },
  {
    id: 2,
    name: 'ON2U股票',
    quantity: 10000,
    value: 5,
    type: '',
  },
  {
    id: 3,
    name: '创业公司',
    quantity: 1,
    value: 3000,
    type: '房产/企业',
  },
  {
    id: 4,
    name: '金币',
    quantity: 1,
    value: 3000,
    type: '房产/企业',
  },
  {
    id: 5,
    name: '2室1厅公寓',
    quantity: 1,
    value: 60000,
    type: '房产/企业',
  },
  {
    id: 6,
    name: '3室2厅住宅',
    quantity: 1,
    value: 50000,
    type: '房产/企业',
  },
  {
    id: 7,
    name: '多户住宅',
    quantity: 1,
    value: 200000,
    type: '房产/企业',
  },
]

export const mockChildExpense = {
  childNum: 1,
  expensePerChild: 200,
}

export const mockLiabilities = [
  {
    id: 1,
    name: '房屋贷款',
    value: 50000,
    type: 'home',
  },
  {
    id: 2,
    name: '汽车贷款',
    value: 3000,
    type: 'car',
  },
  {
    id: 3,
    name: '信用卡',
    value: 3000,
    type: 'credit',
  },
  {
    id: 4,
    name: '消费贷款',
    value: 1000,
    type: 'retail',
  },
  {
    id: 5,
    name: '银行贷款',
    value: 12000,
    type: 'bank',
  },
]

export const mockStartDialog = {
  playerName: '玩家',
  description: '准备好后，掷骰子开始你的回合',
  note: '在开始回合前，请查看你的财务报表。你也可以在此时还款或贷款。',
}

export const mockRepayDialog = {
  title: '还清贷款',
  description: '在财务报表中选择一项负债进行还款',
  liabilities: mockLiabilities,
}

export const mockDownsizedDialog = {
  title: '失业!',
  description: '支付全部月支出，失去两个回合，并取消慈善特权',
  expenses: 1500,
}

export const mockBabyDialogNew = {
  title: '喜得贵子!',
  description: '恭喜！您的家庭新增了一个孩子',
  expenses: 110,
}

export const mockBabyDialogLimitReached = {
  title: '已达子女上限!',
  description: '每位玩家最多只能有3个孩子',
  expenses: 0,
}

export const mockOpportunityDialog = {
  title: '投资机会',
  description: '选择投资类型',
  info: '小型投资成本在¥5,000以下，大型投资成本在¥6,000以上',
}

export const mockSmallDeal = {
  id: 1,
  title: '共同基金 - GRO4US基金',
  description:
    '大多数公司业绩疲软导致基金价格走低',
  note: '交易区间: ¥10 至 ¥30',
  type: 'stock',
  arg1: 10, // 成本
  arg2: 0, // 现金流
  arg3: 10, // 最低价
  arg4: 30, // 最高价
}

export const mockBigDeal = {
  id: 1,
  title: '8套公寓出售',
  description:
    '专业人士急需现金挽救合伙企业。出售8套公寓筹集资金，对合适的买家是个好机会。',
  type: 'real-estate',
  arg1: 160000, // 成本
  arg2: 1700, // 现金流
  arg3: 32000, // 首付
  arg4: 128000, // 抵押贷款
}

export const mockMarket = {
  id: 1,
  title: '公寓买家',
  description:
    '有人出价每套¥25,000收购任何规模的公寓楼。买家自行安排融资。如果出售，需还清相关抵押贷款，并放弃该物业目前的现金流。',
  type: 'real-estate',
  price: 25000, // 出售价格
}

export const mockDoodad = {
  id: 1,
  title: '外出就餐',
  description: '支付 ¥80',
  cost: -80, // 支出金额
}
