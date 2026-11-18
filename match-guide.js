import { label } from "./engine.js";

const ageBands = [[18, 23], [24, 27], [28, 31], [32, 35], [36, 40], [41, 45], [46, 50], [51, null]];
const ownKeys = ["education", "income", "workKind", "workSchedule", "workStability", "parentMoney", "parentSecurity", "familyCare", "familyDecision", "familyLiving", "homeHelp", "housing", "children", "relationshipGoal"];
const wishKeys = ["ageWish", "locationWish", "educationWish", "incomeWish", "heightWish", "looksWish", "jobPriority", "housingWish", "familyWish", "homeHelpWish", "smokingWish"];
const ownEvidence = (me, keys) => keys.filter(key => me[key] !== undefined && label(key, me[key])).map(key => ({ kind: "profile", topic: ({ workKind: "你的工作", workSchedule: "你的工时", workStability: "工作与收入", parentMoney: "你对父母的经济支持", parentSecurity: "父母养老", familyCare: "照护责任", familyDecision: "家庭决定", familyLiving: "居住打算", income: "你的月收入", education: "你的学历", homeHelp: "家里购房支持", housing: "你的住房", children: "孩子计划", relationshipGoal: "关系方向" })[key], answer: label(key, me[key]) }));
const answer = (me, slot) => me.persona?.evidence?.find(item => item.slot === slot);
const evidence = (me, slots) => slots.map(slot => answer(me, slot)).filter(Boolean).map(item => ({ kind: "scene", ...item }));
const axisEvidence = (me, axis) => (me.persona?.evidence ?? []).filter(item => item.axis === axis && item.pole === [...me.persona.axes, ...me.persona.relationship][axis].pole).slice(0, 2).map(item => ({ kind: "scene", ...item }));
const joined = (...parts) => parts.filter(Boolean).join("");

// Fit uses lived circumstances and scene responses. Wish fields are deliberately
// excluded here; they only enter wishes and tradeoffs further below.
export function inferNeeds(me) {
  const p = me.persona;
  return {
    quiet: p?.axes[0]?.pole === 1,
    planned: p?.axes[1]?.pole === 0,
    indirect: p?.axes[2]?.pole === 1,
    close: p?.axes[3]?.pole === 0,
    talkSoon: p?.relationship.find(a => a.axis.key === "repair")?.pole === 0,
    comfort: p?.relationship.find(a => a.axis.key === "support")?.pole === 0,
    muted: ["message", "boundary"].filter(slot => answer(me, slot)?.pole === 1),
    variable: ["variable", "transition"].includes(me.workStability),
    busy: ["busy", "shifts"].includes(me.workSchedule),
    care: me.familyCare === "main",
    financialCare: me.parentMoney === "regular" || me.parentSecurity === "dependent",
    hasPersona: Boolean(p),
  };
}

function opening(me, n) {
  if (n.muted.length === 2) return {
    title: "你把体谅留给了别人，把失落留给了自己。",
    text: "在回复消息和家人面前的两个场景里，你都先把介意收了起来。这让相处看起来很顺，却也可能让对方一直以为你没有需要。你值得认真观察的，是你说出不舒服之后，仍愿意靠近、愿意调整的人。",
    evidence: evidence(me, ["message", "boundary"]),
  };
  if ((n.care || n.busy) && n.comfort) return {
    title: "你已经很会撑住生活了，亲密关系里也想有人接你一下。",
    text: "从工作、家庭的安排看，你日常要处理的事不少。情境题里，你又更常先要一点理解。如果对方只夸你能干，把所有事继续交给你，这段关系可能让你更累。值得靠近的人，会听见你的疲惫，也接手一件事。",
    evidence: [...ownEvidence(me, [n.care ? "familyCare" : "workSchedule"]), ...axisEvidence(me, 5)],
  };
  if (n.quiet && n.indirect) return {
    title: "你在等一个回应，对方却可能还没收到你的信号。",
    text: "你的好感更常藏在细节里，刚认识时也倾向先观察。遇到同样等信号的人，可能互有好感却都没往前走。可以优先认识愿意主动约一次、也能给你熟悉时间的人。你这边也需要给一点对方看得懂的回应。",
    evidence: [...axisEvidence(me, 0).slice(0, 1), ...axisEvidence(me, 2).slice(0, 1)],
  };
  if (n.planned && n.close) return {
    title: "一场很浪漫的约会，未必抵得上一个能兑现的下周。",
    text: "你在意关系有进度，也需要日常能见到、联系得到。短时间的热烈容易让人心动，但真正值得你投入的，要在普通工作日也腾得出位置。多看两次临时变动后的处理，比听一次关于未来的保证更有用。",
    evidence: [...axisEvidence(me, 1).slice(0, 1), ...axisEvidence(me, 3).slice(0, 1)],
  };
  if (!n.close && n.hasPersona) return {
    title: "你愿意认真喜欢一个人，也想保留完整的自己。",
    text: "你的选择里有独处、工作和个人兴趣的位置。每天黏在一起未必让你更安心；能各自生活、到约好的时间又认真出现，可能更适合你。也要让对方知道，你留出空间的时候仍然在意这段关系。",
    evidence: axisEvidence(me, 3),
  };
  if (n.hasPersona) return {
    title: "你敢往前走，也需要看见对方在向你走来。",
    text: "你愿意在相处里主动一点。接下来要留意，每次约会、每次和好，是不是都靠你启动。可以给对方一次完整安排见面的机会，看看这段关系有没有两个人一起经营的可能。",
    evidence: axisEvidence(me, 0),
  };
  return { title: "先认识你的生活，再谈谁能一起生活。", text: "目前还缺少相处反应，只能先整理现实条件。完成情境题后，再看看你会怎样靠近、表达和处理失落。", evidence: [] };
}

function work(me, n) {
  let value, text, caution;
  if (n.variable) {
    value = "优先认识收入可预期、工时能约定的人";
    text = "你自己的收入或工作正有波动。两个人中有一方的基本开支来源更可预期，会比较容易商量共同生活。可从机关、事业单位、央国企的稳定岗位，以及业务和合同较稳定的民企、外企岗位中了解。";
    caution = "同为创业、个体经营或项目制也可以，但要把淡季是否重合、固定支出和备用安排说清。两个人都靠下一单来维持生活，会增加需要协调的事。";
  } else if (n.busy || n.care || n.close) {
    value = "先看能稳定安排见面的人，再看单位名称";
    text = "可从固定工时的企业职能岗、机关或事业单位岗位开始，也可以了解能自主排期的个体经营者、自由职业者。关键是你的空闲时间里，对方有没有真实可用的时间。";
    caution = n.busy ? "你自己已经经常加班、出差或轮班，再找同样日程不定的人，要先试排两周的共同时间。同行能理解工作，也可能恰好一起忙。" : n.care ? "你有主要照护责任，长期驻外、频繁出差或完全无法调班的工作，可能让日常支持难以落地。" : "若对方经常驻外、连周末都无法确定，而你需要持续陪伴，即使收入和头衔很亮眼，也要先验证时间是否够用。";
  } else if (me.workStability === "steady" && !n.close && n.hasPersona) {
    value = "稳定岗位与有成熟安排的自雇工作，都有了解空间";
    text = "你自己的安排较可预期，也能接受双方各自有时间。除单位、企业岗位外，可把个体经营、自由职业、项目制工作纳入观察。重点问清收入如何波动、忙季多长、约好的时间怎样保留。";
    caution = "能接受各自忙，不等于要由你独自承担共同开支。愿意支持对方发展，也需要明确双方各自承担什么。";
  } else {
    value = "先核实实际工时、合同和收入波动";
    text = "机关事业单位、央国企、民企、外企、个体和灵活就业，都需要看具体岗位。可以先认识愿意讲清工作日程、未来城市与生活预算的人，再判断有没有一起生活的条件。";
    caution = "职业名称本身不能说明这个人是否体贴、是否顾家。尤其学校、医院、企业里的值班、轮班和出差，需要单独问。";
  }
  return { heading: "工作类型与相处时间", value, text, caution,
    evidence: [...ownEvidence(me, ["workKind", "workSchedule", "workStability", ...(n.care ? ["familyCare"] : [])]), ...(n.close ? axisEvidence(me, 3).slice(0, 1) : [])],
    ask: "拿接下来两周来说，我们哪两次能确定见面？临时有事的话，谁来重新安排？" };
}

function family(me, n) {
  const burden = n.care || n.financialCare;
  const value = burden ? "家庭责任说得清，有人分担，也尊重你对父母的责任" : "家里能各自生活，支持小家时也给决定空间";
  const text = burden ? "你已经承担了一部分照护或养老责任。更值得了解的家庭，是父母已有日常安排，子女之间能说清分工，遇到事有备用人手。对方可以有家庭责任，但不能默认以后由你接住两边的所有事。" : "可以优先了解父母的基本生活有安排、家庭内部能商量的人。家里有房、能出钱是具体条件，不能替代对方处理不同意见的能力。";
  const living = { separate: "你希望各住各的，要确认独立居住能否落实，以及对方是否愿意自己和父母沟通。", nearby: "你希望住得近但分开，要确认通勤、房租或房贷，以及临时照护怎样衔接。", together: "你可以考虑同住，更需要提前谈清房间空间、家务分担和双方父母能参与哪些决定。", discuss: "居住安排还可商量，可以分别谈短期照护同住和长期同住，看看哪些能接受。" }[me.familyLiving] ?? "先分别问养老经济来源、日常照护人手、未来是否同住。";
  const caution = me.homeHelp === "no" && me.housing !== "own" ? "你填了购房主要靠自己或两个人安排。对方家能支持多少钱、是赠与还是借款、是否附带同住要求，都需要分别确认。" : "父母有退休金也可能需要照护，经济独立和照顾老人是两件要分开问的事。";
  return { heading: "家庭基础、养老与边界", value, text: text + living, caution,
    evidence: [...ownEvidence(me, ["parentMoney", "parentSecurity", "familyCare", "familyLiving", "familyDecision", "homeHelp"]), ...evidence(me, ["boundary"]).slice(0, 1)],
    ask: "如果两边父母同一周都需要帮忙，我们各能做什么？有没有别的人手，费用又怎样安排？" };
}

function money(me, n) {
  const income = label("income", me.income);
  const education = label("education", me.education);
  return { heading: "收入、学历与共同生活", value: income ? "先算生活能否运转，再看收入差多少" : "目前还不能给出有依据的收入区间",
    text: joined(income ? "你的税后月收入是「" + income + "」。可以拿这一档作为讨论共同预算的起点；它并不决定对方应该赚多少。" : "缺少你的收入和共同开支信息，无法把适配写成一个月薪数字。",
      n.financialCare ? "你还有定期支持父母的安排，两个人实际能用于小家的钱要扣除各自固定责任。" : "还要了解房贷、日常支出、工作波动和各自需要支持家里的部分。",
      education ? "你有「" + education + "」的学习经历，可从相近教育或职业经历的人开始认识，具体看能否彼此理解。" : "学历可以作为认识人的入口，还需要实际聊一聊工作、学习和未来。"),
    caution: "这份答卷无法推算你能吸引到哪一档收入或学历的人。更高学历也不能替你验证交流是否舒服、意见是否被尊重。",
    evidence: ownEvidence(me, ["income", "education", "workStability", "parentMoney", "housing"]),
    ask: "如果以后一起生活，房租或房贷、父母支持、储蓄和日常花费，各自希望怎样分担？" };
}

function ageAndLife(me, n) {
  const band = ageBands[Number(me.age)];
  const range = band ? (band[1] ? `${band[0]}–${band[1]} 岁` : `${band[0]} 岁以上`) : "与你生活阶段接近";
  const goal = { marriage: "你现在考虑合适的话结婚，适合尽早了解对方是否愿意讨论进度。", longterm: "你想先稳定交往，可以观察对方是否愿意逐步把你放进日常安排。", explore: "你想慢一点认识，要把这个节奏说给对方听，确认对方也接受。" }[me.relationshipGoal] ?? "你还没填写关系方向，先确认彼此是准备长期交往，还是先慢慢了解。";
  return { heading: "城市、年龄与人生进度", value: `${me.city || "常住地"}先见面 · 对照生活阶段`,
    text: `你在${range}这个阶段。可以先从同城、未来一两年安排接近的人认识，年龄相近只是一种入口。` + goal + (me.children === "no" ? "你计划不生或不再生，这件事需要双方明确一致。" : me.children === "yes" ? "你希望有或再有孩子，需要对方愿意谈具体照护和工作分担。" : "孩子计划未定时，先听双方各自的想法。"),
    caution: n.close || n.care ? "异地需要另外验证见面和照护安排。年龄更大或更小，都不能直接说明成熟度和投入意愿。" : "若考虑异地，先确认谁有迁居空间、何时能同城。成熟感要从面对分歧和兑现安排中观察。",
    evidence: ownEvidence(me, ["relationshipGoal", "children", "familyCare"]),
    ask: "接下来一年你打算在哪生活？如果相处不错，你希望我们什么时候一起聊更长期的安排？" };
}

function style(me, n) {
  if (!n.hasPersona) return null;
  return {
    title: n.indirect ? "愿意问清楚，也愿意做出回应的人" : n.talkSoon ? "表达清楚，分歧后也愿意回来的人" : "能留空间，重要的事又不躲开的人",
    qualities: [
      { title: n.quiet ? "有一点主动，不催你热络" : "能接住主动，也会主动一次", text: n.quiet ? "会提一个具体邀约，见面时愿意分享自己，也给你慢慢说话的时间。一直让你追着确认的人，容易让你卡在猜测里。" : "你约过一次之后，对方也会提下次去哪、哪天有空。你负责暖场，并不意味着所有相处都要靠你张罗。", evidence: axisEvidence(me, 0) },
      { title: n.comfort ? "心疼你之后，能接走一件事" : "愿意一起解决，又不替你做主", text: n.comfort ? "你说累时，先听完，再问能接手什么。接下来真的去订票、洗碗或安排一次见面，让体贴落到你的日常。" : "愿意和你分清问题、承担一部分，也会确认你是否需要建议。遇到不同看法时，能保留你的决定空间。", evidence: axisEvidence(me, 5) },
      { title: n.talkSoon ? "不让一次暂停变成失联" : "给你缓冲，也把事情谈完", text: n.talkSoon ? "情绪上来可以暂停，但会说何时继续，之后真的回来谈。你也需要给对方一点整理情绪的时间，才有机会把话说进心里。" : "能接受你先冷静，又会在约好的时间接着聊。两个人都等事情自己过去，反而可能把介意越攒越多。", evidence: axisEvidence(me, 4) },
    ],
    scene: n.close ? "一个普通的周三，你说今天很累。对方先听完，告诉你周五几点能见；临时加班时，也会主动改约。你能看见自己在对方的日程里。" : "一个普通的周日，你想独自待一下午。对方能安心去做自己的事，晚上按约出现，认真听你讲今天。你不用靠一直在线来证明喜欢。",
    note: "这是一幅待见面验证的相处画面。四字母人格只帮助描述你，不用来给对象贴配对结论。",
  };
}

function tradeoffs(me, n) {
  const rows = [];
  const add = (id, title, text, action, proof) => rows.push({ id, title, text, action, evidence: proof });
  if (n.muted.length) add("unspoken", "你让过的那一步，对方可能真的没有看见", "你在「" + answer(me, n.muted[0]).topic + "」里先收起了不舒服。如果再遇到习惯等你开口的人，你可能一边觉得自己很体谅，一边积累失望。这还不能说明你平时都这样，但值得留意。", "下次把一件小需求说具体，再看对方是否理解并调整。先验证表达后的回应，再猜对方爱不爱。", evidence(me, n.muted));
  if (me.incomeWish && /^\d$/.test(me.incomeWish) && me.income !== undefined && Number(me.incomeWish) > Number(me.income)) add("income-gap", "你期待的收入高于自己，这份差距要落到日常里看", `你填的是${label("income", me.income)}，对方的收入期待是「${label("incomeWish", me.incomeWish)}」。这个期待可以保留，但目前没有候选人的工时、支出和择偶意愿，不能据此说这就是你能匹配到的人。` + (n.close ? "你还需要稳定陪伴，收入与时间需要同时核实。" : "收入更高也需要核实双方对费用和决定权的看法。"), "见面同时问工作日程和开支分担。对方是否尊重你，不能靠收入替你回答。", [...ownEvidence(me, ["income"]), ...(n.close ? axisEvidence(me, 3).slice(0, 1) : [])]);
  if (me.jobPriority === "similar" && (n.busy || n.variable)) add("same-work", "同行可能更懂你，也可能和你一起抽不出时间", "你希望工作类型相近，而自己的工时或收入有变动。熟悉同一行的辛苦，不代表两个人的忙季和生活责任能自动错开。", "先排两周的共同时间，再问一次收入低谷是否会重合。能协调，比只是同行更有参考价值。", ownEvidence(me, ["workKind", "workSchedule", "workStability"]));
  if (me.homeHelpWish === "want" && ["separate", "nearby"].includes(me.familyLiving)) add("support-boundary", "期待家里出一份力，也需要把小家的边界谈明白", "你希望对方家能支持购房，也希望分开居住。这两件事可以同时实现，但需要对方家明确同意；不能把支持金额和决定空间一起默认下来。", "分别问钱是什么性质、住处谁定、是否附带同住要求。把边界谈清以后，再把支持算进计划。", ownEvidence(me, ["familyLiving", "homeHelp", "familyDecision"]));
  if (me.familyWish === "independent" && n.financialCare) add("family-balance", "你需要顾自己的家，对方也会关心这部分怎样安排", "你希望对方父母经济自理，同时自己有养老或定期补贴责任。双方负担可以不同；关系能否成立，还要看对方是否了解并愿意接受，而不是只看对方家能提供多少。", "先说清自己的固定责任和可调整部分，也了解对方家的未来照护。双方都看见真实情况，再判断是否愿意。", ownEvidence(me, ["parentMoney", "parentSecurity", "familyCare"]));
  if (me.jobPriority === "steady" && n.close) add("stable-time", "工作稳定和有时间陪你，要分开确认", "你选择了稳定工作，也更常需要陪伴。单位名称能说明一部分工作环境，不能说明实际下班时间；值班、出差和临时任务仍需要问清。", "让对方说一个真实的普通工作周，看看你们能共同留下哪两个时段。", axisEvidence(me, 3));
  if (me.locationWish === "any" && (n.care || n.close)) add("distance", "城市可以放宽，日常支持却还需要落地", "你愿意不限城市，但你的陪伴需要或照护责任需要考虑。能聊得来，只完成了异地关系的一部分。", "先谈探访频率、同城时间和谁能搬，确认之后再把异地当成可执行的选择。", [...ownEvidence(me, ["familyCare"]), ...axisEvidence(me, 3).slice(0, 1)]);
  if (n.care && !rows.some(r => r.id === "family-balance")) add("care-load", "别在第一次了解时，就替对方把两边的事都接下来", "你是家里的主要照顾者。认识一个同样有家庭责任的人时，值得确认是否有其他分担者。你现在能做到，不等于以后能一直独自做完。", "列出每周必须留给家人的时间，和对方各说一次临时出事时能找谁帮忙。", ownEvidence(me, ["familyCare", "parentSecurity"]));
  if (!rows.length) add("unknown", "这次没有足够依据指出明显冲突", "这不代表你的期待都能同时满足。现在只有你这一份答卷，还不知道对方的真实条件、选择和投入意愿。", "下一次见面，请对方完整安排一次小约会，再看时间、预算和互动能不能顺畅接上。", ownEvidence(me, ["workSchedule", "familyCare"]));
  const priority = { unspoken: 0, "family-balance": 1, "income-gap": 2, "support-boundary": 3, "same-work": 4, "stable-time": 5, distance: 6, "care-load": 7, unknown: 8 };
  return rows.sort((a, b) => priority[a.id] - priority[b.id]);
}

function reflections(me, n) {
  if (!n.hasPersona) return null;
  return {
    notes: [
      ["你在关系里带来的东西", n.quiet ? "你更常先观察、慢慢了解，给关系留出了一点余地。留意细节是你的表达方式之一；也可以让别人知道，你认真听见了什么。" : "你愿意打破僵局、创造见面的机会。这个主动很有用，但下一次可以留出一点位置，让对方也为相处出一份力。"],
      ["你可能需要练习的地方", n.indirect ? "你有几次把话留在了心里。下次试着把「随便」「没事」换成一个可回应的需求，比如「改约时提前告诉我，我就不用一直等」。" : "你比较愿意把话说清。着急的时候，可以先确认对方是否能好好聊；给一个具体的再谈时间，比连续追问更有机会听到真实想法。"],
      ["心动之后，再看一次自己", n.close ? "见面很热闹时，问问自己：回到普通的一周，我还感到被惦记吗？你需要的陪伴，应该能在平常的日子里看见。" : "相处很轻松时，问问自己：我们有没有一起面对过一件小麻烦？各自自在之外，关系也需要有人把重要的事认真说完。"],
    ],
    steps: [
      { when: "下一次聊天", title: n.indirect ? "说一次小需求" : "留一次回应的空当", text: n.indirect ? "挑一件真实的小事，说「我希望……，因为我会……」。只表达一件，再观察对方的回应。" : "说完自己的想法后，问「你怎么想？」。先听完，再决定要不要继续解释。" },
      { when: "下一次约会", title: "让对方完整安排一次", text: "把一件具体的事交出去，比如定时间和餐厅。别提前把所有空缺补上，看看对方是否记得、是否兑现。" },
      { when: "见面回家后", title: "记两件事实，再做决定", text: "写下「我表达过什么，对方怎么回应」和「这次谁主动推进了什么」。用几次见面的行为校准这份报告。" },
    ],
  };
}

export function buildMatchGuide(me) {
  const n = inferNeeds(me);
  const partner = me.gender === "man" ? "女生" : "男生";
  const intro = opening(me, n);
  const criteria = [work(me, n), family(me, n), money(me, n), ageAndLife(me, n)];
  const matchStyle = style(me, n);
  const wishes = wishKeys.filter(key => me[key] !== undefined).map(key => ({ key, title: ({ ageWish: "年龄", locationWish: "城市", educationWish: "学历", incomeWish: "月收入", heightWish: "身高", looksWish: "眼缘", jobPriority: "工作", housingWish: "住房", familyWish: "对方父母的经济情况", homeHelpWish: "购房支持", smokingWish: "吸烟" })[key], value: label(key, me[key]) }));
  const missing = [!me.workSchedule && "实际工时", !me.workStability && "收入稳定性", !me.parentSecurity && "父母养老", !me.familyCare && "照护分工", me.income === undefined && "你的收入"].filter(Boolean);
  const completeness = { answered: ownKeys.filter(key => me[key] !== undefined).length, missing };
  const reality = tradeoffs(me, n);
  const brief = [
    { label: "相处", text: matchStyle?.title ?? "需要完成情境题" },
    { label: "工作", text: criteria[0].value },
    { label: "家庭", text: criteria[1].value },
  ];
  const shareText = ["我的相亲观察清单（待见面验证）", ...brief.map(x => x.label + " · " + x.text), "优先看对方如何兑现时间、分担事务、回应真实需求。", "我填写的外在偏好（与适配判断分开）", ...wishes.map(x => x.title + " · " + x.value)].join("\n");
  return { partner, intro, brief, criteria, style: matchStyle, wishes, reality, completeness, insight: reflections(me, n), shareText };
}
