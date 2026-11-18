import { label } from './engine.js';
import { inferNeeds } from './match-guide.js';

const ages = [[18,23],[24,27],[28,31],[32,35],[36,40],[41,45],[46,50],[51,null]];
const incomeRanges = ['低于 ¥8,000','¥5,000–12,000','¥8,000–20,000','¥12,000–35,000','¥20,000 及以上','¥35,000 及以上'];
const shortWork = {civil:'公务员／机关',institution:'事业单位',soe:'央企／国企',private:'民企',foreign:'外企／合资',business:'个体经营／创业',freelance:'自由职业／灵活就业',transition:'在读／工作调整中',other:'其他工作'};
const shortSchedule = {regular:'固定工时',shifts:'轮班／周末上班',busy:'加班／出差多',flex:'时间可自主安排'};
const shortEducation = ['高中／中专及以下','大专','本科','硕士及以上'];
const shortIncome = ['低于 ¥5,000','¥5,000–8,000','¥8,000–12,000','¥12,000–20,000','¥20,000–35,000','¥35,000 及以上'];
const shortParents = {independent:'父母经济自理',occasional:'偶尔帮衬父母',regular:'定期支持父母'};
const shortCare = {main:'主要照顾者',shared:'家人分担照护',occasional:'偶尔照应',undecided:'照护分工未定'};
const show = value => value || '未填写';
const join = (...items) => items.filter(Boolean).join(' · ');
const own = (me,key) => label(key,me[key]);

function candidatePersona(me,n) {
  if (!n.hasPersona) return {name:'待完成情境题',traits:[],why:'完成题目后再给相处方向。',sign:'暂不判断',avoid:'暂不判断'};
  if (n.quiet && n.indirect) return {
    name:'主动定心型', traits:['主动邀约','心意清楚',n.close?'稳定陪伴':'尊重独处'],
    why:'你慢热，又容易把话留着。愿意主动推进、把喜欢说清的人，能减少你反复猜测。',
    sign:'会主动定下次见面的时间。你说不舒服时，会问清楚并调整。',
    avoid:'一直等你主动，或热情一阵就消失的人。',
  };
  if(n.close && n.comfort) return {
    name:'温柔行动型',traits:['会听感受','主动分担','日常有回应'],
    why:'你从日常回应里感到亲近。愿意听你说完、再接走一件事的人，更能接住你的疲惫。',
    sign:'听你说累之后，真的去安排饭菜、订票或接送。',
    avoid:'嘴上很会哄，遇到实际事情总让你自己处理的人。',
  };
  if(!n.close && n.planned) return {
    name:'稳妥有边界型',traits:['守约','独立','沟通直接'],
    why:'你有自己的节奏，也在意约定。能各忙各的、到点又认真出现的人，更容易让你放松。',
    sign:'接受你有自己的周末，也会守住已经约好的见面。',
    avoid:'把随时回复、交代行踪当成在乎证明的人。',
  };
  if(!n.close) return {
    name:'松弛同行型',traits:['有自己的生活','愿意尝试','遇事能商量'],
    why:'你需要空间，也能接受临时起意。能一起探索、又不要求时时绑定的人，更合你的节奏。',
    sign:'可以分别去玩，也会主动分享生活、一起解决麻烦。',
    avoid:'借口彼此独立，重要决定也从不和你商量的人。',
  };
  return {
    name:'坦诚共建型',traits:['有回应','肯投入',n.planned?'能做计划':'愿意一起尝试'],
    why:'你愿意主动，也期待关系往前走。能接住表达、同时拿出自己一份行动的人，更值得投入。',
    sign:n.talkSoon?'争执后能约时间说开，下一次也会主动安排。':'允许暂停，到了约定时间会回来把话谈完。',
    avoid:'享受你的安排，却总说“随你、都行、再看看”的人。',
  };
}

function selfPersona(me,n) {
  if(!n.hasPersona) return {name:'还缺少相处反应',code:'',traits:[],lines:[]};
  const name=n.quiet?(n.close?'慢热认真型':'慢热独立型'):(n.close?'主动投入型':'自在同行型');
  return {name,code:me.persona.code,traits:me.persona.axes.map(a=>a.name),lines:[
    ['喜欢一个人时',n.indirect?'会留意细节，却不一定让对方看出你有多认真。':'愿意让对方知道你的心意，也会推动关系往前走。'],
    ['容易吃亏的地方',n.muted.length?'不舒服时先体谅，等积累了失望，对方才知道你在介意。':n.quiet?'观察得很仔细，也可能让同样慢热的人以为你没兴趣。':n.close?'你一主动就把安排接了过来，容易晚一点才发现对方投入很少。':'你很会自己消化问题，关系有时也会错过一起面对的机会。'],
    ['你真正需要',n.comfort?'累的时候，有人先心疼你，再实实在在分担一点。':'遇到事情有人一起扛，也尊重你自己的判断。'],
  ]};
}

function conditionRows(me,n,partner) {
  const i=Number(me.age), start=ages[Math.max(0,i-1)], end=ages[Math.min(7,i+1)];
  const age=start&&end?(end[1]?`${start[0]}–${end[1]} 岁`:`${start[0]} 岁以上`):'生活阶段接近的人';
  const education=me.education===undefined?'先补充你的学历':['高中／中专到大专','大专到本科','本科到硕士及以上','本科、硕士及以上'][Number(me.education)];
  const work=n.variable?'稳定岗位：单位／成熟企业':n.busy||n.care||n.close?'固定工时的单位／企业职能岗':n.planned?'工时可预期的单位／企业岗位':'企业岗位／有稳定业务的自雇工作';
  const workNote=n.variable?'先确认收入波动，再看单位名称':n.busy||n.care?'能与你错开忙季、约定见面':'个体和自由职业也看实际排期';
  const parents=n.care||n.financialCare?'父母有基本养老安排，照护有人分担':'父母养老有安排，小家能做主';
  const housing=me.housing==='own'?'能协商共同住处，通勤合适':me.homeHelp==='no'?'可先租后买，或已有可共同住的房':'有可执行的租住／购房安排';
  const rows=[
    {key:'age',label:'年龄',mine:own(me,'age'),target:age,tag:'认识起点',reason:'按你的年龄段及前后相邻段举例，优先看双方人生进度。'},
    {key:'city',label:'城市',mine:me.city,target:me.city?`${me.city}同城优先`:'先确认长期生活城市',tag:'生活建议',reason:n.care?'你有家庭照护责任，同城更方便确认相处时间。':n.close?'你更需要日常陪伴，同城便于实际见面。':'先从能见面的人了解，异地再核实同城计划。'},
    {key:'education',label:'学历',mine:shortEducation[Number(me.education)],target:education,tag:'认识起点',reason:'以你自己的学习经历作起点，具体看交流和对彼此工作的理解。'},
    {key:'income',label:'税后月收入',mine:shortIncome[Number(me.income)],target:me.income===undefined?'先补收入与共同开支':incomeRanges[Number(me.income)],tag:'预算起点',reason:'同档至相邻较高档只是认识人的起点，不是统计匹配范围。实际要看双方固定开支与分担。'},
    {key:'height',label:'身高／眼缘',mine:me.height?`${me.height} cm`:undefined,target:me.heightWish&&me.heightWish!=='any'?own(me,'heightWish').replace('厘米','cm'):'不预设身高范围',note:me.looksWish&&me.looksWish!=='any'?own(me,'looksWish'):undefined,tag:'眼缘偏好',reason:'沿用你选的眼缘范围，性格与家庭条件不能推算对方应有的身高。'},
    {key:'work',label:'工作',mine:join(shortWork[me.workKind],shortSchedule[me.workSchedule]),target:work,note:workNote,tag:'生活建议',reason:n.variable?'你自己的收入有波动，优先核实对方的可预期收入和开支。':n.busy||n.care?'你自己的时间有限，先找工时能协调的人。':'看真实工时和是否兑现约定，不用职业名称判断人品。'},
    {key:'housing',label:'住房',mine:own(me,'housing'),target:housing,tag:'生活建议',reason:'按你现在的住处和家里支持情况给出可讨论的方案。'},
    {key:'family',label:'家庭／养老',mine:join(shortParents[me.parentMoney]||({secure:'父母养老基本充足',partial:'父母养老需部分补贴',dependent:'父母养老主要靠子女'})[me.parentSecurity],shortCare[me.familyCare]),target:parents,tag:'生活建议',reason:n.care||n.financialCare?'你已有家庭责任，需核实两边责任能否分担。':'经济支持、实际照护和决定权分别了解。'},
    {key:'boundary',label:'家庭边界',mine:({separate:'希望分开住',nearby:'住得近，分开住',together:'可考虑同住',discuss:'按实际情况商量'})[me.familyLiving],target:me.familyLiving==='together'?'愿意分家务、保留私人空间':me.familyLiving==='nearby'||n.care?'可住近些，重要决定两人商量':'能和父母沟通，也尊重小家决定',tag:'相处建议',reason:'结合你对居住和家庭责任的安排。'},
    {key:'personality',label:'性格',mine:me.persona?selfPersona(me,n).name:undefined,target:partner.name,note:partner.traits.join(' · '),tag:'情境推断',reason:partner.why},
  ];
  return rows.map(row=>({...row,mine:show(row.mine)}));
}

function onePain(me,n) {
  if(n.muted.length) return {title:'你最该早点说的，是那句“其实我有点介意”。',text:'反复体谅，会让别人误以为你一直没关系。下一次先说一个小需求，观察对方愿不愿意调整。',action:'试一句：“改时间提前告诉我，我就不用一直等。”',evidenceSlots:n.muted};
  if(n.care||n.financialCare) return {title:'你已经在照顾一个家，别太早接下第二个家。',text:'找能分担的人，先看对方会主动接走什么。第一次认识就承诺替对方解决一切，会让你很难看清真实分工。',action:'把你每周必须留给家里的时间说清，听对方怎样安排。',evidenceSlots:['care']};
  if(n.quiet) return {title:'你还想再观察一下，对方可能以为你不想继续。',text:'给一次清楚的回应就够了。之后看对方会不会接着推进，不用靠一直等待证明自己被珍惜。',action:'试一句：“这次聊得很开心，下周我还想见你。”',evidenceSlots:['initiative']};
  if(n.close) return {title:'先停一次安排，看看对方会不会向你走来。',text:'你愿意投入是优点。下一次把时间、地点交给对方，看这段关系是否也有人在用心经营。',action:'让对方完整安排一次见面，你只给出可用时间。',evidenceSlots:['initiative','evening']};
  return {title:'相处轻松之外，还要看能不能一起处理麻烦。',text:'各有空间很舒服，但重要问题也要有人开口。挑一件真实的小分歧，看你们是否愿意谈完。',action:'先聊一次周末安排冲突，不急着自己把问题消化掉。',evidenceSlots:['argument']};
}

export function buildCompactReport(me, guide) {
  const n=inferNeeds(me), self=selfPersona(me,n), partner=candidatePersona(me,n);
  const rows=conditionRows(me,n,partner), pain=onePain(me,n);
  const proof=(me.persona?.evidence??[]).filter(e=>pain.evidenceSlots.includes(e.slot)).map(e=>({kind:'scene',...e}));
  const preserve=n.indirect?'能说清心意，也认真回应你':n.close?'能持续陪伴并主动投入':'尊重独处，也兑现约定';
  const flex=me.heightWish&&me.heightWish!=='any'?'身高可先按眼缘筛，遇到合拍的人再决定要不要放宽。':'学历、收入区间先当认识人的起点，聊得来再具体确认。';
  const text=['我的条件与择偶起点',...rows.map(row=>`${row.label}｜我：${row.mine}｜建议：${row.target}${row.tag==='眼缘偏好'?'（眼缘偏好）':''}`),'我的相处类型：'+self.name,'建议了解的类型：'+partner.name,'优先保留：'+preserve].join('\n');
  return {rows,self,partner,pain:{...pain,evidence:proof},preserve,flex,shareText:text,details:guide};
}
