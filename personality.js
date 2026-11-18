import { scenes } from "./question-bank.js";
export { scenes, drawScenes, questionBank } from "./question-bank.js";

export const axes = [
  {
    "key": "warm",
    "title": "初见方式",
    "poles": [
      [
        "S",
        "主动暖场",
        "乐于先把话题抛出来",
        "对方愿意接你的话，也会分享自己的事"
      ],
      [
        "Q",
        "慢热观察",
        "熟起来才更有话聊",
        "对方愿意给你熟悉的时间，也能找个轻松的话头"
      ]
    ],
    "pairTip": "可以让更愿意说话的人先起一个话题，再约好轮着问，给对方一点时间想。"
  },
  {
    "key": "plan",
    "title": "安排与进度",
    "poles": [
      [
        "P",
        "提前计划",
        "喜欢知道时间与安排",
        "对方愿意提前约好见面时间，行程变了会告诉你"
      ],
      [
        "F",
        "现场灵感",
        "乐于给临时起意留空间",
        "对方喜欢一起试一点新鲜事，计划变了也能商量"
      ]
    ],
    "pairTip": "先定见面的时间和大致地点，把之后做什么留到当天一起决定。"
  },
  {
    "key": "express",
    "title": "心意与需求",
    "poles": [
      [
        "D",
        "愿意说清",
        "更常把好感或介意说出来",
        "对方愿意直接说想见面、喜欢什么，也接得住你的表达"
      ],
      [
        "H",
        "先留在心里",
        "更常先观察，或把在意留到之后",
        "对方愿意主动问，也能认真对待你说出的需求"
      ]
    ],
    "pairTip": "各说一件希望被对方知道的小事，既可以是好感，也可以是一点介意。"
  },
  {
    "key": "space",
    "title": "相处距离",
    "poles": [
      [
        "C",
        "喜欢陪伴",
        "愿意把日常小事一起做",
        "对方也喜欢有规律地见面或分享当天发生的小事"
      ],
      [
        "I",
        "需要留白",
        "享受各自有自己的生活",
        "对方能接受各自有活动，也愿意留一段固定的相处时间"
      ]
    ],
    "pairTip": "先约好一个固定的共同安排，同时各留一个只属于自己的晚上。"
  }
];

export const relationshipAxes = [
  {
    "key": "repair",
    "title": "分歧后的节奏",
    "poles": [
      [
        "",
        "想早点说开",
        "心里不舒服时，倾向早点开口把事说清楚。"
      ],
      [
        "",
        "缓一缓再谈",
        "倾向先让情绪落下来，再约好什么时候把话说清楚。"
      ]
    ],
    "tie": "聊的时间看当时状态，事情还能谈时愿意开口，情绪太满时也会先暂停。",
    "pairTip": "先用一句话确认你们都想把事情谈清楚，再约个具体时间接着聊。"
  },
  {
    "key": "support",
    "title": "需要的支持方式",
    "poles": [
      [
        "",
        "想先被听见",
        "压力大的时候，希望伴侣先理解你的感受，陪你把话说完。"
      ],
      [
        "",
        "喜欢一起想办法",
        "压力大的时候，希望伴侣先问你愿不愿意，再一起理清下一步。"
      ]
    ],
    "tie": "有时需要有人听，有时也想一起找办法。可以当下告诉对方你今天更需要哪一种。",
    "pairTip": "开口前先问一句「你今天更想我听你说，还是想一起找个办法？」"
  }
];

export const chapters = [
  {
    "title": "初次见面",
    "cue": "咖啡店门口",
    "color": "lilac"
  },
  {
    "title": "约下一次",
    "cue": "周五傍晚",
    "color": "peach"
  },
  {
    "title": "心动以后",
    "cue": "手机亮了一下",
    "color": "rose"
  },
  {
    "title": "相处日常",
    "cue": "普通的一天",
    "color": "mint"
  },
  {
    "title": "闹别扭之后",
    "cue": "有件事想说开",
    "color": "amber"
  },
  {
    "title": "认真在一起",
    "cue": "走进彼此的日常",
    "color": "sky"
  }
];

export const types = {
  "SPDC": [
    "直球策划师",
    "下次几点见？我连那家店的招牌菜都查好了。",
    "你善于把热络的气氛变成明确的邀约。喜欢的时候愿意说，也乐意把下一次见面安排得妥妥帖帖。"
  ],
  "SPDI": [
    "从容主理人",
    "计划我来提，周日留一半给各自。",
    "你擅长张罗见面，也能说清自己的心意。安排可以精确到几点，你的独处时间也一样值得预约。"
  ],
  "SPHC": [
    "暖场指挥家",
    "我嘴上没说，但你爱吃什么我早就记下了。",
    "你愿意开场和安排活动，心意却喜欢藏在细节里。别人常常先感到被照顾，后来才读懂你的认真。"
  ],
  "SPHI": [
    "留白策划师",
    "咖啡订好了，之后几点散场都可以。",
    "你不怯场，也喜欢把见面安排好。靠近一个人时，你更擅长给出可靠的细节，同时留足各自的空间。"
  ],
  "SFDC": [
    "气氛点灯人",
    "好巧，我也想你。要不要现在就见？",
    "你会主动打破冷场，也乐于把一句好感变成今天就能实现的小约会。跟你在一起，日常很容易多出一点惊喜。"
  ],
  "SFDI": [
    "城市漫游家",
    "喜欢你是真的，我也真的想自己逛半天。",
    "你表达明快、主意灵活。最舒服的相处，是两个人能随时约着探索，又能各自回来讲自己的故事。"
  ],
  "SFHC": [
    "灵感同游者",
    "本来只想去吃饭，怎么一起走了六公里？",
    "你善于接话和发现临时活动。你表达喜欢的方式，往往是把一个普通的下午变成彼此都记得的相处。"
  ],
  "SFHI": [
    "街角观察员",
    "我先带你去一家小店，剩下的看今天。",
    "你能轻松开始聊天，也喜欢保留一点自己的世界。心意常藏在你愿意分享给对方的一家小店或一条散步路线里。"
  ],
  "QPDC": [
    "慢热领航员",
    "开始有点慢，确定了我就会主动约。",
    "你会先观察相处的感觉。等到确定心意，你愿意认真说出来，也会给关系安排可预期的陪伴。"
  ],
  "QPDI": [
    "静音直球手",
    "平时话少，重要的事我会认真说清楚。",
    "你不急着接管气氛，却很愿意把重要安排说清楚。约定的见面和各自的生活，对你都很重要。"
  ],
  "QPHC": [
    "周末放映员",
    "话没说太多，但我记住了你爱坐靠窗。",
    "你常先听对方说，喜欢在稳定的见面里慢慢靠近。比起突然的大告白，你更容易把喜欢放进一个又一个能兑现的小约定。"
  ],
  "QPHI": [
    "暖灯守夜人",
    "门口那盏灯给你留着，我先回房看书。",
    "你需要熟悉的时间和自己的空间。留心小习惯、提前做好安排，是你让人感到被惦记的办法。"
  ],
  "QFDC": [
    "不期而遇派",
    "不太会主动破冰，但现在我想跟你多走一段。",
    "你开场不着急，合拍以后反而愿意直说，也相信不经意的相处比排满的行程更能让人熟悉。"
  ],
  "QFDI": [
    "独处探险家",
    "我想见你，也想把周日下午留给自己。",
    "你愿意顺着感觉探索，也敢说清喜欢与需要。对你来说，关系舒服的时候，既可以临时见面，也可以安心独处。"
  ],
  "QFHC": [
    "小巷寻宝家",
    "不说去哪儿，走到喜欢的地方就停。",
    "你慢慢熟络，把好感藏在愿意花时间陪伴的行动里。平常最享受的，是一起发现小小的意外。"
  ],
  "QFHI": [
    "月光收藏家",
    "歌单发你了，是我最近单曲循环的那首。",
    "你喜欢自然熟起来，享受留白，也会用歌单、照片、小礼物分享心事。愿意让你慢一点的人，通常更容易听懂这些细节。"
  ]
};

export const palettes = {
  "lilac": [
    "#e8dcff",
    "#332357",
    "#742bd5"
  ],
  "peach": [
    "#ffdfc6",
    "#522a28",
    "#a8492d"
  ],
  "rose": [
    "#f7d8e6",
    "#512646",
    "#ab376c"
  ],
  "mint": [
    "#cef0df",
    "#224639",
    "#28684b"
  ],
  "amber": [
    "#fff1c7",
    "#4e3927",
    "#875016"
  ],
  "sky": [
    "#deebff",
    "#293d5b",
    "#365f96"
  ]
};

function tally(answers, selectedScenes) {
  const totals = [...axes, ...relationshipAxes].map(() => [0, 0]);
  selectedScenes.forEach((scene, index) => { totals[scene.axis][scene.options[answers[index]].pole] += 1; });
  return totals;
}

function describe(axis, votes) {
  if (votes[0] === votes[1]) {
    return { axis, pole: null, name: "两种方式都会用", description: axis.tie, votes };
  }
  const pole = votes[0] > votes[1] ? 0 : 1;
  const [letter, name, description, partner] = axis.poles[pole];
  return { axis, pole, letter, name, description, partner, votes };
}

export function classify(answers, selectedScenes = scenes) {
  if (!answers || selectedScenes.length !== 18 || selectedScenes.some((scene, index) => !scene.options[answers[index]])) return null;
  const votes = tally(answers, selectedScenes);
  const results = axes.map((axis, index) => describe(axis, votes[index]));
  const relationship = relationshipAxes.map((axis, index) => describe(axis, votes[axes.length + index]));
  const code = results.map(item => item.letter).join("");
  const [name, quote, description] = types[code];
  const usual = results[0];
  const planned = results[1];
  const unanimous = (axis) => axis.votes.includes(0);
  const palette = [usual.pole === 0 ? "peach" : "lilac", planned.pole === 0 ? "mint" : "rose"][(results[2].pole + results[3].pole) % 2];
  return {
    code, name, quote, description, axes: results, relationship, palette,
    evidence: selectedScenes.map((scene, index) => ({
      id: scene.id, slot: scene.slot, topic: scene.topic, axis: scene.axis,
      title: scene.title, answer: scene.options[answers[index]].text,
      pole: scene.options[answers[index]].pole,
    })),
    habits: {
      social: unanimous(usual) ? (usual.pole === 0 ? "2" : "0") : "1",
      planning: unanimous(planned) ? (planned.pole === 0 ? "plan" : "go") : "mix",
    },
  };
}

export function exampleType(code, relationshipChoices = [0, 0]) {
  return classify(scenes.map(scene => scene.options.findIndex(option =>
    scene.axis < axes.length ? axes[scene.axis].poles[option.pole][0] === code[scene.axis]
      : option.pole === relationshipChoices[scene.axis - axes.length]
  )));
}

export function pairedTypes(one, two) {
  if (!one || !two) return [];
  const first = [...one.relationship, ...one.axes];
  const second = [...two.relationship, ...two.axes];
  return first.map((left, i) => ({ left, right: second[i] }))
    .filter(({ left, right }) => left.pole !== null && right.pole !== null && left.pole !== right.pole);
}
