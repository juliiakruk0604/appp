export type PsychJob = "SAFETY"|"REGULATE"|"UNDERSTAND"|"CLARIFY"|"SAY"|"CHANGE"|"DECIDE";

export type CaseInput = {
  gapChoice: number;
  example: string;
  wanted?: string;
  why?: number;
  distress: number;
  repeats: number;
  priorTalks: number;
  failedAgreements: number;
};

export type ProtocolCard = {
  id: string;
  job: PsychJob;
  name: string;
  useWhen: string[];
  avoidWhen: string[];
  formulation: string[];
  nextQuestions: string[];
  intervention: string;
  output: string;
  followup: string;
  evidenceBasis: string[];
};

export const protocolCards: ProtocolCard[] = [
  {
    id:"SAFE-01", job:"SAFETY", name:"Safety before relationship work",
    useWhen:["fear of partner","threats/coercion","physical or sexual violence","stalking/control"],
    avoidWhen:["no safety signal"],
    formulation:["what happened","is there immediate danger","can the user safely continue","what support is available"],
    nextQuestions:["Чи є ризик, що розмова або дія зараз зробить ситуацію небезпечнішою?"],
    intervention:"Stop ordinary couple-work. Prioritize privacy, immediate safety, trusted human/professional support and local emergency resources when needed.",
    output:"Safety-oriented next step, not a communication exercise.",
    followup:"Check safety and access to support before returning to relationship work.",
    evidenceBasis:["WHO survivor-centred first-line support principles"]
  },
  {
    id:"REG-01", job:"REGULATE", name:"High arousal before action",
    useWhen:["distress 8–10/10","strong urge to act immediately","conversation likely to escalate"],
    avoidWhen:["safety signal","low arousal and clear goal"],
    formulation:["trigger","emotion intensity","urge","what must not be decided at peak arousal"],
    nextQuestions:["Що ти хочеш зробити прямо зараз?","Що зміниться, якщо відкласти дію на короткий час?"],
    intervention:"Delay irreversible or escalatory action, lower arousal, set a concrete time to revisit the issue.",
    output:"Pause plan + return point.",
    followup:"Did intensity drop enough to choose a next step deliberately?",
    evidenceBasis:["structured self-help","behavioral regulation principles"]
  },
  {
    id:"UND-01", job:"UNDERSTAND", name:"Facts, meaning, need",
    useWhen:["user is confused by own reaction","unclear what exactly hurts","first episode with little context"],
    avoidWhen:["safety signal","clear repeated behavior-change failure"],
    formulation:["observable event","interpretation","emotion","need/value","uncertainty"],
    nextQuestions:["Що тут факт?","Що ти припускаєш?","Що саме було болючим?"],
    intervention:"Separate observable facts from inferred motives and identify the unresolved need.",
    output:"One precise formulation of what is known vs unknown.",
    followup:"What new information changed the formulation?",
    evidenceBasis:["CBT-style formulation","IBCT unified detachment"]
  },
  {
    id:"CLR-01", job:"CLARIFY", name:"One missing piece of information",
    useWhen:["user cannot act because partner intent/readiness is unknown","uncertainty is the main blocker"],
    avoidWhen:["question has already been answered repeatedly","safety signal"],
    formulation:["what is known","what is unknown","what one answer would change the decision"],
    nextQuestions:["Якої однієї інформації тобі зараз бракує?"],
    intervention:"Ask one bounded, non-accusatory question rather than solve the whole relationship.",
    output:"One clarification question.",
    followup:"What did you learn, and did it change the next decision?",
    evidenceBasis:["problem-solving","motivational interviewing autonomy principles"]
  },
  {
    id:"SAY-01", job:"SAY", name:"Say the known need earlier",
    useWhen:["user knows what matters","avoids saying it","fear of conflict/demandingness"],
    avoidWhen:["high arousal","safety signal","same request already discussed multiple times with no change"],
    formulation:["fact","reaction","need","fear of saying it","specific request"],
    nextQuestions:["Що хотілося сказати?","Чого боїшся, якщо скажеш?","Яка конкретна просьба?"],
    intervention:"Convert suppressed dissatisfaction into one factual statement and one concrete request.",
    output:"Conversation opener / message draft.",
    followup:"Did the user say it? What happened next?",
    evidenceBasis:["behavioral couple communication","guided self-help"]
  },
  {
    id:"SAY-02", job:"SAY", name:"Boundary statement",
    useWhen:["user knows something is not acceptable","needs a clear boundary rather than persuasion"],
    avoidWhen:["safety signal where boundary-setting could increase danger"],
    formulation:["behavior","personal limit","why it matters","what user will do if limit is crossed"],
    nextQuestions:["Що саме для тебе не ок?","Що залежить від тебе, якщо це повториться?"],
    intervention:"Define boundary as user's limit/action, not a rule controlling the partner.",
    output:"Boundary statement + own next action.",
    followup:"Was the boundary communicated and respected?",
    evidenceBasis:["assertiveness","behavioral principles"]
  },
  {
    id:"CHG-01", job:"CHANGE", name:"Communication is not the bottleneck anymore",
    useWhen:["same issue repeated 3+ times","2+ prior talks","partner already understands issue"],
    avoidWhen:["issue has never been discussed","safety signal"],
    formulation:["repetition count","what was already explained","what was agreed","what behavior actually changed"],
    nextQuestions:["Що саме було домовлено минулого разу?","Що змінилося не в словах, а в діях?"],
    intervention:"Stop optimizing wording; define observable behavior change and a review point.",
    output:"Behavior criterion + check date.",
    followup:"Did the agreed behavior occur consistently enough to count as change?",
    evidenceBasis:["behavior change","OurRelationship Respond phase"]
  },
  {
    id:"CHG-02", job:"CHANGE", name:"Break the interaction cycle",
    useWhen:["conversation predictably escalates","both reactions feed the next reaction","issue recurs despite intent"],
    avoidWhen:["only one isolated event","safety signal"],
    formulation:["trigger","person A response","person B response as reported","feedback loop","earliest break point"],
    nextQuestions:["На якому кроці розмова зазвичай ламається?","Що ти робиш наступним?"],
    intervention:"Target one early interrupt in the cycle instead of solving the entire topic.",
    output:"Cycle map + one interruption experiment.",
    followup:"Did interrupting that step change the rest of the sequence?",
    evidenceBasis:["IBCT interaction patterns","unified detachment"]
  },
  {
    id:"DEC-01", job:"DECIDE", name:"Repeated problem, unclear willingness to change",
    useWhen:["4+ recurrences","3+ prior talks","2+ failed agreements","user is deciding whether to keep investing"],
    avoidWhen:["insufficient history","acute high arousal","safety signal"],
    formulation:["what repeats","what was tried","what actually changed","non-negotiables","what requires the partner"],
    nextQuestions:["Яке мінімальне реальне змінення тобі потрібно побачити?","Скільки часу ти готова спостерігати?"],
    intervention:"Decision support, not a yes/no verdict: define missing evidence and decision criteria.",
    output:"Decision map + unanswered questions + observation window.",
    followup:"What evidence appeared during the observation window?",
    evidenceBasis:["problem-solving","motivational interviewing","behavioral outcome review"]
  },
  {
    id:"DEC-02", job:"DECIDE", name:"Acceptance versus change",
    useWhen:["difference may be stable rather than fixable","user keeps trying to change partner preference/trait","no clear violation or safety issue"],
    avoidWhen:["coercion/abuse","specific solvable implementation problem"],
    formulation:["difference","cost of accepting","cost of continuing to fight it","what is actually controllable"],
    nextQuestions:["Якщо це не зміниться, чи можеш ти жити з цим?","Що тут можна змінити лише зі свого боку?"],
    intervention:"Separate what can be negotiated from what may need acceptance or a personal decision.",
    output:"Acceptance/change boundary map.",
    followup:"Did the user learn new evidence about whether this difference is workable?",
    evidenceBasis:["IBCT acceptance/change framework"]
  }
];

const safetyTerms = ["боюсь його","боюся його","удар","бьет","б'є","угрож","погрож","змушує","принуж","насили","небезп","следит","пересліду","контролює гроші","забирає гроші"];

export function routeCase(input: CaseInput) {
  const text=(input.example+" "+(input.wanted||"")).toLowerCase();
  const safety = safetyTerms.some(t=>text.includes(t));
  if (safety) return result("SAFE-01","Є сигнал, який важливіше перевірити на безпеку, ніж продовжувати звичайний relationship-flow.",input);
  if (input.distress>=8) return result("REG-01","Зараз інтенсивність емоції занадто висока для якісного рішення або складної розмови.",input);
  if (input.repeats>=4 && input.priorTalks>=3 && input.failedAgreements>=2)
    return result("DEC-01","Проблему вже неодноразово обговорювали, але домовленості не дали стійкої зміни. Ще один кращий текст навряд чи є головною потребою.",input);
  if (input.repeats>=3 && input.priorTalks>=2)
    return result("CHG-01","Тема вже зрозуміла і проговорена. Наступне питання — не як пояснити краще, а що реально змінюється у поведінці.",input);
  if (input.gapChoice===3 && input.repeats>=2)
    return result("CHG-02","Схоже, проблема не лише у змісті теми, а у повторюваній послідовності самої розмови.",input);
  if (input.gapChoice===2 && input.repeats>=2 && input.priorTalks>=1)
    return result("CHG-01","Тема вже не нова. Варто перевіряти не ще одну формулу слів, а що реально змінюється після розмов.",input);
  if (input.gapChoice===0)
    return result("SAY-01","Ти можеш назвати, чого хочеш, але бар'єр виникає в момент, коли це треба сказати.",input);
  if (input.gapChoice===4)
    return result("CLR-01","Зараз рішення блокує одна важлива невідома. Її варто з'ясувати окремо, не перетворюючи це на велику розмову про все.",input);
  if (input.gapChoice===1)
    return result("UND-01","Поки рано робити складніший висновок. Спочатку потрібно відділити факт, значення і те, що саме зачепило.",input);
  return result("UND-01","Даних поки замало для складнішої гіпотези. Спочатку потрібно відділити факт, значення і потребу.",input);
}

function result(id:string, reason:string, input:CaseInput){
  const protocol=protocolCards.find(p=>p.id===id)!;
  const confidence =
    input.repeats>=4 ? "середня" :
    input.repeats>=2 ? "низька–середня" : "низька";
  return {protocol, reason, confidence};
}

export type GoldCase = {
  id:string;
  input:CaseInput;
  expectedProtocol:string;
  rationale:string;
};

const base=(o:Partial<CaseInput>):CaseInput=>({
  gapChoice:4, example:"", wanted:"", why:0, distress:4, repeats:1, priorTalks:0, failedAgreements:0, ...o
});

export const goldCases: GoldCase[] = [
  {id:"G01",input:base({gapChoice:0,example:"Він скасував плани, я сказала що все нормально.",wanted:"Хотіла сказати, що засмутилася."}),expectedProtocol:"SAY-01",rationale:"Known need + avoidance."},
  {id:"G02",input:base({gapChoice:0,example:"Хочу підняти тему грошей, але відкладаю.",wanted:"Хочу попросити планувати бюджет разом."}),expectedProtocol:"SAY-01",rationale:"Known request, blocked communication."},
  {id:"G03",input:base({gapChoice:1,example:"Він коротко відповів, і мене дуже зачепило. Не розумію чому."}),expectedProtocol:"UND-01",rationale:"Meaning/need unclear."},
  {id:"G04",input:base({gapChoice:4,example:"Не знаю, він просто втомився чи не хоче говорити."}),expectedProtocol:"CLR-01",rationale:"One missing answer blocks action."},
  {id:"G05",input:base({gapChoice:3,example:"Ми знову посварились і я хочу написати дуже різко.",distress:9,repeats:2}),expectedProtocol:"REG-01",rationale:"High arousal override."},
  {id:"G06",input:base({gapChoice:0,example:"Він ударив стіну біля мене і я боюся його реакції.",distress:8}),expectedProtocol:"SAFE-01",rationale:"Safety overrides all routing."},
  {id:"G07",input:base({gapChoice:2,example:"Третій раз скасовує плани. Ми вже двічі це обговорювали.",repeats:3,priorTalks:2}),expectedProtocol:"CHG-01",rationale:"Communication already occurred."},
  {id:"G08",input:base({gapChoice:2,example:"П'ять разів говорили про запізнення, дві домовленості зірвались.",repeats:5,priorTalks:4,failedAgreements:2}),expectedProtocol:"DEC-01",rationale:"Repeated failed agreements."},
  {id:"G09",input:base({gapChoice:3,example:"Я тисну, він закривається, я тисну сильніше.",repeats:3}),expectedProtocol:"CHG-02",rationale:"Recurring interaction cycle."},
  {id:"G10",input:base({gapChoice:1,example:"Не знаю, чи мене зачепила подія, чи те що я про неї подумала."}),expectedProtocol:"UND-01",rationale:"Fact vs meaning."},
  {id:"G11",input:base({gapChoice:0,example:"Хочу попросити більше часу разом, але боюся виглядати нав'язливою."}),expectedProtocol:"SAY-01",rationale:"Anticipated reaction blocks saying need."},
  {id:"G12",input:base({gapChoice:4,example:"Він сказав, що йому треба час. Не знаю, це вечір чи тиждень."}),expectedProtocol:"CLR-01",rationale:"Bounded clarification."},
  {id:"G13",input:base({gapChoice:3,example:"Я так зла, що хочу закінчити стосунки сьогодні.",distress:9}),expectedProtocol:"REG-01",rationale:"Peak arousal before irreversible action."},
  {id:"G14",input:base({gapChoice:0,example:"Він контролює мої гроші і я боюся сказати ні."}),expectedProtocol:"SAFE-01",rationale:"Coercive control signal."},
  {id:"G15",input:base({gapChoice:2,example:"Вчетверте кажу, що мені потрібне попередження про зміну планів.",repeats:4,priorTalks:3,failedAgreements:1}),expectedProtocol:"CHG-01",rationale:"Implementation, not wording."},
  {id:"G16",input:base({gapChoice:2,example:"П'ять розмов, три домовленості, дві зірвались.",repeats:6,priorTalks:5,failedAgreements:2}),expectedProtocol:"DEC-01",rationale:"Decision-support threshold."},
  {id:"G17",input:base({gapChoice:3,example:"Про друзів завжди однаково: я питаю, він захищається, я підвищую голос.",repeats:4}),expectedProtocol:"CHG-02",rationale:"Cycle target."},
  {id:"G18",input:base({gapChoice:1,example:"Він не написав добрий ранок, і я вирішила що він охолов."}),expectedProtocol:"UND-01",rationale:"Interpretation outruns evidence."},
  {id:"G19",input:base({gapChoice:0,example:"Хочу сказати, що секс останнім часом для мене некомфортний, але соромлюся."}),expectedProtocol:"SAY-01",rationale:"Known need, communication barrier."},
  {id:"G20",input:base({gapChoice:3,example:"Після сварки хочу надіслати 15 повідомлень.",distress:9,repeats:2}),expectedProtocol:"REG-01",rationale:"Strong immediate urge."},
  {id:"G21",input:base({gapChoice:4,example:"Не розумію, він погодився чи просто сказав «добре»."}),expectedProtocol:"CLR-01",rationale:"Clarify commitment."},
  {id:"G22",input:base({gapChoice:0,example:"Мені не ок, коли беруть мій телефон без дозволу.",wanted:"Хочу це прямо сказати."}),expectedProtocol:"SAY-01",rationale:"Boundary communication path in v2 UI."},
  {id:"G23",input:base({gapChoice:1,example:"Не знаю, чого хочу після цієї сварки.",distress:5}),expectedProtocol:"UND-01",rationale:"Need clarification."},
  {id:"G24",input:base({gapChoice:3,example:"Я хочу говорити зараз, він просить паузу, я не даю, далі сварка.",repeats:2}),expectedProtocol:"CHG-02",rationale:"Repeated escalation sequence."},
  {id:"G25",input:base({gapChoice:0,example:"Ми про це ще не говорили. Я знаю конкретно, що хочу попросити."}),expectedProtocol:"SAY-01",rationale:"First communication attempt."},
  {id:"G26",input:base({gapChoice:2,example:"Ми вже тричі говорили і він каже, що розуміє.",repeats:3,priorTalks:3}),expectedProtocol:"CHG-01",rationale:"No need for more explanation."},
  {id:"G27",input:base({gapChoice:4,example:"Партнер переслідує мене після розриву і приходить без дозволу."}),expectedProtocol:"SAFE-01",rationale:"Stalking signal."},
  {id:"G28",input:base({gapChoice:4,example:"Сьогодні вперше так сталося. Не знаю, чи він взагалі готовий це обговорювати."}),expectedProtocol:"CLR-01",rationale:"One answer needed."},
  {id:"G29",input:base({gapChoice:3,example:"Третій конфлікт за місяць і завжди одна й та сама ескалація.",repeats:3}),expectedProtocol:"CHG-02",rationale:"Cycle before content optimization."},
  {id:"G30",input:base({gapChoice:2,example:"Вісім місяців одна тема, багато розмов і дві зірвані домовленості.",repeats:6,priorTalks:4,failedAgreements:2}),expectedProtocol:"DEC-01",rationale:"Longitudinal failed change attempts."}
]

export function evaluateGoldCases(){
  const misses=goldCases.filter(c=>routeCase(c.input).protocol.id!==c.expectedProtocol);
  return {total:goldCases.length,passed:goldCases.length-misses.length,misses};
}
