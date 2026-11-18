export const sections = [
  {
    "id": "basics",
    "title": "个人条件",
    "text": "填一个大致范围，就能用来对照你的择偶预期。",
    "fields": [
      "gender",
      "city",
      "age",
      "education",
      "income",
      "housing",
      "workKind",
      "workStability",
      "workSchedule",
      "height"
    ]
  },
  {
    "id": "family",
    "title": "家庭与未来",
    "text": "把双方父母可能提供的支持和日后要承担的责任都考虑进去。",
    "fields": [
      "parentMoney",
      "homeHelp",
      "familyDecision",
      "children",
      "parentSecurity",
      "familyCare",
      "familyLiving",
      "relationshipGoal"
    ]
  },
  {
    "id": "habits",
    "title": "性格、生活与兴趣",
    "text": "按你平时的样子来选。爱好可以多选。",
    "fields": [
      "social",
      "planning",
      "conflict",
      "routine",
      "spending",
      "smoking",
      "hobbies"
    ]
  },
  {
    "id": "preferences",
    "title": "你想找怎样的人",
    "text": "收入、住房等条件可以选择不限。最后挑一个你想提升预期的方向。",
    "fields": [
      "locationWish",
      "ageWish",
      "educationWish",
      "incomeWish",
      "housingWish",
      "familyWish",
      "homeHelpWish",
      "smokingWish",
      "socialWish",
      "hobbyWish",
      "stretch",
      "heightWish",
      "looksWish",
      "jobPriority"
    ]
  }
];

export const fields = {
  "gender": {
    "label": "我是",
    "required": true,
    "options": [
      [
        "man",
        "男生，想认识女生"
      ],
      [
        "woman",
        "女生，想认识男生"
      ]
    ]
  },
  "city": {
    "label": "目前所在城市",
    "required": true,
    "kind": "city",
    "note": "填常住城市，例如常州。"
  },
  "age": {
    "label": "年龄段",
    "required": true,
    "options": [
      [
        "0",
        "18–23 岁"
      ],
      [
        "1",
        "24–27 岁"
      ],
      [
        "2",
        "28–31 岁"
      ],
      [
        "3",
        "32–35 岁"
      ],
      [
        "4",
        "36–40 岁"
      ],
      [
        "5",
        "41–45 岁"
      ],
      [
        "6",
        "46–50 岁"
      ],
      [
        "7",
        "51 岁及以上"
      ]
    ]
  },
  "education": {
    "label": "受教育经历",
    "options": [
      [
        "0",
        "高中、中专及以下"
      ],
      [
        "1",
        "大专"
      ],
      [
        "2",
        "本科"
      ],
      [
        "3",
        "硕士及以上"
      ]
    ]
  },
  "income": {
    "label": "税后个人月收入",
    "note": "收入波动时选近几个月的平均区间。到达分界金额选下一档。",
    "options": [
      [
        "0",
        "低于 ¥5,000"
      ],
      [
        "1",
        "¥5,000–8,000"
      ],
      [
        "2",
        "¥8,000–12,000"
      ],
      [
        "3",
        "¥12,000–20,000"
      ],
      [
        "4",
        "¥20,000–35,000"
      ],
      [
        "5",
        "¥35,000 及以上"
      ]
    ]
  },
  "housing": {
    "label": "现在的住房情况",
    "options": [
      [
        "rent",
        "租房"
      ],
      [
        "parents",
        "与家人同住"
      ],
      [
        "own",
        "已有自有住房（含房贷）"
      ],
      [
        "other",
        "其他安排"
      ]
    ]
  },
  "parentMoney": {
    "label": "父母的日常经济安排",
    "options": [
      [
        "independent",
        "目前基本能自理"
      ],
      [
        "occasional",
        "我偶尔需要帮衬"
      ],
      [
        "regular",
        "我需要定期承担一部分开支"
      ]
    ]
  },
  "homeHelp": {
    "label": "如果未来买房，家里可能提供支持吗？",
    "options": [
      [
        "yes",
        "预计能帮一部分"
      ],
      [
        "maybe",
        "要看当时情况"
      ],
      [
        "no",
        "主要靠自己或两个人安排"
      ]
    ]
  },
  "familyDecision": {
    "label": "遇到两个人的大事，通常怎么和父母商量？",
    "options": [
      [
        "couple",
        "两人先做决定，然后告知父母"
      ],
      [
        "listen",
        "先听父母看法，再由两人决定"
      ],
      [
        "together",
        "涉及父母出钱或出力时，一起商量相关决定"
      ]
    ]
  },
  "children": {
    "label": "长期关系里，你对以后要不要孩子的想法",
    "options": [
      [
        "yes",
        "希望有或再有孩子"
      ],
      [
        "no",
        "计划不生或不再生"
      ],
      [
        "unsure",
        "要看双方和现实条件"
      ]
    ]
  },
  "social": {
    "label": "工作一周后，你通常怎么恢复精力？",
    "options": [
      [
        "0",
        "自己待一会儿"
      ],
      [
        "1",
        "见一两个熟悉的人"
      ],
      [
        "2",
        "约朋友出去或参加活动"
      ]
    ]
  },
  "planning": {
    "label": "周末和别人约活动，你通常怎么安排？",
    "options": [
      [
        "plan",
        "提前定好时间和活动"
      ],
      [
        "mix",
        "先约大致时间，细节到时商量"
      ],
      [
        "go",
        "看当天状态，临时决定"
      ]
    ]
  },
  "conflict": {
    "label": "有分歧时，你希望什么时候继续谈？",
    "options": [
      [
        "now",
        "有情绪也想尽快当面聊"
      ],
      [
        "same",
        "先缓一会儿，当天再聊"
      ],
      [
        "later",
        "隔一晚或约一个具体时间再聊"
      ]
    ]
  },
  "routine": {
    "label": "你的日常作息",
    "options": [
      [
        "early",
        "习惯早睡早起"
      ],
      [
        "flex",
        "作息比较灵活"
      ],
      [
        "night",
        "夜间更有精神，睡得晚"
      ]
    ]
  },
  "spending": {
    "label": "日常花钱时，你比较接近哪一种？",
    "options": [
      [
        "save",
        "先攒钱和做预算"
      ],
      [
        "balance",
        "储蓄和体验都留一部分"
      ],
      [
        "enjoy",
        "目前更愿意花在体验上"
      ]
    ]
  },
  "smoking": {
    "label": "你目前吸烟吗？",
    "options": [
      [
        "none",
        "不吸烟"
      ],
      [
        "sometimes",
        "偶尔吸烟"
      ],
      [
        "often",
        "经常吸烟"
      ]
    ]
  },
  "hobbies": {
    "label": "你喜欢怎么过空闲时间？",
    "kind": "multiple",
    "options": [
      [
        "food",
        "探店美食"
      ],
      [
        "outdoor",
        "旅行户外"
      ],
      [
        "sport",
        "运动健身"
      ],
      [
        "screen",
        "电影追剧"
      ],
      [
        "reading",
        "阅读学习"
      ],
      [
        "music",
        "音乐演出"
      ],
      [
        "games",
        "游戏桌游"
      ],
      [
        "art",
        "摄影手作"
      ],
      [
        "cook",
        "做饭居家"
      ],
      [
        "pets",
        "宠物活动"
      ]
    ]
  },
  "locationWish": {
    "label": "对方现在在哪座城市，你比较能接受？",
    "options": [
      [
        "same",
        "希望同城"
      ],
      [
        "planned",
        "可以暂时异地，要能谈同城计划"
      ],
      [
        "any",
        "地点不限"
      ]
    ]
  },
  "ageWish": {
    "label": "希望对方的年龄段",
    "options": [
      [
        "same",
        "和我同一年龄段"
      ],
      [
        "near",
        "和我同段或相邻"
      ],
      [
        "any",
        "年龄段不限"
      ]
    ]
  },
  "educationWish": {
    "label": "希望对方的受教育经历",
    "options": [
      [
        "any",
        "不限"
      ],
      [
        "1",
        "大专及以上"
      ],
      [
        "2",
        "本科及以上"
      ],
      [
        "3",
        "硕士及以上"
      ]
    ]
  },
  "incomeWish": {
    "label": "希望对方的税后个人月收入",
    "options": [
      [
        "near",
        "和我同档或相邻"
      ],
      [
        "any",
        "无明确门槛"
      ],
      [
        "1",
        "希望至少 ¥5,000"
      ],
      [
        "2",
        "希望至少 ¥8,000"
      ],
      [
        "3",
        "希望至少 ¥12,000"
      ],
      [
        "4",
        "希望至少 ¥20,000"
      ],
      [
        "5",
        "希望至少 ¥35,000"
      ]
    ]
  },
  "housingWish": {
    "label": "对对方住房条件的期待",
    "options": [
      [
        "any",
        "租房、自有住房都能聊"
      ],
      [
        "own",
        "希望对方已有自有住房"
      ]
    ]
  },
  "familyWish": {
    "label": "介意对方定期给父母提供经济支持吗？",
    "options": [
      [
        "any",
        "可以接受，聊清实际负担就行"
      ],
      [
        "independent",
        "希望对方父母基本能经济自理"
      ]
    ]
  },
  "homeHelpWish": {
    "label": "希望对方家里也能提供购房支持吗？",
    "options": [
      [
        "any",
        "不限，两个人可以一起安排"
      ],
      [
        "want",
        "希望至少可以支持一部分"
      ]
    ]
  },
  "smokingWish": {
    "label": "对对方吸烟的接受程度",
    "options": [
      [
        "any",
        "都能聊"
      ],
      [
        "none",
        "希望对方不吸烟"
      ]
    ]
  },
  "socialWish": {
    "label": "对方的社交节奏",
    "options": [
      [
        "near",
        "希望和我比较接近"
      ],
      [
        "any",
        "可以不同，互相留空间"
      ]
    ]
  },
  "hobbyWish": {
    "label": "希望至少有一个共同爱好吗？",
    "options": [
      [
        "yes",
        "希望有一个能一起做"
      ],
      [
        "any",
        "各有各的爱好也可以"
      ]
    ]
  },
  "stretch": {
    "label": "可以够一够的方向",
    "options": [
      [
        "income",
        "对方收入更高一档"
      ],
      [
        "education",
        "对方学历更高一档"
      ],
      [
        "housing",
        "对方住房更稳定"
      ],
      [
        "family",
        "对方家庭能提供更多支持"
      ],
      [
        "location",
        "扩大到其他城市"
      ]
    ]
  },
  "workKind": {
    "label": "你现在的工作类型",
    "options": [
      [
        "civil",
        "公务员／党政机关"
      ],
      [
        "institution",
        "事业单位（学校、医院、科研等）"
      ],
      [
        "soe",
        "央企／国企"
      ],
      [
        "private",
        "民营企业"
      ],
      [
        "foreign",
        "外资／合资企业"
      ],
      [
        "business",
        "个体经营／创业"
      ],
      [
        "freelance",
        "自由职业／灵活就业"
      ],
      [
        "transition",
        "在读、转岗或暂时未工作"
      ],
      [
        "other",
        "其他工作类型"
      ]
    ]
  },
  "workStability": {
    "label": "你现在的工作与收入稳定性",
    "options": [
      [
        "steady",
        "工作安排和收入都较可预期"
      ],
      [
        "variable",
        "项目、订单或收入有波动"
      ],
      [
        "transition",
        "最近在转岗、找工作或有变动"
      ]
    ]
  },
  "workSchedule": {
    "label": "你平时的工作时间",
    "options": [
      [
        "regular",
        "固定工时，有可预期的休息日"
      ],
      [
        "shifts",
        "经常轮班或周末上班"
      ],
      [
        "busy",
        "经常加班、出差或旺季很忙"
      ],
      [
        "flex",
        "自己安排，但能提前留出时间"
      ]
    ]
  },
  "parentSecurity": {
    "label": "父母的养老保障",
    "options": [
      [
        "secure",
        "退休金、稳定收入或储备基本够生活"
      ],
      [
        "partial",
        "有一部分保障，可能还需要补贴"
      ],
      [
        "dependent",
        "日常或未来养老主要靠子女承担"
      ]
    ]
  },
  "familyCare": {
    "label": "你家平时谁来分担照顾父母",
    "options": [
      [
        "shared",
        "我和兄弟姐妹或家人有分工"
      ],
      [
        "main",
        "我通常是主要照顾者"
      ],
      [
        "occasional",
        "父母目前自行安排，我偶尔帮忙"
      ],
      [
        "undecided",
        "还需要和家人商量"
      ]
    ]
  },
  "familyLiving": {
    "label": "以后和父母的居住安排",
    "options": [
      [
        "separate",
        "希望各住各的"
      ],
      [
        "nearby",
        "愿意住得近，但分开住"
      ],
      [
        "together",
        "可以考虑跟父母同住"
      ],
      [
        "discuss",
        "按照护需要和双方情况商量"
      ]
    ]
  },
  "relationshipGoal": {
    "label": "你现在想把关系往哪里发展",
    "options": [
      [
        "marriage",
        "认真交往，合适的话考虑结婚"
      ],
      [
        "longterm",
        "想稳定交往，再看是否结婚"
      ],
      [
        "explore",
        "先认识和相处，节奏想放慢"
      ]
    ]
  },
  "height": {
    "label": "你的身高（厘米）",
    "kind": "height",
    "note": "双人测试时可用来比较彼此选择的身高范围。"
  },
  "heightWish": {
    "label": "对方身高给你眼缘的范围",
    "options": [
      [
        "any",
        "身高不限"
      ],
      [
        "h150",
        "150–158 厘米"
      ],
      [
        "h155",
        "155–163 厘米"
      ],
      [
        "h160",
        "160–168 厘米"
      ],
      [
        "h165",
        "165–173 厘米"
      ],
      [
        "h170",
        "170–178 厘米"
      ],
      [
        "h175",
        "175–183 厘米"
      ],
      [
        "h180",
        "180–188 厘米"
      ],
      [
        "h185",
        "185–193 厘米"
      ],
      [
        "h190",
        "190 厘米及以上"
      ]
    ]
  },
  "looksWish": {
    "label": "你通常会对哪种外形有眼缘",
    "options": [
      [
        "clean",
        "清爽自然，穿着整洁"
      ],
      [
        "warm",
        "笑容有亲和力，表情自然"
      ],
      [
        "calm",
        "气质沉稳，有成熟感"
      ],
      [
        "style",
        "有自己的穿搭或审美风格"
      ],
      [
        "active",
        "精神状态好，偏运动感"
      ],
      [
        "any",
        "想见面再看，风格不限"
      ]
    ]
  },
  "jobPriority": {
    "label": "更看重对方哪类工作条件",
    "options": [
      [
        "steady",
        "工作和收入相对稳定"
      ],
      [
        "overlap",
        "有稳定的时间经营关系"
      ],
      [
        "similar",
        "希望跟我是相近的工作类型"
      ],
      [
        "flex",
        "接受项目或个体工作，但安排说得清"
      ],
      [
        "any",
        "职业类型不限"
      ]
    ]
  }
};

export const heightBands = {
  "h150": [
    150,
    158
  ],
  "h155": [
    155,
    163
  ],
  "h160": [
    160,
    168
  ],
  "h165": [
    165,
    173
  ],
  "h170": [
    170,
    178
  ],
  "h175": [
    175,
    183
  ],
  "h180": [
    180,
    188
  ],
  "h185": [
    185,
    193
  ],
  "h190": [
    190,
    220
  ]
};

export const cityList = [
  "北京",
  "上海",
  "广州",
  "深圳",
  "杭州",
  "成都",
  "重庆",
  "南京",
  "苏州",
  "武汉",
  "西安",
  "郑州",
  "长沙",
  "天津",
  "合肥",
  "宁波",
  "无锡",
  "青岛",
  "大连",
  "济南",
  "常州",
  "福州",
  "厦门",
  "东莞",
  "佛山",
  "珠海",
  "昆明",
  "南宁",
  "贵阳",
  "南昌",
  "石家庄",
  "太原",
  "兰州",
  "西宁",
  "银川",
  "乌鲁木齐",
  "拉萨",
  "哈尔滨",
  "沈阳",
  "长春",
  "呼和浩特",
  "海口",
  "三亚",
  "香港",
  "澳门"
];

export const references = [
  ["Big Five 开源实现（题库、计分与结果模块）", "https://github.com/KatherineGuoGuo/bigfive-open"],
  ["Gottman 关系互动卡片案例", "https://www.gottman.com/couples/apps/"],
  ["16Personalities：人格类型与恋爱适配的边界", "https://www.16personalities.com/articles/whats-my-ideal-romantic-personality-type-match"],
  [
    "国内择偶选择实验",
    "https://sociologyol.ruc.edu.cn/shxyj/fzshx/shfc/e96e3fbb12db4abe8eaff950c1bf9211.htm"
  ],
  [
    "择偶偏好与同型婚配",
    "https://jypl.pku.edu.cn/article/info?aid=389211856"
  ],
  [
    "上海交友者访谈",
    "https://journals.sagepub.com/doi/10.1177/2057150X20957422"
  ],
  [
    "中国青年及成人婚育观调查",
    "https://cpms.ssap.com.cn/skwx_cmr/initDatabaseDetail?contentId=8225485&contentType=literature&siteId=23"
  ],
  [
    "城市相亲角研究",
    "https://journals.sagepub.com/doi/full/10.1177/1466138120960512"
  ]
];
