import { fields, heightBands } from "./questions.js";

export const dimensions = ["年龄、城市及个人条件", "工作、收入与住房", "双方家庭", "性格与沟通", "日常习惯", "兴趣与未来"];
export const stretchKeys = ["income", "education", "housing", "family", "location"];

export function normalizeCity(value = "") {
  return value.normalize("NFKC").trim().replace(/\s+/gu, "").replace(/(?:特别行政区|市)$/u, "").toLowerCase();
}

export function validCity(value) {
  return /^(?:[\p{Script=Han}]{2,16}|[a-z][a-z'-]{1,22})$/u.test(value);
}

export function label(field, value) {
  return fields[field].options?.find(([key]) => key === value)?.[1] ?? "";
}

const incomeFloors = ["", "¥5,000", "¥8,000", "¥12,000", "¥20,000", "¥35,000"];
const supportAdvice = {
  independent: "你的父母目前基本能经济自理。你们可以提前聊聊未来如果有养老支出，怎样给双方家庭留预算。",
  occasional: "比较适合能理解偶尔帮衬父母、愿意把双方临时支出说清楚的人。",
  regular: "优先找能理解你定期承担父母开支、愿意把这部分纳入共同预算的人。",
};
const personalityAdvice = {
  "0": "你更常通过独处恢复精力，比较适合尊重个人空间、能接受各有安排的人。",
  "1": "你更喜欢和熟悉的人小范围相处，比较适合能在两人相处和各自社交之间留出余地的人。",
  "2": "你更常通过社交活动恢复精力，可以留意愿意理解你的社交时间、能提前商量见面安排的人。",
};
const conflictAdvice = {
  now: "有分歧时，可以留意是否愿意及时把问题说清楚，也能尊重另一方需要暂停的时间。",
  same: "有分歧时，可以找愿意缓一下、当天再把问题接着聊的人。",
  later: "有分歧时，比较适合能留一点冷静时间、也愿意约定什么时候回来谈的人。",
};
const spendingAdvice = {
  save: "你习惯先做预算，重点了解对方对储蓄和大额开销的安排。",
  balance: "你希望储蓄和体验各有空间，可以聊聊每月两人分别愿意留给它们多少。",
  enjoy: "你在意生活体验，可以先确认对方能接受怎样的日常消费和储蓄比例。",
};

function incomeTarget(me) {
  if (me.incomeWish === "near") {
    const band = label("income", me.income);
    return band ? "可以从和你同档的税后月收入（" + band + "）开始了解，相邻档也在你的接受范围。" :
      "你选了收入相近。补充自己的收入档后，可以把相近落实到具体范围。";
  }
  if (incomeFloors[me.incomeWish]) {
    return "按你填写的择偶预期，优先了解税后月收入至少 " + incomeFloors[me.incomeWish] + " 的人。";
  }
  return "你可以先聊每月开支、储蓄和分担方式，再决定需要怎样的收入安排。";
}

function preferredLocation(me) {
  if (me.locationWish === "same") return "优先考虑也在" + me.city + "生活的人，见面和相处安排更直观。";
  if (me.locationWish === "planned") return "从" + me.city + "和能够约见的其他城市考虑，异地时先定同城目标。";
  if (me.locationWish === "any") return "地点可以灵活，重点确认你们实际能在哪座城市见面和生活。";
  return "可以先从" + me.city + "出发，结合你能接受的见面频率确定范围。";
}

function stretchTarget(me, target) {
  if (target === "income") {
    const floor = incomeFloors[me.incomeWish] ? Number(me.incomeWish) : Number(me.income);
    const type = !Number.isFinite(floor) ? null : label("income", String(Math.min(floor + 1, 5)));
    return {
      title: type && floor < 5 ? "试着接触税后月收入 " + type + " 的人" : "把条件放在收入的稳定性和生活安排",
      text: type && floor < 5 ? "按你的收入档或已填写的最低预期，往上一档试。先聊工作时间、开支分担和双方对共同生活的投入。" :
        "先定你期望的收入和工作节奏，再看对方能否接受你的职业、家庭责任和定居计划。",
      prompt: "如果我们收入和工作节奏不同，你希望怎么分担开支、怎么安排两个人的时间？",
    };
  }
  if (target === "education") {
    const band = Math.max(Number(me.education ?? -1), Number(me.educationWish === "any" ? -1 : (me.educationWish ?? -1)));
    const next = label("education", String(band + 1));
    return {
      title: band >= 0 && band < 3 ? "可以接触" + next + "的人" : "可以接触教育或职业经历不同的人",
      text: "把学历预期转成你真正想要的东西，例如共同话题、学习节奏，或对未来职业安排的理解。",
      prompt: "你下班后通常会做什么？未来一两年有没有想学的新东西？",
    };
  }
  if (target === "housing") return {
    title: me.housingWish === "own" ? "把已有住房细化到适合一起居住" : "可以接触已有自有住房的人",
    text: "先了解住处是不是双方都愿意住，通勤、房贷和与父母居住的安排都值得一起确认。",
    prompt: "你对以后住哪里有计划吗？现有住处、还贷和通勤怎么安排比较舒服？",
  };
  if (target === "family") return {
    title: "可以接触家里愿意帮一把的人",
    text: "问清楚支持的方式和条件，例如购房、育儿或日常帮助。也听听对方能否接受你自己的家庭责任。",
    prompt: "双方家里如果愿意提供支持，会希望参与哪些决定？",
  };
  return {
    title: "把认识对象的范围扩到其他城市",
    text: "可以试一个来往方便、也有定居可能的城市。先谈见面频率、异地多长时间和谁有迁居空间。",
    prompt: "如果相处合适，我们能否定一个同城时间？这对各自的工作和家里有什么影响？",
  };
}

export function singleReport(me, stretch = me.stretch || "income") {
  const hobbies = (me.hobbies ?? []).map(key => label("hobbies", key));
  const age = me.ageWish === "same" ? "优先同一年龄段" : me.ageWish === "near" ? "同一或相邻年龄段都可考虑" : "";
  const education = me.educationWish && me.educationWish !== "any" ? label("educationWish", me.educationWish) : "";
  const home = me.housingWish === "own" ? "住房希望对方已有自有住房，后续聊能否共同居住。" : "可以先谈租住或买房时机，以及哪种安排对两人都可行。";
  const familyDecision = me.familyDecision === "couple" ? "你倾向两个人先决定，再各自和父母沟通。" :
    me.familyDecision === "listen" ? "你愿意听父母的意见，也希望两人最后能商量一致。" :
    me.familyDecision === "together" ? "涉及家里出钱出力时，你愿意事先谈清父母能参与的范围。" : "";
  const partnerHelp = me.homeHelpWish === "want" ? "你希望对方家里也能提供部分购房支持，具体额度和条件可以再聊。" : "";
  const familyWish = me.familyWish === "independent" ? "你也希望对方父母能基本经济自理。" : "";
  const help = me.homeHelp === "yes" ? "如果家里会提供买房支持，先谈支持的条件和居住决定。" :
    me.homeHelp === "no" ? "你预计主要靠自己或两人安排住房，可以早点聊储蓄和分担方式。" : "";
  const planning = me.planning === "plan" ? "你喜欢提前约时间，可以留意对方能否按约见面、有变动时提前说。" :
    me.planning === "go" ? "你喜欢临时决定活动，可以先看看对方对临时邀约的接受程度。" : "";
  const smokeSelf = ["sometimes", "often"].includes(me.smoking) ? "你目前吸烟，可以早一点确认对方是否接受。" : "";
  const smoke = me.smokingWish === "none" ? "你的明确偏好是对方不吸烟。" : "";
  const routine = me.routine === "early" ? "你习惯早睡早起，可以看看对方是否能配合你的休息时间。" :
    me.routine === "night" ? "你常睡得晚，有需要时可以先确认作息不同会不会互相打扰。" :
    "日常相处可以从休息时间和周末安排聊起。";
  const result = [
    ["个人条件", [preferredLocation(me), age && age + "。", education && "学历期望为" + education + "。"].filter(Boolean).join("")],
    ["收入与住房", [incomeTarget(me), home, spendingAdvice[me.spending]].filter(Boolean).join("")],
    ["双方家庭", [supportAdvice[me.parentMoney] || "可以先了解双方父母的经济情况、照护责任和对两人决定的参与程度。", familyWish, help, familyDecision, partnerHelp].filter(Boolean).join("")],
    ["性格与沟通", [personalityAdvice[me.social] || "可以优先了解能互相商量、尊重彼此社交节奏的人。", conflictAdvice[me.conflict], planning].filter(Boolean).join("")],
    ["生活习惯", [routine, smokeSelf, smoke].filter(Boolean).join("")],
    ["兴趣与未来", [hobbies.length ? "可以从" + hobbies.slice(0, 3).join("、") + "找约会活动。" : "可以从一次双方都愿意尝试的活动开始了解彼此。",
      me.hobbyWish === "yes" ? "你希望至少有一个可以一起做的爱好。" : "",
      me.children === "yes" ? "你希望未来有或再有孩子，这一点适合早点了解对方。"
        : me.children === "no" ? "你计划不生或不再生，适合早点了解对方对这件事的安排。" : ""].filter(Boolean).join("")],
  ];
  const identity = [me.city, label("age", me.age), label("education", me.education), label("income", me.income), label("housing", me.housing)].filter(Boolean);
  const traits = [
    me.locationWish === "same" && "同城",
    me.incomeWish === "near" && me.income !== undefined && "收入相近",
    me.parentMoney === "regular" && "能理解家庭责任",
    me.social === "0" && "尊重独处时间",
    me.housingWish === "own" && "已有住房",
  ].filter(Boolean);
  const partner = me.gender === "man" ? "女生" : "男生";
  const headline = traits.length ? traits.slice(0, 2).join("、") + "的" + partner : "愿意商量未来生活安排的" + partner;
  return {
    identity, rows: result, spendingText: spendingAdvice[me.spending] || "", stretch: stretchTarget(me, stretch),
    headline,
    lead: me.city + " · 根据你填写的条件与偏好整理",
  };
}

function heightMatch(person, other) {
  const range = heightBands[person.heightWish];
  if (!range || !other.height) return null;
  const height = Number(other.height);
  return height >= range[0] && height <= range[1];
}

function workMatch(person, other) {
  if (person.jobPriority === "similar") {
    return person.workKind && other.workKind ? person.workKind === other.workKind : null;
  }
  if (person.jobPriority === "steady") {
    return other.workStability ? other.workStability === "steady" : null;
  }
  if (person.jobPriority === "overlap") {
    return ["regular", "flex"].includes(other.workSchedule) ? true : null;
  }
  return null;
}

const directRules = [
  { field: "heightWish", group: 0, title: "身高偏好", test: heightMatch, tip: "你填写的范围可以当作认识人的参考，见面时也可以感受真实的眼缘。" },
  { field: "jobPriority", group: 1, title: "对工作的期待", test: workMatch, tip: "问问对方平常的工时、收入波动和每周可以留给相处的时间。" },
  { field: "locationWish", group: 0, title: "城市范围", test: (a, b) => a.city === b.city || (a.locationWish === "planned" ? null : false), tip: "如果暂时异地，先聊什么时候能同城。" },
  { field: "ageWish", group: 0, title: "年龄段", test: (a, b) => Math.abs(Number(a.age) - Number(b.age)) <= (a.ageWish === "same" ? 0 : 1), tip: "可以确认年龄差本身与生活阶段分别有多重要。" },
  { field: "educationWish", group: 0, title: "学历预期", test: (a, b) => b.education === undefined ? null : Number(b.education) >= Number(a.educationWish), tip: "可以先聊各自看重学历背后的什么经历。" },
  { field: "incomeWish", group: 1, title: "收入预期", test: (a, b) => b.income === undefined ? null : a.incomeWish === "near"
    ? (a.income === undefined ? null : Math.abs(Number(a.income) - Number(b.income)) <= 1) : Number(b.income) >= Number(a.incomeWish),
    tip: "可以先聊收入预期、共同开支和各自愿意怎么分担。" },
  { field: "housingWish", group: 1, title: "住房预期", test: (_, b) => b.housing === undefined ? null : b.housing === "own", tip: "可以确认双方是否接受先租住、在哪住和买房时机。" },
  { field: "familyWish", group: 2, title: "父母经济负担", test: (_, b) => b.parentMoney === undefined ? null : b.parentMoney === "independent", tip: "可以先了解支持父母的频率、额度和双方的家庭预算。" },
  { field: "homeHelpWish", group: 2, title: "家里对购房的支持", test: (_, b) => !b.homeHelp || b.homeHelp === "maybe" ? null : b.homeHelp === "yes",
    tip: "可以问清购房支持是不是确定，以及会不会影响居住地或家庭决定。" },
  { field: "socialWish", group: 3, title: "社交节奏", test: (a, b) => a.social === undefined || b.social === undefined ? null : Math.abs(Number(a.social) - Number(b.social)) <= 1, tip: "可以聊聊见面频率和各自需要多少独处时间。" },
  { field: "smokingWish", group: 4, title: "吸烟习惯", test: (_, b) => b.smoking === undefined ? null : b.smoking === "none", tip: "可以确认是否都能接受对方目前的习惯和室内安排。" },
  { field: "hobbyWish", group: 5, title: "共同爱好", test: (a, b) => !a.hobbies?.length || !b.hobbies?.length ? null : a.hobbies.some(hobby => b.hobbies.includes(hobby)), tip: "可以列出各自想尝试的事，挑一件双方都愿意做的活动。" },
];

const bothRules = [
  { field: "familyLiving", group: 2, title: "和双方父母的居住打算",
    test: (a, b) => a === "discuss" || b === "discuss" ? null : a === b || (a !== "together" && b !== "together"),
    tip: "先聊以后希望跟父母住多近、各自有哪些养老和照护责任。" },
  { field: "spending", group: 1, title: "日常消费方式", test: (a, b) => a === b || a === "balance" || b === "balance", tip: "试着一起分配储蓄、日常花费和约会预算。" },
  { field: "familyDecision", group: 2, title: "父母参与程度", test: (a, b) => a === b, tip: "两个人意见一致、父母有不同想法时，希望先怎么处理？" },
  { field: "planning", group: 3, title: "约会安排", test: (a, b) => a === b || a === "mix" || b === "mix", tip: "可以一起约定哪些活动提前计划，哪些当天再决定。" },
  { field: "conflict", group: 3, title: "分歧后的沟通时机", test: (a, b) => a === b, tip: "有一方需要暂停时，你们能不能约一个都接受的时间继续聊？" },
  { field: "routine", group: 4, title: "作息节奏", test: (a, b) => a === b || a === "flex" || b === "flex", tip: "作息不同时，可以先聊睡眠和周末安排。" },
  { field: "children", group: 5, title: "是否要孩子", test: (a, b) => a === "unsure" || b === "unsure" ? null : a === b, tip: "你们可以先分别说明自己的打算，以及哪些现实条件会影响决定。" },
];

function evaluateRule(rule, passed, direction) {
  return {
    title: rule.title,
    group: rule.group,
    tip: rule.tip,
    direction,
    result: passed === true ? "yes" : passed === false ? "no" : "pending",
  };
}

export function pairReport(a, b) {
  const checked = [];
  for (const [from, to, direction] of [[a, b, "第一位的期待"], [b, a, "第二位的期待"]]) {
    for (const rule of directRules) {
      if (from[rule.field] === undefined || from[rule.field] === "any") continue;
      checked.push(evaluateRule(rule, rule.test(from, to), direction));
    }
  }
  for (const rule of bothRules) {
    if (a[rule.field] === undefined && b[rule.field] === undefined) continue;
    const decision = a[rule.field] === undefined || b[rule.field] === undefined ? null : rule.test(a[rule.field], b[rule.field]);
    checked.push(evaluateRule(rule, decision, "双方安排"));
  }
  const valid = checked.filter(row => row.result !== "pending");
  const matches = valid.filter(row => row.result === "yes").length;
  const differingGoals = checked.some(row => row.title === "是否要孩子" && row.result === "no");
  const symmetricScope = a.gender !== b.gender;
  return {
    checked, matches, comparable: valid.length, differingGoals, symmetricScope,
    score: symmetricScope && valid.length >= 6 && !differingGoals ? Math.round(matches / valid.length * 100) : null,
    dimensions: dimensions.map((title, index) => {
      const rows = checked.filter(row => row.group === index);
      return { title, comparable: rows.filter(row => row.result !== "pending").length, matches: rows.filter(row => row.result === "yes").length };
    }),
    hobbies: (a.hobbies ?? []).filter(hobby => b.hobbies?.includes(hobby)).map(hobby => label("hobbies", hobby)),
  };
}

export const examples = [
  { gender: "woman", city: "常州", age: "2", education: "2", income: "2", housing: "rent", parentMoney: "independent",
    homeHelp: "no", familyDecision: "listen", children: "yes", social: "1", conflict: "same", routine: "early",
    spending: "save", smoking: "none", hobbies: ["music", "food", "outdoor"], locationWish: "same", ageWish: "near",
    educationWish: "any", incomeWish: "near", housingWish: "any", familyWish: "any", smokingWish: "none",
    socialWish: "any", hobbyWish: "yes", stretch: "income" },
  { gender: "man", city: "常州", age: "3", education: "2", income: "3", housing: "own", parentMoney: "occasional",
    homeHelp: "maybe", familyDecision: "listen", children: "yes", social: "1", conflict: "later", routine: "night",
    spending: "balance", smoking: "none", hobbies: ["music", "sport"], locationWish: "same", ageWish: "near",
    educationWish: "any", incomeWish: "2", housingWish: "any", familyWish: "any", smokingWish: "none", socialWish: "near", hobbyWish: "yes" },
];
