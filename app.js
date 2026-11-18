import { cityList, fields, references, sections } from "./questions.js";
import { examples, label, normalizeCity, pairReport, singleReport, stretchKeys, validCity } from "./engine.js";

import { pairActions, personalActions } from "./recommendations.js";
import { buildMatchGuide } from "./match-guide.js";
import { buildCompactReport } from "./compact-report.js";
import { chapters, classify, exampleType, pairedTypes, palettes, scenes, drawScenes } from "./personality.js";

const [basics, family, habits, wishes] = sections;
const intro = {
  title: "先说说现在的你",
  text: "带 * 的三项需要填。想拿到更具体的工作、家庭和学历建议，可以选填对应条件。",
  fields: ["gender", "city", "age", "education", "workKind", "income", "parentMoney"],
  more: [
    { title: "你的工作时间和稳定性", keys: ["workSchedule", "workStability"] },
    { title: "家庭、养老和你想怎样发展", keys: family.fields.filter(key => key !== "parentMoney") },
    { title: "你的身高和住房", keys: basics.fields.filter(key => ["height", "housing"].includes(key)) },
  ],
  stage: 1,
};
const daily = {
  ...habits, title: "散场以后，你怎么过日子？",
  text: "选几个你真喜欢的，报告会帮你把它们变成下次见面的主意。",
  fields: ["hobbies", "routine"],
  more: [{ title: "作息外的生活习惯与沟通方式", keys: habits.fields.filter(key => !["hobbies", "routine"].includes(key)) }],
  stage: 3,
};
const searchFields = ["locationWish", "ageWish", "educationWish", "heightWish", "looksWish", "jobPriority", "familyWish"];
const preferred = {
  ...wishes, title: "最后，你想认识怎样的人？",
  text: "选填你的期待。报告会把它与你的实际生活、情境反应分开分析，再看看哪些地方需要取舍。",
  fields: searchFields,
  more: [{ title: "收入、住房和想够一够的条件", keys: wishes.fields.filter(key => !searchFields.includes(key)) }],
  stage: 4,
};
let sceneSets = [drawScenes(), drawScenes()];
function flowFor(index = seat) { return [intro, ...sceneSets[index].map((scene, index) => ({ scene, index, stage: 2 })), daily, preferred]; }
const exampleProfiles = ["QPHI", "SFDC"].map((code, i) => {
  const persona = exampleType(code, [i, i]);
  const sample = i === 0 ? {
    age: "4", height: "162", educationWish: "2", heightWish: "h180", looksWish: "warm",
    workKind: "private", workSchedule: "busy", workStability: "steady", jobPriority: "overlap",
    parentSecurity: "partial", familyCare: "shared", familyLiving: "nearby",
    familyWish: "independent", relationshipGoal: "marriage",
  } : { height: "176", workKind: "soe", workSchedule: "regular", workStability: "steady", familyLiving: "separate" };
  return { ...examples[i], ...sample, ...persona.habits, persona };
});

const app = document.querySelector("#app");
const home = app.innerHTML;
const rulesDialog = document.querySelector("#about");
const restart = document.querySelector("#restart");
const shareCard = document.querySelector("#share-card");
const shareConsent = document.querySelector("#share-consent");
const saveCard = document.querySelector("#save-card");
const live = document.querySelector("#announcement");

let page = "home";
let mode = "single";
let returnTo = "home";
let seat = 0;
let step = 0;
let drafts = [{}, {}];
let sceneAnswers = [[], []];
let report = null;
let stretch = "";
let sampleStretch = "";
let editingProfile = false;

document.querySelector("#references").innerHTML = references.map(([text, href]) =>
  `<li><a href="${safe(href)}" target="_blank" rel="noopener noreferrer">${safe(text)}</a></li>`
).join("");

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, mark => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[mark]);
}

function screen(name, markup, navigate = true) {
  page = name;
  app.innerHTML = markup;
  if (navigate) {
    window.scrollTo(0, 0);
    app.querySelector("h1")?.focus({ preventScroll: true });
  }
}

function reset() {
  drafts = [{}, {}];
  sceneAnswers = [[], []];
  sceneSets = [drawScenes(), drawScenes()];
  report = null;
  stretch = sampleStretch = "";
  seat = step = 0;
  mode = "single";
  editingProfile = false;
  returnTo = "home";
  screen("home", home);
}

function start(nextMode) {
  editingProfile = false;
  mode = nextMode;
  seat = step = 0;
  renderStep();
}

function fieldMarkup(key, draft) {
  const field = fields[key];
  const value = draft[key];
  const note = field.note ? `<span class="field-note" id="note-${key}">${safe(field.note)}</span>` : "";
  const description = field.note ? `aria-describedby="note-${key}"` : "";
  if (field.kind === "city") {
    const entries = cityList.map(city => `<option value="${safe(city)}"></option>`).join("");
    return `<label class="profile-field"><span class="control-label">${safe(field.label)} *</span>
      <input id="city" type="text" name="city" spellcheck="false" value="${safe(value)}" maxlength="24" list="cities" placeholder="例如 常州" required ${description}>
      <datalist id="cities">${entries}</datalist>${note}
    </label>`;
  }
  if (field.kind === "height") {
    return `<label class="profile-field"><span class="control-label">${safe(field.label)}</span>
      <input name="${key}" type="number" min="130" max="220" step="1" inputmode="numeric" value="${safe(value)}" placeholder="例如 168" ${description}>
      ${note}
    </label>`;
  }
  if (field.kind === "multiple") {
    return `<fieldset class="profile-field profile-field-wide">
      <legend>${safe(field.label)}</legend><div class="profile-chips">
      ${field.options.map(([option, caption]) => `<label class="chip"><input name="${key}" value="${option}" type="checkbox" ${value?.includes(option) ? "checked" : ""}>${safe(caption)}</label>`).join("")}
      </div>
    </fieldset>`;
  }
  const empty = field.required ? "请选择" : "暂不填写";
  return `<label class="profile-field"><span class="control-label">${safe(field.label)}${field.required ? " *" : ""}</span>
    <select name="${key}" class="${value === undefined ? "is-blank" : ""}" ${field.required ? "required" : ""} ${description}>
      <option value="">${empty}</option>
      ${field.options.map(([option, caption]) => `<option value="${option}" ${option === value ? "selected" : ""}>${safe(caption)}</option>`).join("")}
    </select>${note}
  </label>`;
}

function renderStep() {
  const group = flowFor()[step];
  if (group.scene) {
    renderScene(group);
    return;
  }
  const draft = drafts[seat];
  const who = mode === "single" ? "我的相亲测试" : `双人测试 · 第 ${seat + 1} 位`;
  const status = `第 ${group.stage} / 4 步`;
  const progress = Array.from({ length: 4 }, (_, i) => `<span><i style="width:${i < group.stage ? 100 : 0}%"></i></span>`).join("");
  const back = step ? "上一步" : seat ? "回交接页" : "返回首页";
  const next = editingProfile ? "更新报告" : step === 0 ? "进入相亲小剧场" : group.stage === 3 ? "继续" :
    mode === "single" ? "翻开我的人格卡" : seat ? "生成双人报告" : "交给第二位";
  const extras = group.more.map(({ title, keys }) => `<details class="optional-fields" ${keys.some(key => draft[key] !== undefined) ? "open" : ""}>
    <summary>${safe(title)}（选填）</summary>
    <div class="profile-fields">${keys.map(key => fieldMarkup(key, draft)).join("")}</div>
  </details>`).join("");
  screen("form", `<section class="flow profile-flow">
    <div class="flow-head">
      <div class="flow-top"><strong>${who}</strong><span class="section-step">${status}</span></div>
      <div class="progress" role="progressbar" aria-label="阶段进度" aria-valuemin="0" aria-valuemax="4" aria-valuenow="${group.stage}">${progress}</div>
    </div>
    <form id="profile-form">
      <article class="panel">
        <h1 tabindex="-1">${group.title}</h1>
        <p class="hint">${group.text}</p>
        <div class="profile-fields">${group.fields.map(key => fieldMarkup(key, draft)).join("")}</div>
        ${extras}
      </article>
      <div class="flow-actions">
        <button class="button quiet" type="button" data-action="back"><span aria-hidden="true">←</span> ${back}</button>
        <button class="button primary" type="submit">${next} <span aria-hidden="true">→</span></button>
      </div>
    </form>
  </section>`);
}

function paletteStyle(key) {
  const [surface, ink, accent] = palettes[key];
  return `--scene:${surface};--scene-ink:${ink};--scene-accent:${accent}`;
}

function renderScene({ scene, index }) {
  const chapter = chapters[scene.chapter];
  const current = sceneAnswers[seat][index];
  const scenes = sceneSets[seat];
  const who = mode === "single" ? chapter.title : `第 ${seat + 1} 位 · ${chapter.title}`;
  const progress = chapters.map((_, chapterIndex) => {
    const total = scenes.filter(item => item.chapter === chapterIndex).length;
    const viewed = scenes.slice(0, index + 1).filter(item => item.chapter === chapterIndex).length;
    return `<span><i style="width:${100 * viewed / total}%"></i></span>`;
  }).join("");
  screen("scene", `<section class="flow scene-flow" style="${paletteStyle(chapter.color)};--chapter-count:${chapters.length}">
    <div class="flow-head">
      <div class="flow-top"><strong>${safe(who)}</strong><span>${index + 1} / ${scenes.length} 道情境题</span></div>
      <div class="progress" role="progressbar" aria-label="情境题进度" aria-valuemin="0" aria-valuemax="${scenes.length}" aria-valuenow="${index + 1}">${progress}</div>
    </div>
    <article class="scene-stage">
      <p class="scene-cue">${safe(chapter.cue)}</p>
      <h1 tabindex="-1">${safe(scene.title)}</h1>
      <p class="scene-caption">${safe(scene.caption)}</p>
    </article>
    <div class="scene-choices" aria-label="选择更像你的反应">
      ${scene.options.map((option, i) => `<button type="button" class="scene-choice" data-action="scene" data-key="${i}" aria-pressed="${current === i}">
        <span class="choice-letter" aria-hidden="true">${i === 0 ? "A" : "B"}</span><span>${safe(option.text)}</span>
      </button>`).join("")}
    </div>
    <div class="scene-footer">
      <button class="button quiet" type="button" data-action="back"><span aria-hidden="true">←</span> ${index ? "上一个场景" : "返回个人情况"}</button>
      <p>选真实反应，不用选“应该的样子”</p>
    </div>
  </section>`);
}

function personalProfile(index) {
  const persona = classify(sceneAnswers[index], sceneSets[index]);
  return { ...persona?.habits, ...drafts[index], persona };
}

function matchPair(one, two) {
  return { ...pairReport(one, two), personas: [one.persona, two.persona] };
}

function saveField(input) {
  const key = input.name;
  const draft = drafts[seat];
  if (!fields[key]) return;
  if (fields[key].kind === "multiple") {
    const others = (draft[key] ?? []).filter(value => value !== input.value);
    if (input.checked) others.push(input.value);
    if (others.length) draft[key] = others;
    else delete draft[key];
  } else if (input.value === "") delete draft[key];
  else draft[key] = input.value;
  if (input.tagName === "SELECT") input.classList.toggle("is-blank", !input.value);
}

function renderActions(actions, pair = false) {
  const heading = pair ? "一起改善的下一步" : "提升建议";
  const introduction = pair ? "从最值得聊的一件事开始，试一个双方都能做到的安排。" : "从一件你现在能做的事开始，下次相亲就能用上。";
  return `<section class="result-section advice-section" id="improve" tabindex="-1" aria-labelledby="advice-heading">
    <div class="advice-head"><h2 id="advice-heading">${heading}</h2><p class="hint">${introduction}</p></div>
    <ol class="action-grid">
      ${actions.map(action => `<li class="action-card"><p class="action-when">${safe(action.when)}</p>
        <h3>${safe(action.title)}</h3><p class="action-reason">${safe(action.reason)}</p>
        <p class="action-step">${safe(action.action)}</p></li>`).join("")}
    </ol>
  </section>`;
}

function renderPersonality(persona, sample) {
  if (!persona) return "";
  return `<section id="persona" tabindex="-1" aria-labelledby="persona-title">
    <article class="persona-card" style="${paletteStyle(persona.palette)}">
      <div class="persona-head">
        <div><p class="persona-kicker">${sample ? "相亲人格示例" : "你的相亲人格"}</p><h2 id="persona-title">${safe(persona.name)}</h2></div>
        <span class="persona-code" aria-label="类型代码 ${safe(persona.code)}">${safe(persona.code)}</span>
      </div>
      <p class="persona-quote">「${safe(persona.quote)}」</p>
      <p class="persona-description">${safe(persona.description)}</p>
      <div class="persona-tags">${persona.axes.map(axis => `<span class="chip">${safe(axis.name)}</span>`).join("")}</div>
      ${sample ? "" : '<div class="persona-actions"><button type="button" class="button quiet" data-action="persona-download">保存我的人格卡 ↓</button></div>'}
    </article>
    <section class="result-section">
      <h2>四个相处倾向</h2>
      <div class="axis-grid">${persona.axes.map(axis => `<article class="axis">
        <p class="axis-title">${safe(axis.axis.title)}</p><h3>${safe(axis.name)}</h3>
        <div class="dots" role="img" aria-label="${axis.votes[0] + axis.votes[1]} 道题中有 ${axis.votes[axis.pole]} 道选择这个方向">
          ${Array.from({ length: axis.votes[0] + axis.votes[1] }, (_, i) => `<span class="${i < axis.votes[axis.pole] ? "fill" : ""}"></span>`).join("")}
        </div>
        <p>${safe(axis.description)}</p>
      </article>`).join("")}</div>
    </section>
    <section class="result-section" aria-labelledby="relationship-title">
      <h2 id="relationship-title">恋爱中的你</h2>
      <div class="relationship-grid">${persona.relationship.map(item => `<article class="axis relationship-axis">
        <p class="axis-title">${safe(item.axis.title)}</p><h3>${safe(item.name)}</h3>
        <p>${safe(item.description)}</p>
      </article>`).join("")}</div>
    </section>
  </section>`;
}

function renderEvidence(items) {
  if (!items?.length) return '<p class="evidence-empty">这部分信息还没填，建议暂时保留开放。</p>';
  return `<details class="reason-details"><summary>为什么这样判断</summary><ul>${items.map(item => `<li>
    <strong>${safe(item.topic)}</strong>${item.title ? `<p>${safe(item.title)}</p>` : ""}<blockquote>你选了「${safe(item.answer)}」</blockquote>
  </li>`).join("")}</ul></details>`;
}

function renderComparison(compact, guide, sample) {
  return `<section id="fit" tabindex="-1" aria-labelledby="fit-title" class="comparison-section">
    <h2 id="fit-title">我的条件 × 建议认识的${safe(guide.partner)}</h2>
    <div class="comparison-wrap"><table class="comparison-table">
      <caption class="sr-only">我的实际条件与建议对象逐项对照</caption>
      <colgroup><col class="condition-col"><col class="mine-col"><col class="target-col"></colgroup>
      <thead><tr><th scope="col">看什么</th><th scope="col">我的情况</th><th scope="col">建议优先了解</th></tr></thead>
      <tbody>${compact.rows.map(row => `<tr data-condition="${safe(row.key)}"><th scope="row">${safe(row.label)}</th><td>${safe(row.mine)}</td><td><strong>${safe(row.target)}</strong>${row.note ? `<span class="cell-note">${safe(row.note)}</span>` : ""}${['认识起点','预算起点','眼缘偏好'].includes(row.tag) ? `<span class="basis-tag">${safe(row.tag)}</span>` : ""}</td></tr>`).join("")}</tbody>
    </table></div>
    <p class="table-footnote">年龄、学历、收入是认识人的起点；身高沿用眼缘偏好。双方是否合适，还要看真实相处。</p>
    <div class="comparison-actions">${sample ? "" : '<button class="text-button" data-action="edit-profile" type="button">修改我的情况</button><button class="text-button" data-action="edit-wishes" type="button">修改我的期待</button>'}
      <button class="text-button" type="button" data-action="jump" data-key="filter-copy">带走这份清单 ↓</button>
    </div>
  </section>`;
}

function renderCompactPersonalities(compact, sample) {
  const { self, partner } = compact;
  return `<section class="result-section concise-personalities" id="self" tabindex="-1" aria-labelledby="self-title">
    <h2 id="self-title">先看你，再看适合走近你的人</h2>
    <div class="persona-duo">
      <article class="concise-persona self-persona"><p class="card-kicker">01 / 你在关系里的样子 <span>${safe(self.code)}</span></p><h3>${safe(self.name)}</h3>
        <div class="mini-tags">${self.traits.slice(0,3).map(x=>`<span>${safe(x)}</span>`).join("")}</div>
        <dl>${self.lines.map(([head,text])=>`<div><dt>${safe(head)}</dt><dd>${safe(text)}</dd></div>`).join("")}</dl>
      </article>
      <article class="concise-persona partner-persona"><p class="card-kicker">02 / 建议了解的相处类型</p><h3>${safe(partner.name)}</h3>
        <div class="mini-tags">${partner.traits.map(x=>`<span>${safe(x)}</span>`).join("")}</div>
        <dl><div><dt>为什么适合你</dt><dd>${safe(partner.why)}</dd></div><div><dt>见面时看这个</dt><dd>${safe(partner.sign)}</dd></div><div><dt>需要多留意</dt><dd>${safe(partner.avoid)}</dd></div></dl>
      </article>
    </div>
  </section>`;
}

function renderSingle(me, sample = false, navigate = true) {
  const axis = (sample ? sampleStretch : stretch) || me.stretch || "income";
  const result = singleReport(me, axis);
  const guide = buildMatchGuide(me);
  const compact = buildCompactReport(me, guide);
  const options = stretchKeys.map(key => `<button class="chip" type="button" data-action="stretch" data-key="${key}" aria-pressed="${axis === key}">${safe(label("stretch", key))}</button>`).join("");
  screen(sample ? "demo" : "single", `<section class="result profile-report compact-report">
    <header class="result-header"><div><p class="eyebrow"><span aria-hidden="true"></span>${sample ? "结果示例 · 模拟条件" : "你的相亲报告"}</p><h1 tabindex="-1">你可以先找这样的人</h1></div></header>
    ${renderComparison(compact, guide, sample)}
    ${renderCompactPersonalities(compact, sample)}
    <section class="one-takeaway" id="reality" tabindex="-1" aria-labelledby="pain-title"><p class="card-kicker">这次最想提醒你的一件事</p><h2 id="pain-title">${safe(compact.pain.title)}</h2><p>${safe(compact.pain.text)}</p><p class="one-action">${safe(compact.pain.action)}</p>${renderEvidence(compact.pain.evidence)}</section>
    <div class="keep-and-flex"><p><strong>优先保留</strong>${safe(compact.preserve)}</p><p><strong>可以商量</strong>${safe(compact.flex)}</p></div>
    <div class="report-extras">
      <details class="report-fold"><summary>这些范围和判断是怎么来的？</summary>
        <p class="hint">下面说明每项建议的依据。数字是用于开始认识人的规则举例，未用候选人数据计算成功概率。</p>
        <dl class="basis-list">${compact.rows.map(row=>`<div><dt>${safe(row.label)} <span>${safe(row.tag)}</span></dt><dd>${safe(row.reason)}</dd></div>`).join("")}</dl>
        <p class="hint">${guide.completeness.missing.length ? '未填写：'+safe(guide.completeness.missing.join('、'))+'。对应建议会较宽。' : '资料较完整，可以结合实际见面继续调整。'}</p>
      </details>
      <details class="report-fold"><summary>工作、家庭，还有哪些具体问题要聊？</summary>
        <ul class="compact-prompts">${guide.criteria.map(item=>`<li><strong>${safe(item.heading)}</strong><p>「${safe(item.ask)}」</p>${renderEvidence(item.evidence)}</li>`).join("")}</ul>
        ${guide.reality.filter(x=>x.id!=='unspoken').map(item=>`<article class="small-reality"><h3>${safe(item.title)}</h3><p>${safe(item.text)}</p><p>${safe(item.action)}</p></article>`).join("")}
      </details>
      <details class="report-fold" id="stretch" ${!navigate ? "open" : ""}><summary>想把某项条件再往上试一试</summary>
        <div class="profile-chips" aria-label="尝试的方向">${options}</div><h3 class="fold-title">${safe(result.stretch.title)}</h3><p class="hint">${safe(result.stretch.text)}</p><p class="fold-quote">「${safe(result.stretch.prompt)}」</p>
        ${renderActions(personalActions(me, axis))}
      </details>
      <details class="report-fold"><summary>生活习惯、兴趣和完整人格卡</summary>
        <div class="match-types">${[...(result.spendingText ? [["日常消费",result.spendingText]]:[]),...result.rows.slice(4)].map(([title,detail])=>`<article class="match-item"><h3>${safe(title)}</h3><p>${safe(detail)}</p></article>`).join("")}</div>
        ${renderPersonality(me.persona,sample)}
      </details>
      <details class="report-fold match-copy" id="filter-copy"><summary>带走这份相亲清单</summary><p class="hint">可以改成自己的话，再复制。</p><textarea id="filter-text" aria-label="相亲初筛清单" rows="8">${safe(compact.shareText)}</textarea><div class="dialog-actions"><span id="copy-feedback" class="hint" role="status"></span><button class="button quiet" type="button" data-action="copy-filter">复制清单</button></div></details>
    </div>
    <div class="profile-footer">${sample ? '<button class="button quiet" type="button" data-action="leave-demo">返回测试</button><button class="button primary" type="button" data-action="pair-demo">看双人报告示例 ↗</button>' : '<button class="text-button" type="button" data-action="reset">清空本次作答</button><button class="button quiet" type="button" data-action="handoff">加入对方答卷 →</button>'}</div>
  </section>`, navigate);
}

function renderHandoff() {
  screen("handoff", `<section class="flow">
    <article class="panel handoff">
      <span class="brand-mark" aria-hidden="true"></span>
      <h1 tabindex="-1">换第二位作答</h1>
      <p class="hint">把手机交给对方。两个人分别填写自己的真实情况和择偶期待，答完后一起看报告。</p>
      <button type="button" class="button primary" data-action="second">开始第二份 <span aria-hidden="true">→</span></button>
    </article>
  </section>`);
}

const assessment = { yes: "符合", no: "值得聊", pending: "待确认" };

function pairRow(row) {
  return `<li class="pair-check">
    <div><h3>${safe(row.title)} <small class="hint">· ${safe(row.direction)}</small></h3></div>
    <span class="assessment ${row.result}">${assessment[row.result]}</span>
  </li>`;
}

function renderPairPersonalities(personas) {
  if (!personas?.every(Boolean)) return "";
  const differences = pairedTypes(...personas);
  return `<section class="result-section">
    <h2>你们的相亲人格组合</h2>
    <div class="type-pair-grid">${personas.map((persona, i) => `<article class="pair-persona" style="${paletteStyle(persona.palette)}">
      <p>第 ${i + 1} 位 · ${safe(persona.code)}</p><h3>${safe(persona.name)}</h3>
    </article>`).join("")}</div>
    ${differences.length ? `<ul class="result-list type-mix-tips">
      ${differences.slice(0, 2).map(({left,right}) => `<li><h3>${safe(left.name)} × ${safe(right.name)}</h3><p>${safe(left.axis.pairTip)}</p></li>`).join("")}
    </ul>` : '<p class="hint">你们可以从相近的相处节奏聊起。有些习惯会看情况，见面时可以互相问问当下更需要什么。</p>'}
  </section>`;
}

function renderPair(pair, sample = false) {
  const { comparable, matches, score, checked, dimensions, hobbies, differingGoals, symmetricScope } = pair;
  const next = sample ? '<button class="button quiet" type="button" data-action="demo">回到单人示例</button>' :
    '<button class="button quiet" type="button" data-action="share">保存分享卡 ↓</button>';
  const stats = [0, 1].map(index => {
    const title = index ? "第二位的期待" : "第一位的期待";
    const items = checked.filter(row => row.direction === title && row.result !== "pending");
    const met = items.filter(row => row.result === "yes").length;
    return `<article class="dimension"><h3>${title}</h3><p>${items.length ? `对方符合 ${met} / ${items.length} 项可比较要求` : "暂无可比较的具体要求"}</p></article>`;
  });
  const bars = dimensions.map(item => `<article class="dimension">
    <h3>${safe(item.title)}</h3><div class="dim-track" aria-hidden="true"><i style="width:${item.comparable ? 100 * item.matches / item.comparable : 0}%"></i></div>
    <p>${item.comparable ? `${item.matches} / ${item.comparable} 项符合` : "待更多信息"}</p>
  </article>`).join("");
  const status = !symmetricScope ? "先确认彼此的择偶方向" :
    differingGoals ? "先聊是否要孩子" : score === null ? "还有条件待确认" : "双向条件匹配度";
  const subtitle = !symmetricScope ? "两份答卷里，期待认识的对象与对方填写的性别未能双向对应。" :
    differingGoals ? "两人填写的计划不同，可以先聊清各自对这件事的想法。" :
    score === null ? "至少需要 6 项可比较的回答，才能给出总分。" : `${matches} / ${comparable} 个可比较项符合`;
  screen(sample ? "pair-demo" : "pair", `<section class="result profile-report">
    <header class="result-header">
      <div><p class="eyebrow"><span aria-hidden="true"></span>${sample ? "示例 · 模拟作答" : "双人报告"}</p><h1 tabindex="-1">你们的相亲匹配度</h1></div>${next}
    </header>
    <div class="result-overview">
      <div><h2>${status}</h2><p>${subtitle}</p></div>
      ${score === null ? "<span>总分待确认</span>" : `<strong class="score">${score}<span>%</span></strong>`}
    </div>
    ${renderPairPersonalities(pair.personas)}
    <section class="result-section"><h2>两个人的期待</h2><div class="profile-summary">${stats.join("")}</div></section>
    <section class="result-section"><h2>六个方面的匹配</h2><div class="dimension-grid">${bars}</div></section>
    ${hobbies.length ? `<section class="result-section"><h2>可以一起做的事</h2><div class="report-identity">${hobbies.map(name => `<span class="chip">${safe(name)}</span>`).join("")}</div></section>` : ""}
    ${renderActions(pairActions(pair), true)}
    ${checked.length ? `<details class="answer-details"><summary>展开全部比较项</summary><ul class="result-list pair-checks">${checked.map(pairRow).join("")}</ul></details>` : ""}
    <div class="profile-footer">${sample ? '<button class="button quiet" type="button" data-action="leave-demo">返回测试</button>' :
      '<button class="text-button" type="button" data-action="reset">清空本次作答</button>'}</div>
  </section>`);
}

function restoreView(name) {
  if (name === "form" || name === "scene") renderStep();
  else if (name === "single") renderSingle(personalProfile(0));
  else if (name === "handoff") renderHandoff();
  else if (name === "pair") renderPair(report);
  else screen("home", home);
}

function downloadReport() {
  const canvas = document.createElement("canvas");
  canvas.width = 840;
  canvas.height = 650;
  const g = canvas.getContext("2d");
  if (!g) return;
  g.fillStyle = "#f9f2e7";
  g.fillRect(0, 0, 840, 650);
  g.fillStyle = "#38235c";
  g.fillRect(37, 37, 766, 576);
  g.fillStyle = "#fff8ed";
  g.textAlign = "center";
  g.font = '600 32px "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
  g.fillText("两人份 · 相亲匹配度", 420, 120);
  g.fillStyle = "#ffd3a9";
  g.font = report.score === null ? '600 60px "Noto Sans CJK SC",sans-serif' : "bold 150px Georgia, serif";
  g.fillText(report.score === null ? "还有话题待聊" : `${report.score}%`, 420, 330);
  g.fillStyle = "#fff8ed";
  g.font = '31px "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
  g.fillText(`${report.matches} / ${report.comparable} 个可比较项符合`, 420, 430);
  saveImage(canvas, "两人份-相亲匹配概览.png");
}

function downloadPersonality(persona) {
  if (!persona) return;
  const canvas = document.createElement("canvas");
  canvas.width = 720;
  canvas.height = 840;
  const g = canvas.getContext("2d");
  if (!g) return;
  const [surface, ink, accent] = palettes[persona.palette];
  g.fillStyle = surface;
  g.fillRect(0, 0, 720, 840);
  g.strokeStyle = accent;
  g.lineWidth = 2;
  g.strokeRect(28, 28, 664, 784);
  g.textAlign = "center";
  g.fillStyle = accent;
  g.font = '700 29px "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
  g.fillText("两人份 · 我的相亲人格", 360, 121);
  g.font = "bold 93px Georgia,serif";
  g.fillText(persona.code, 360, 275);
  g.fillStyle = ink;
  g.font = 'bold 57px "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
  g.fillText(persona.name, 360, 390, 620);
  g.font = '30px "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
  const lines = persona.quote.length > 16 ? [persona.quote.slice(0,16), persona.quote.slice(16)] : [persona.quote];
  lines.forEach((line, i) => g.fillText(line, 360, 478 + 43*i, 615));
  g.font = '700 25px "PingFang SC","Microsoft YaHei","Noto Sans CJK SC",sans-serif';
  g.fillText(persona.axes.map(item => item.name).join(" · "), 360, 661, 620);
  saveImage(canvas, "两人份-" + persona.name + ".png");
}

function saveImage(canvas, filename) {
  canvas.toBlob(blob => {
    if (!blob) {
      live.textContent = "分享卡生成失败，请重试。";
      return;
    }
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    live.textContent = "分享卡已生成。";
  }, "image/png");
}

async function copyFilter() {
  const field = document.querySelector("#filter-text");
  const feedback = document.querySelector("#copy-feedback");
  try {
    await navigator.clipboard.writeText(field.value);
    feedback.textContent = "已复制";
  } catch {
    field.focus();
    field.select();
    feedback.textContent = "已选中，可以直接复制";
  }
}

document.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  switch (button.dataset.action) {
    case "about": rulesDialog.showModal(); break;
    case "home":
      if (drafts.some(draft => Object.keys(draft).length) || report) restart.showModal();
      else reset();
      break;
    case "start-single": start("single"); break;
    case "start-pair": start("pair"); break;
    case "back":
      if (step) {
        step -= 1;
        renderStep();
      } else if (seat) renderHandoff();
      else if (Object.keys(drafts[0]).length) restart.showModal();
      else reset();
      break;
    case "scene": {
      const item = flowFor()[step];
      const choice = Number(button.dataset.key);
      if (!item.scene?.options[choice]) break;
      sceneAnswers[seat][item.index] = choice;
      step += 1;
      renderStep();
      break;
    }
    case "demo":
      if (page !== "demo" && page !== "pair-demo") returnTo = page;
      renderSingle(exampleProfiles[0], true);
      break;
    case "pair-demo": renderPair(matchPair(...exampleProfiles), true); break;
    case "leave-demo": restoreView(returnTo); break;
    case "stretch":
      if (page === "demo") sampleStretch = button.dataset.key;
      else stretch = button.dataset.key;
      renderSingle(page === "demo" ? exampleProfiles[0] : personalProfile(0), page === "demo", false);
      app.querySelector(`[data-key="${button.dataset.key}"]`)?.focus({ preventScroll: true });
      break;
    case "jump": {
      const target = document.getElementById(button.dataset.key);
      if (target?.tagName === "DETAILS") target.open = true;
      target?.focus({ preventScroll: true });
      target?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      break;
    }
    case "copy-filter": void copyFilter(); break;
    case "edit-wishes":
      mode = "single"; seat = 0; step = flowFor().length - 1; renderStep(); break;
    case "edit-profile":
      mode = "single"; seat = step = 0; editingProfile = true; renderStep(); break;
    case "handoff":
      mode = "pair";
      renderHandoff();
      break;
    case "second":
      seat = 1;
      step = 0;
      renderStep();
      break;
    case "persona-download": downloadPersonality(personalProfile(0).persona); break;
    case "share":
      if (!report) break;
      shareConsent.checked = false;
      saveCard.disabled = true;
      shareCard.showModal();
      break;
    case "reset": restart.showModal(); break;
  }
});

app.addEventListener("change", event => {
  if (page === "form") saveField(event.target);
});
app.addEventListener("input", event => {
  if (event.target.id === "city") {
    event.target.setCustomValidity("");
    saveField(event.target);
  }
});
app.addEventListener("submit", event => {
  if (event.target.id !== "profile-form") return;
  event.preventDefault();
  if (step === 0) {
    const control = event.target.elements.city;
    const city = normalizeCity(control.value);
    if (!validCity(city)) {
      control.setCustomValidity("请填写一个完整的城市名称，例如常州。");
      control.reportValidity();
      return;
    }
    drafts[seat].city = city;
  }
  if (editingProfile) {
    editingProfile = false; renderSingle(personalProfile(0)); return;
  }
  if (step < flowFor().length - 1) {
    step += 1;
    renderStep();
  } else if (mode === "single") {
    stretch = drafts[0].stretch || "";
    renderSingle(personalProfile(0));
  } else if (!seat) renderHandoff();
  else {
    report = matchPair(personalProfile(0), personalProfile(1));
    drafts = [{}, {}];
    sceneAnswers = [[], []];
    renderPair(report);
  }
});

restart.addEventListener("close", () => {
  if (restart.returnValue === "reset") reset();
  restart.returnValue = "";
});
shareConsent.addEventListener("change", () => { saveCard.disabled = !shareConsent.checked; });
saveCard.addEventListener("click", () => {
  if (!report || !shareConsent.checked) return;
  shareCard.close();
  downloadReport();
});
