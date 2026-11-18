import { label } from "./engine.js";

const stretchActions = {
  income: {
    title: "把收入期待变成一份生活预算",
    reason: "认识收入更高一档的人时，双方的工作时间和分担方式都值得问清。",
    action: "先写下自己能承担的房租、通勤和固定开支，再选两项想一起分担的费用。下次见面就能具体聊收入和生活计划。",
  },
  education: {
    title: "去能交流兴趣的地方认识人",
    reason: "共同话题需要在实际交流里才能看出来。",
    action: "找一个自己真想参加的读书会、课程或行业活动，挑一个愿意深入聊的话题。见面时也说说自己最近在学什么。",
  },
  housing: {
    title: "把「有房」细化成居住方案",
    reason: "住处合不合适，取决于两个人日常怎么过。",
    action: "列出能接受的通勤时长、每月住支和同住安排，再写下先租一年、直接住现有住房两个方案，看看哪一步还需确认。",
  },
  family: {
    title: "先理清自己家能帮什么",
    reason: "家里提供帮助时，方式和参与的边界同样重要。",
    action: "把双方需要确认的事分成出钱、照护和决定权三项。先填自己能说清楚的部分，下次请对方也分享能确定的安排。",
  },
  location: {
    title: "挑一座真的见得到的城市",
    reason: "多一个城市，也多一段需要安排的通勤和见面时间。",
    action: "先选一座往返方便的城市，写下你能接受的往返时间和每月见面次数，再考虑这座城市有没有长期生活的可能。",
  },
};

function profileAction(me, axis) {
  if (axis !== "family" && me.parentMoney === "regular") return {
    title: "把家庭责任提前讲清楚",
    reason: "你会定期承担一部分父母开支。",
    action: "选一个你方便分享的支出区间，说明这笔开支的频率，以及突发情况怎么处理。谈到共同预算时，可以直接把这部分列进去。",
  };
  if (axis !== "housing" && me.housingWish === "own") return {
    title: "确定自己最看重住房的哪一点",
    reason: "你填写了希望对方已有住房。",
    action: "在稳定住处、通勤、独立居住和购房时机里，先挑最看重的一项，再想想如果这一项能满足，哪些安排也愿意商量。",
  };
  if (axis !== "location" && me.locationWish === "same") return {
    title: "给自己安排一次同城见面的机会",
    reason: "你希望另一半也在" + me.city + "生活。",
    action: "约一场交通方便、时间能确定的活动，或者请一位朋友介绍同城、生活节奏接近的人。先从一次一小时左右的见面开始。",
  };
  return {
    title: "给择偶条件排个先后",
    reason: "年龄、收入、住房和家庭安排可以有不同优先级。",
    action: "写下三条你最在乎的条件，圈出见面前就想确认的一条。其他两条各准备一个可以讨论的问题。",
  };
}

function dateAction(me) {
  if (me.hobbies?.length) {
    const hobby = label("hobbies", me.hobbies[0]);
    return {
      title: "用一个兴趣安排下一次见面",
      reason: "你的问卷里选了" + hobby + "。",
      action: "挑一个你自己也愿意去的活动，准备两个时间给对方选。结束后可以聊聊各自平时还想尝试什么。",
    };
  }
  if (me.conflict === "same" || me.conflict === "later") return {
    title: "练习说清什么时候接着聊",
    reason: "遇到分歧时，你更习惯先缓一下。",
    action: "准备一句自己说得出口的话，例如「我想先缓一会儿，今晚八点再聊好吗？」。给对方清楚的时间，也给自己留出空间。",
  };
  if (me.social === "0") return {
    title: "用你舒服的节奏见面",
    reason: "你更常通过独处恢复精力。",
    action: "优先约安静、能交谈的场所，留一小时左右。提前想一个你真的好奇的问题，见面后看自己想不想再约一次。",
  };
  return {
    title: "准备一段能聊开的话",
    reason: "生活习惯适合从具体场景了解。",
    action: "准备一个真实的周末例子，分享你通常怎么过，再问对方理想的一天会怎么安排。",
  };
}

export function personalActions(me, axis) {
  return [
    { when: "这周先做", ...stretchActions[axis] },
    { when: "见面前准备", ...profileAction(me, axis) },
    { when: "下次见面试试", ...dateAction(me) },
  ];
}

const pairSteps = {
  "是否要孩子": "各自说明这是已经确定的决定，还是取决于工作、经济和照护条件。如果双方都有讨论空间，再谈需要哪些条件。",
  "城市范围": "各自写下能考虑的定居城市、每月能见几次和最迟什么时候能同城，找一个双方都能做到的安排。",
  "收入预期": "各自列出能承担的共同开支和要保留的个人开支，再试着选一种分担方式，例如各出固定额或按收入比例分担。",
  "住房预期": "把先租、住现有房和计划买房列出来，各写一个能接受的条件。先谈通勤、住支和入住时间。",
  "父母经济负担": "各自说清平时会怎样支持父母，以及以后有额外支出时怎么商量。可以先从频率和可承担区间谈起。",
  "家里对购房的支持": "分别确定家里愿意支持多少、什么时候能确定，以及支持会不会带来居住或决定权的要求。",
  "父母参与程度": "用一个实际例子，例如去哪里过年，约好哪一步先两个人商量、哪一步需要和父母说。",
  "社交节奏": "各自挑一个适合见面的晚上和一段希望留给自己的时间，试一个双方都舒服的一周安排。",
  "分歧后的沟通时机": "约定一方想暂停时要说清楚何时再聊。可以先试「今天晚一点」或「明天中午」这样的具体时间。",
  "约会安排": "给下次见面留一个提前定好的时间，把地点或活动留给当天一起选。",
  "作息节奏": "各自写出最不能被打扰的休息时间，再约一段最容易同时有空的时间。",
  "吸烟习惯": "说明自己哪些场合会吸烟，聊清对方能接受的场景和底线，再决定下一步。",
  "共同爱好": "各自提一个熟悉的活动和一个想尝试的新活动，选一个双方都愿意试的小活动。",
  "日常消费方式": "选一笔普通周末的共同开支，各自说出舒服的预算，再一起定一个范围。",
};

export function pairActions(report) {
  const issues = report.checked.filter(item => item.result !== "yes")
    .sort((a, b) => Number(b.title === "是否要孩子") - Number(a.title === "是否要孩子") ||
      Number(b.result === "no") - Number(a.result === "no"));
  const seen = new Set();
  const prompts = [];
  for (const item of issues) {
    if (seen.has(item.title)) continue;
    seen.add(item.title);
    prompts.push({
      when: item.result === "no" ? "优先聊" : "先确认",
      title: item.title,
      reason: item.result === "no" ? "两份回答在这一项有差异。" : "这一项还没有足够的信息。",
      action: pairSteps[item.title] ?? item.tip,
    });
    if (prompts.length === 3) break;
  }
  if (!prompts.length || (prompts.length < 3 && report.hobbies.length)) prompts.push({
    when: "下次见面试试",
    title: report.hobbies.length ? "把共同爱好变成一次见面" : "从一个实际场景聊起",
    reason: report.hobbies.length ? "你们都选了" + report.hobbies[0] + "。" : "相处细节可以用一次具体的安排来了解。",
    action: "各提一个活动和两个空闲时间，选一个都愿意去的方案。见完面，各自说说哪里觉得舒服。",
  });
  return prompts;
}
