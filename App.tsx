import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, ChevronRight, Copy, EyeOff, LockKeyhole,
  MessageCircle, RotateCcw, Send, Sparkles, TimerReset, Users, Compass,
  PenLine, Target, ShieldCheck, CircleHelp, Layers3
} from "lucide-react";
import "./solo.css";
import { routeCase } from "./clinicalBrain";

type Screen =
  | "landing" | "role" | "profile" | "invite" | "mapIntro" | "mapQuestions"
  | "soloStart" | "soloResult" | "soloGap" | "soloExample" | "soloParse" | "soloNeed" | "soloObservation"
  | "soloAction" | "soloMessage" | "soloHome" | "soloFollowup"
  | "mapResult" | "paywall" | "moduleIntro" | "moduleQuestions"
  | "moduleWaiting" | "reveal" | "finding" | "talk" | "agreement" | "home" | "checkin";

const mapQs = [
  "Наскільки близькими ви відчуваєте себе останнім часом?",
  "Наскільки вам вистачає уваги одне до одного?",
  "Наскільки комфортно вам говорити про складне?",
  "Наскільки справедливо розподілені побутові справи?"
];

const mapAreas = ["Близькість","Увага","Складні розмови","Побут"];

const gapOptions = [
  "Я знаю, що хочу сказати, але відкладаю",
  "Не розумію, що саме мене так зачепило",
  "Ми це вже обговорювали, але нічого не змінюється",
  "Розмова швидко перетворюється на конфлікт",
  "Мені бракує однієї важливої відповіді"
];

const whyOptions = [
  "Не хотіла конфлікту",
  "Боялася здатися вимогливою",
  "Думала, він сам зрозуміє",
  "Не могла сформулювати"
];

const interpretationOptions:Record<number,string[]> = {
  0:["Я не сказала те, що насправді хотіла","Я очікую негативної реакції на прямоту","Мені важко просити про конкретне"],
  1:["Мене зачепила сама подія","Мене зачепило значення, яке я їй надала","Найважче тут — невизначеність"],
  2:["Проблема повторюється","Розмови не переходять у зміни","Домовленості не втримуються"],
  3:["Ми швидко переходимо в захист","Пауза сприймається як віддалення","Розмова втрачає початкову тему"],
  4:["Не знаю, чи партнер готовий говорити","Не знаю, що саме означає його реакція","Не знаю, чи є готовність щось змінювати"]
};

const unknownByFocus:Record<number,string> = {
  0:"Як партнер відреагує на пряму, конкретну розмову.",
  1:"Що тут факт, а що — твоє перше пояснення цієї події.",
  2:"Чи є після розмов реальна, спостережувана зміна поведінки.",
  3:"На якому кроці запускається ескалація і де її можна перервати.",
  4:"Одна конкретна відповідь партнера, якої зараз бракує."
};

const moduleQs = [
  {
    label:"Межі · доступність",
    q:"Як часто для тебе нормально бути недоступним/ою для партнера без пояснення?",
    opts:["Майже ніколи","Іноді","Досить часто"],
    a:0,b:2
  },
  {
    label:"Межі · приватність",
    q:"Телефон партнера лежить поруч. Що для тебе природно?",
    opts:["Не торкаюсь без дозволу","Можу взяти для побутової дрібниці","У нас немає приватності в телефонах"],
    a:0,b:1
  },
  {
    label:"Межі · соціальне",
    q:"Партнер планує вечір із друзями окремо. Яка реакція ближча?",
    opts:["Ок, це нормально","Хочу знати деталі","Мені неприємно, якщо мене не запросили"],
    a:0,b:1
  }
];

const findings = [
  {n:"01",t:"Близькість",d:"Один уже відчуває дистанцію, інший — ще ні"},
  {n:"02",t:"Підтримка",d:"Ви хочете турботи, але впізнаєте її за різними сигналами"},
  {n:"03",t:"Темп розмови",d:"Одному важливо говорити одразу, іншому — після паузи"}
];

function Logo(){
  return <div className="logo"><span className="rings"><i/><i/></span><span>Двоє</span></div>
}

function Shell({children, step, onBack, onReset}:{children:React.ReactNode;step?:number;onBack?:()=>void;onReset:()=>void}){
  return <div className="stage">
    <div className="noise"/>
    <div className="phone">
      <header className="topbar">
        <button className={"iconButton "+(!onBack?"ghosted":"")} onClick={onBack}><ArrowLeft size={19}/></button>
        <Logo/>
        <button className="iconButton" onClick={onReset} title="Почати заново"><RotateCcw size={17}/></button>
      </header>
      {typeof step==="number" && <div className="progress"><span style={{width:step+"%"}}/></div>}
      <main className="viewport">{children}</main>
    </div>
  </div>
}

const Fade = ({children}:{children:React.ReactNode}) => (
  <motion.div className="screen" initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:.32,ease:[.2,.75,.2,1]}}>
    {children}
  </motion.div>
);

function Button({children,onClick,secondary=false,disabled=false}:{children:React.ReactNode;onClick:()=>void;secondary?:boolean;disabled?:boolean}){
  return <button disabled={disabled} className={"primaryBtn "+(secondary?"secondary":"")} onClick={onClick}>{children}<ArrowRight size={17}/></button>
}

function HeroTeaser(){
  return <div className="heroTeaser">
    <div className="teaserPrompt">Коли між нами напруга, мені важливо…</div>
    <div className="lensPair">
      <motion.div className="lens lensA" initial={{x:-12,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:.16}}>
        <span>Ви</span><b>поговорити зараз</b>
      </motion.div>
      <motion.div className="lens lensB" initial={{x:12,opacity:0}} animate={{x:0,opacity:1}} transition={{delay:.24}}>
        <span>Партнер</span><b>спочатку взяти паузу</b>
      </motion.div>
    </div>
    <motion.div className="teaserInsight" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.45}}>
      <Sparkles size={15}/><span><strong>Одна ситуація — два способи берегти контакт.</strong><br/>Двоє показує різницю до того, як вона стає сваркою.</span>
    </motion.div>
  </div>
}

function Radar(){
  const pointsA = "150,28 224,63 255,135 235,214 165,252 82,229 42,156 70,76";
  const pointsB = "150,45 207,79 238,138 217,192 158,228 98,211 63,153 86,91";
  return <div className="radarWrap">
    <svg viewBox="0 0 300 280" className="radar">
      {[1,2,3,4].map(i=><polygon key={i} points="150,18 240,60 274,145 238,230 150,270 62,230 26,145 60,60" fill="none" stroke="#d7d1c6" strokeWidth="1" transform={"scale("+(1-i*.16)+") translate("+(i*24)+","+(i*22)+")"}/>)}
      <line x1="150" y1="18" x2="150" y2="270" stroke="#ded8cd"/>
      <line x1="26" y1="145" x2="274" y2="145" stroke="#ded8cd"/>
      <polygon points={pointsA} fill="rgba(67,87,73,.14)" stroke="#435749" strokeWidth="2"/>
      <polygon points={pointsB} fill="rgba(184,119,94,.12)" stroke="#b8775e" strokeWidth="2"/>
    </svg>
    <div className="radarLegend"><span><i className="moss"/>Ви</span><span><i className="clay"/>Партнер</span></div>
  </div>
}

export function App(){
  const [screen,setScreen] = useState<Screen>("landing");
  const [history,setHistory] = useState<Screen[]>([]);
  const [entrySolo,setEntrySolo] = useState(false);
  const [role,setRole] = useState<"a"|"b">("a");
  const [mapI,setMapI] = useState(0);
  const [mapAnswers,setMapAnswers] = useState<Record<string,{now:number,want:number}>>({});
  const [gapChoice,setGapChoice] = useState(3);
  const [example,setExample] = useState("");
  const [interpretChoice,setInterpretChoice] = useState(0);
  const [wanted,setWanted] = useState("");
  const [why,setWhy] = useState(0);
  const [nextAction,setNextAction] = useState(0);
  const [followup,setFollowup] = useState<number|null>(null);
  const [distress,setDistress] = useState(5);
  const [repeats,setRepeats] = useState(1);
  const [priorTalks,setPriorTalks] = useState(0);
  const [failedAgreements,setFailedAgreements] = useState(0);
  const [records,setRecords] = useState<Array<{example:string;focus:string;route:string;outcome:string}>>([]);

  const [moduleI,setModuleI] = useState(0);
  const [moduleAnswers,setModuleAnswers] = useState<Record<string,number>>({});
  const [agreement,setAgreement] = useState(0);
  const [check,setCheck] = useState(1);
  const [revealI,setRevealI] = useState(0);

  const go=(next:Screen)=>{setHistory(h=>[...h,screen]);setScreen(next)};
  const back=()=>{setHistory(h=>{if(!h.length)return h; const copy=[...h]; const prev=copy.pop()!; setScreen(prev); return copy})};
  const reset=()=>{
    setScreen("landing");setHistory([]);setEntrySolo(false);setRole("a");setMapI(0);setMapAnswers({});
    setGapChoice(3);setExample("");setInterpretChoice(0);
    setWanted("");
    setWhy(0);setNextAction(0);setFollowup(null);setDistress(5);setRepeats(1);setPriorTalks(0);setFailedAgreements(0);setRecords([]);setModuleI(0);setModuleAnswers({});
    setAgreement(0);setCheck(1);setRevealI(0);
  };

  const progress = useMemo(()=>{
    const soloOrder:Screen[]=["landing","role","soloStart","profile","mapIntro","mapQuestions","soloResult","soloGap","soloExample","soloParse","soloNeed","soloObservation","soloMessage","soloHome"];
    const pairOrder:Screen[]=["landing","role","profile","invite","mapIntro","mapQuestions","mapResult","paywall","moduleIntro","moduleQuestions","moduleWaiting","reveal","finding","talk","agreement","home","checkin"];
    const order = ["soloStart","soloResult","soloGap","soloExample","soloParse","soloNeed","soloObservation","soloAction","soloMessage","soloHome","soloFollowup"].includes(screen) ? soloOrder : pairOrder;
    const idx=Math.max(0,order.indexOf(screen));
    return Math.round((idx/(order.length-1))*100);
  },[screen]);

  const ownMap = mapQs.map((_,i)=>mapAnswers["a:"+i]||{now:[7,5,4,6][i],want:[8,8,8,7][i]});
  const largestGap = useMemo(()=>{
    let idx=0, diff=-1;
    ownMap.forEach((x,i)=>{const d=x.want-x.now;if(d>diff){diff=d;idx=i}});
    return {idx, diff, ...ownMap[idx]};
  },[mapAnswers]);
  const gapArea = mapAreas[largestGap.idx] || "Складні розмови";
  const brain = useMemo(()=>routeCase({
    gapChoice, example, wanted, why, distress, repeats, priorTalks, failedAgreements
  }),[gapChoice,example,wanted,why,distress,repeats,priorTalks,failedAgreements]);
  const jobLabel:Record<string,string> = {
    SAFETY:"СПОЧАТКУ БЕЗПЕКА",
    REGULATE:"СПОЧАТКУ ЗНИЗИТИ НАПРУГУ",
    UNDERSTAND:"СПОЧАТКУ ЗРОЗУМІТИ",
    CLARIFY:"СПОЧАТКУ З'ЯСУВАТИ",
    SAY:"ПОТРІБНО СКАЗАТИ",
    CHANGE:"ПРОБЛЕМА ВЖЕ НЕ В СЛОВАХ",
    DECIDE:"ПОТРІБНІ КРИТЕРІЇ РІШЕННЯ"
  };
  const hasMap = Object.keys(mapAnswers).some(k=>k.startsWith("a:"));
  const focusLabel = [
    "Сказати важливе",
    "Зрозуміти свою реакцію",
    "Перевірити, чи щось реально змінюється",
    "Зупинити повторювану ескалацію",
    "Отримати одну важливу відповідь"
  ][gapChoice];
  const interpretations=interpretationOptions[gapChoice]||interpretationOptions[1];
  const interpretedCenter=interpretations[interpretChoice]||interpretations[0];
  const openCases = followup===null ? 1 : 0;
  const totalCases = records.length + (records.some(r=>r.example===example)?0:1);
  const checkedOutcomes = records.length;

  const followupOptions:Record<string,string[]> = {
    SAY:["Сказала / поговорили","Сказала / почався конфлікт","Не сказала","Ситуація втратила актуальність"],
    CLARIFY:["Отримала чітку відповідь","Відповідь лишилась нечіткою","Не запитала","Партнер не відповів"],
    UNDERSTAND:["Стало зрозуміліше","З'явилась нова інформація","Все ще плутаюсь","Потрібна розмова з партнером"],
    REGULATE:["Повернулась до теми спокійніше","Напруга лишилась високою","Зробила на імпульсі","Тема втратила актуальність"],
    CHANGE:["Зміна відбулась","Частково","Нічого не змінилось","Не було нагоди перевірити"],
    DECIDE:["Побачила реальну готовність","Не побачила змін","Сигнали змішані","Потрібно більше часу"],
    SAFETY:["Я зараз у безпеці","Потрібна людська підтримка","Ситуація стала небезпечнішою","Не хочу відповідати"]
  };
  const homeStep:Record<string,{title:string,follow:string}> = {
    SAY:{title:"Сказати одну конкретну річ",follow:"Після цього перевіримо не красу формулювання, а що реально сталося."},
    CLARIFY:{title:"Отримати одну відповідь",follow:"Повернись, коли стане зрозуміло, що партнер реально готовий обговорювати."},
    UNDERSTAND:{title:"Відділити факт від значення",follow:"Повернись, якщо з'явиться нова інформація або твоє трактування зміниться."},
    REGULATE:{title:"Не вирішувати на піку напруги",follow:"Перевіримо, чи змінився твій вибір, коли напруга стала нижчою."},
    CHANGE:{title:"Перевірити одну конкретну зміну",follow:"Нас цікавить поведінка в житті, а не ще одна обіцянка."},
    DECIDE:{title:"Зібрати відсутні дані для рішення",follow:"Двоє не вирішує за тебе — воно допомагає побачити, на чому рішення реально стоїть."},
    SAFETY:{title:"Спочатку подбати про безпеку",follow:"Не запускаємо звичайну couple-роботу, поки це може бути небезпечно."}
  };

  const content=()=>{
    if(screen==="landing") return <Fade>
      <div className="eyebrow">ПРОСТІР ДЛЯ ДВОХ</div>
      <h1 className="display">Не тест на сумісність.<br/>Спосіб побачити те, що між вами губиться.</h1>
      <p className="lead">Ви відповідаєте окремо. Двоє порівнює два погляди й показує конкретні місця, де ви читаєте одну ситуацію по-різному.</p>
      <HeroTeaser/><div className="spacer"/>
      <Button onClick={()=>go("role")}>Пройти карту безкоштовно</Button>
    </Fade>;

    if(screen==="role") return <Fade>
      <div className="eyebrow">01 · ВХІД</div><h2 className="title">Хто ви зараз?</h2>
      <p className="lead">Обидва шляхи можуть зійтися пізніше.</p>
      <div className="choiceList">
        <button className="choice featured" onClick={()=>{setEntrySolo(false);go("profile")}}><Users size={20}/><div><b>Ми пара</b><span>Порівнюємо два погляди</span></div><ChevronRight size={18}/></button>
        <button className="choice" onClick={()=>{setEntrySolo(true);go("soloStart")}}><div className="singleDot"/><div><b>Я сам / партнер поки ні</b><span>Почати зі своєї сторони</span></div><ChevronRight size={18}/></button>
        <button className="choice mutedChoice"><div className="singleDot square"/><div><b>Я психолог</b><span>Окремий кабінет</span></div><ChevronRight size={18}/></button>
      </div>
    </Fade>;

    if(screen==="soloStart") return <Fade>
      <div className="eyebrow">SOLO · БЕЗ ЗАЙВОЇ АНКЕТИ</div>
      <h2 className="display smallDisplay">Що тобі потрібно зараз?</h2>
      <p className="lead">Якщо щось сталося сьогодні — не треба спочатку проходити карту. Почнемо з ситуації й дамо користь одразу.</p>
      <div className="soloStartChoices">
        <button className="featured" onClick={()=>go("soloGap")}><MessageCircle size={19}/><div><b>Розібрати те, що сталося</b><span>2–4 хв · один конкретний наступний крок</span></div><ChevronRight size={18}/></button>
        <button onClick={()=>go("profile")}><Compass size={19}/><div><b>Подивитися мою сторону стосунків</b><span>Карта «як є → як хочу», а потім реальна ситуація</span></div><ChevronRight size={18}/></button>
      </div>
      <div className="soloStartPromise"><Sparkles size={15}/><p>Двоє не буде робити висновки про твої «типи» чи характер партнера з однієї історії.</p></div>
    </Fade>;

    if(screen==="profile") return <Fade>
      <div className="eyebrow">02 · КОРОТКО ПРО ВАС</div><h2 className="title">Щоб питання були доречними.</h2>
      <div className="fieldGrid">
        <label><span>Ваше ім’я</span><input defaultValue="Юлія"/></label>
        <label><span>Ім’я партнера</span><input defaultValue={entrySolo?"":"Андрій"} placeholder="Необов'язково"/></label>
        <label className="wide"><span>Скільки ви разом?</span><div className="segmented"><button className="active">1–3 роки</button><button>3–7</button><button>7+</button></div></label>
        <label className="wide"><span>Живете разом?</span><div className="segmented"><button className="active">Так</button><button>Ні</button></div></label>
      </div>
      <p className="tiny">Відповіді потрібні лише для маршруту. Ніяких висновків про партнера без його відповідей.</p>
      <div className="spacer"/><Button onClick={()=>entrySolo?go("mapIntro"):go("invite")}>Продовжити</Button>
    </Fade>;

    if(screen==="invite") return <Fade>
      <div className="eyebrow">03 · ЗАПРОШЕННЯ</div><h2 className="title">Другий погляд робить карту спільною.</h2>
      <p className="lead">Андрій отримає своє посилання. Ваші відповіді він не побачить до завершення обох сторін.</p>
      <div className="inviteObject">
        <div><span>Код пари</span><strong>DV—24</strong></div><button><Copy size={15}/>Копіювати</button>
      </div>
      <div className="invitePreview"><div className="avatar">Ю</div><div><span>Запрошення від Юлії</span><p>«Хочу пройти це разом і подивитися, де ми бачимо речі по-різному»</p></div></div>
      <div className="spacer"/><Button onClick={()=>go("mapIntro")}><Send size={16}/> Надіслати й продовжити</Button>
      <button className="textBtn" onClick={()=>{setEntrySolo(true);go("mapIntro")}}>Поки продовжити самій</button>
    </Fade>;

    if(screen==="mapIntro") return <Fade>
      <div className="eyebrow">{entrySolo?"МОЯ СТОРОНА":"БЕЗКОШТОВНА КАРТА СТОСУНКІВ"}</div>
      <h2 className="display smallDisplay">{entrySolo?"Спочатку зрозуміємо, де саме тобі хочеться змін.":"8 сфер. Два погляди. Без оцінки «добре / погано»."}</h2>
      <p className="lead">На кожній сфері буде два повзунки: <b>як є зараз</b> і <b>як я хочу</b>. У повній карті — 20 питань, приблизно 8 хвилин.</p>
      <div className="howList">
        <div><span>01</span><p>Відповідаєш тільки про свій досвід</p><EyeOff size={18}/></div>
        <div><span>02</span><p>Бачиш свою карту одразу</p><Compass size={18}/></div>
        <div><span>03</span><p>Переходимо до однієї реальної ситуації</p><Target size={18}/></div>
      </div>
      <div className="spacer"/><Button onClick={()=>{setRole("a");setMapI(0);go("mapQuestions")}}>Почати</Button>
    </Fade>;

    if(screen==="mapQuestions"){
      const q=mapQs[mapI];
      const key=role+":"+mapI;
      const preset = role==="a" ? {now:[7,5,4,6][mapI],want:[8,8,8,7][mapI]} : {now:[6,7,7,7][mapI],want:[8,8,8,8][mapI]};
      const val=mapAnswers[key]||preset;
      return <Fade>
        <div className="questionTop"><span>{role==="a"?"Ваш погляд":"Погляд партнера"}</span><b>{mapI+1} / 4 <em>демо</em></b></div>
        <h2 className="question">{q}</h2>
        <div className="dualSlider">
          <div className="sliderHead"><span>Як зараз</span><strong>{val.now}</strong></div>
          <input type="range" min="0" max="10" value={val.now} onChange={e=>setMapAnswers(x=>({...x,[key]:{...val,now:+e.target.value}}))}/>
          <div className="sliderHead second"><span>Як я хочу</span><strong>{val.want}</strong></div>
          <input type="range" min="0" max="10" value={val.want} onChange={e=>setMapAnswers(x=>({...x,[key]:{...val,want:+e.target.value}}))}/>
          <div className="sliderEnds"><span>0</span><span>10</span></div>
        </div>
        {mapI===1 && role==="a" && <motion.div className="microReward" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}><Sparkles size={16}/><span>Вже видно, де «як є» найбільше відрізняється від «як хочеться».</span></motion.div>}
        <div className="spacer"/>
        <Button onClick={()=>{
          setMapAnswers(x=>({...x,[key]:val}));
          if(mapI<3){setMapI(mapI+1);return;}
          if(role==="a"){setMapI(0);go("soloResult");}
          else go("mapResult");
        }}>{mapI<3?"Далі":"Побачити результат"}</Button>
      </Fade>
    }

    if(screen==="soloResult") return <Fade>
      <div className="partnerStatus"><span>Для нас</span><b>{entrySolo?"партнер ще не запрошений":"Андрій ще не приєднався"}</b><button>{entrySolo?"Запросити":"Нагадати"}</button></div>
      <div className="eyebrow">ТВОЯ СТОРОНА ГОТОВА</div>
      <h2 className="title">Ось де ти зараз — і де найбільше хочеться інакше.</h2>
      <div className="mySideMap">
        {mapAreas.map((a,i)=><div key={a}>
          <div className="mySideHead"><span>{a}</span><b>{ownMap[i].now} → {ownMap[i].want}</b></div>
          <div className="mySideTrack"><i style={{width:(ownMap[i].now*10)+"%"}}/><em style={{left:(ownMap[i].want*10)+"%"}}/></div>
        </div>)}
      </div>
      <div className="bridgeInsight strongBridge">
        <span>НАЙБІЛЬШЕ «ХОЧУ ІНАКШЕ»</span>
        <b>{gapArea} · {largestGap.now} → {largestGap.want}</b>
        <p>Це не діагноз. Це просто найбільший розрив у твоїх власних відповідях.</p>
      </div>
      <div className="spacer"/><Button onClick={()=>go("soloGap")}>Що з цього реально хвилює зараз?</Button>
      {!entrySolo && <button className="textBtn prototypeLink" onClick={()=>{setRole("b");setMapI(0);go("mapQuestions")}}>Прототип: партнер уже відповів</button>}
    </Fade>;

    if(screen==="soloGap") return <Fade>
      <div className="eyebrow">{hasMap?"ВІД КАРТИ — ДО ЖИТТЯ":"ЩО ВІДБУВАЄТЬСЯ ЗАРАЗ?"}</div>
      <h2 className="title">{hasMap?"Не обов'язково йти в найбільший розрив. Що справді болить зараз?":"Що зараз найбільше схоже на твою ситуацію?"}</h2>
      <p className="lead">{hasMap?"Карта — лише орієнтир. Ти обираєш, з чим працювати сьогодні.":"Це не діагноз і не модуль. Вибір лише допомагає поставити наступне доречне питання."}</p>
      <div className="gapChoiceList">
        {gapOptions.map((x,i)=><button key={x} className={gapChoice===i?"selected":""} onClick={()=>{setGapChoice(i);setInterpretChoice(0);setWanted("");}}><span>{gapChoice===i?<Check size={14}/>:i+1}</span><b>{x}</b></button>)}
      </div>
      <div className="spacer"/><Button onClick={()=>go("soloExample")}>Розібрати один випадок</Button>
    </Fade>;

    if(screen==="soloExample") return <Fade>
      <div className="eyebrow">ОДНА ФРАЗА</div>
      <h2 className="display smallDisplay">Розкажи, що сталося. Решту спробує розкласти Двоє.</h2>
      <p className="lead">Не треба писати красиво або «правильно». Одного-двох речень достатньо.</p>
      <textarea className="soloTextarea smartInput" value={example} onChange={e=>setExample(e.target.value)} placeholder="Наприклад: учора він скасував наші плани, а я сказала, що все нормально."/>
      <div className="smartInputHint"><Sparkles size={15}/><span>Далі ти не заповнюватимеш анкету — лише перевіриш, чи Двоє правильно зрозуміло ситуацію.</span></div>
      <div className="spacer"/><Button disabled={example.trim().length<8} onClick={()=>go("soloParse")}>Розкласти ситуацію</Button>
    </Fade>;

    if(screen==="soloParse") return <Fade>
      <div className="eyebrow">Я ЗРОЗУМІВ ЦЕ ТАК</div>
      <h2 className="title">Поправ мене, якщо центр ситуації інший.</h2>

      <div className="smartParse">
        <div className="parseFact">
          <span>ЩО СТАЛОСЯ</span>
          <p>{example}</p>
          <button onClick={()=>back()}>Змінити фразу</button>
        </div>

        <div className="parseQuestion">
          <span>СХОЖЕ, НАЙВАЖЛИВІШЕ ТУТ</span>
          <div className="parseOptions">
            {interpretations.map((x,i)=><button key={x} className={interpretChoice===i?"selected":""} onClick={()=>setInterpretChoice(i)}><span>{interpretChoice===i?<Check size={13}/>:null}</span><b>{x}</b></button>)}
          </div>
        </div>

        <div className="parseUnknown">
          <span>ЧОГО МИ ПОКИ НЕ ЗНАЄМО</span>
          <p>{unknownByFocus[gapChoice]}</p>
        </div>
      </div>

      <div className="smartTrust"><ShieldCheck size={15}/><p>Це робоче читання однієї ситуації, не висновок про тебе або партнера.</p></div>
      <div className="spacer"/><Button onClick={()=>go("soloNeed")}>Так, йдемо далі</Button>
    </Fade>;

    if(screen==="soloNeed") return <Fade>
      <div className="eyebrow">ОДНЕ УТОЧНЕННЯ</div>
      <h2 className="title">{focusLabel}</h2>
      <div className="contextEcho"><span>ДВОЄ ВРАХОВУЄ</span><b>{interpretedCenter}</b></div>

      {gapChoice===0 && <>
        <label className="soloQuestionLabel"><span>Що ти хотіла б донести однією фразою?</span><textarea className="soloTextarea compact" value={wanted} onChange={e=>setWanted(e.target.value)} placeholder="Наприклад: мені важливо, щоб про зміну наших планів ми домовлялись, а не просто ставили одне одного перед фактом."/></label>
        <div className="fearBlock"><span>ЩО НАЙБІЛЬШЕ ЗУПИНЯЄ?</span><div className="whyList">{whyOptions.map((x,i)=><button key={x} className={why===i?"selected":""} onClick={()=>setWhy(i)}><span>{why===i?<Check size={13}/>:i+1}</span>{x}</button>)}</div></div>
      </>}

      {gapChoice===1 && <div className="quickMeaning">
        <span>ЩО БЛИЖЧЕ?</span>
        {["Сама подія була болючою","Я не знаю, що ця подія означає","Я почала робити висновки про себе або стосунки"].map((x,i)=><button key={x} className={why===i?"selected":""} onClick={()=>setWhy(i)}><span>{why===i?<Check size={13}/>:null}</span>{x}</button>)}
      </div>}

      {gapChoice===4 && <label className="soloQuestionLabel"><span>Якої однієї відповіді тобі бракує?</span><textarea className="soloTextarea compact" value={wanted} onChange={e=>setWanted(e.target.value)} placeholder={unknownByFocus[gapChoice]}/></label>}

      {(gapChoice===2 || gapChoice===3) && <div className="clinicalSignals compactSignals">
        <div><span>Це вже повторювалось?</span><div className="miniSegments">
          <button className={repeats===1?"selected":""} onClick={()=>setRepeats(1)}>Вперше</button>
          <button className={repeats===3?"selected":""} onClick={()=>setRepeats(3)}>2–3 рази</button>
          <button className={repeats===5?"selected":""} onClick={()=>setRepeats(5)}>4+ разів</button>
        </div></div>
        {gapChoice===2 && <div><span>Ви вже говорили саме про це?</span><div className="miniSegments">
          <button className={priorTalks===0?"selected":""} onClick={()=>{setPriorTalks(0);setFailedAgreements(0)}}>Ні</button>
          <button className={priorTalks===1?"selected":""} onClick={()=>setPriorTalks(1)}>1 раз</button>
          <button className={priorTalks===3?"selected":""} onClick={()=>setPriorTalks(3)}>2+ разів</button>
        </div></div>}
        {gapChoice===2 && priorTalks>=1 && <div><span>Були домовленості, які не втримались?</span><div className="miniSegments">
          <button className={failedAgreements===0?"selected":""} onClick={()=>setFailedAgreements(0)}>Ні</button>
          <button className={failedAgreements===1?"selected":""} onClick={()=>setFailedAgreements(1)}>Одна</button>
          <button className={failedAgreements===2?"selected":""} onClick={()=>setFailedAgreements(2)}>2+</button>
        </div></div>}
      </div>}

      <div className="oneSignal">
        <span>Як ти зараз?</span>
        <div className="miniSegments">
          <button className={distress===3?"selected":""} onClick={()=>setDistress(3)}>Можу думати</button>
          <button className={distress===6?"selected":""} onClick={()=>setDistress(6)}>Сильно зачіпає</button>
          <button className={distress===9?"selected":""} onClick={()=>setDistress(9)}>На межі</button>
        </div>
      </div>

      <div className="spacer"/><Button onClick={()=>go("soloObservation")}>Що зараз корисніше?</Button>
    </Fade>;

    if(screen==="soloObservation") return <Fade>
      <div className="eyebrow">ЩО ЗАРАЗ КОРИСНІШЕ</div>
      <h2 className="display smallDisplay">{jobLabel[brain.protocol.job]}</h2>
      <div className="brainRoute human">
        <span>ЧОМУ</span>
        <p>{brain.reason}</p>
      </div>
      <div className="earnedObservation">
        {brain.protocol.job==="SAY" && <><p>Ти вже можеш назвати, чого хочеш. Зараз бар'єр — не в розумінні, а в переході до розмови.</p></>}
        {brain.protocol.job==="UNDERSTAND" && <><p>Поки рано щось пояснювати про тебе або партнера. Спершу треба відділити факт від того значення, яке ця ситуація отримала для тебе.</p></>}
        {brain.protocol.job==="CLARIFY" && <><p>Зараз тебе тримає одна невідома. Якщо її з'ясувати, наступне рішення стане набагато простішим.</p></>}
        {brain.protocol.job==="REGULATE" && <><p>При такій напрузі Двоє не буде штовхати тебе в серйозну розмову або рішення. Спершу повернемо вибір замість імпульсу.</p></>}
        {brain.protocol.job==="CHANGE" && <><p>Цю тему вже не потрібно пояснювати ще красивіше. Тепер важливо подивитися, чи змінюється щось у поведінці або в самому циклі конфлікту.</p></>}
        {brain.protocol.job==="DECIDE" && <><p>Спроб уже достатньо, щоб не запускати ще одну комунікаційну вправу автоматично. Потрібно визначити, яких даних тобі бракує для власного рішення.</p></>}
        {brain.protocol.job==="SAFETY" && <><p>У ситуації є сигнал, через який порада «просто поговоріть» може бути небезпечною або недоречною. Звичайний couple-flow тут зупиняється.</p></>}
      </div>
      <div className="evidenceNote"><Sparkles size={16}/><p><b>{repeats<=1?"Ми спираємось лише на цей випадок.":"Ми врахували повторення, але це все одно робоча версія, а не діагноз."}</b><br/>Результат реальної дії може підтвердити або змінити цей маршрут.</p></div>
      <button className="routeOverride" onClick={()=>go("soloGap")}>Не схоже на мою ситуацію → обрати іншу ціль</button>
      <div className="spacer"/><Button onClick={()=>go("soloMessage")}>Зробити цей крок</Button>
    </Fade>;

    if(screen==="soloMessage") return <Fade>
      <div className="eyebrow">{jobLabel[brain.protocol.job]}</div>

      {brain.protocol.job==="SAY" && <>
        <h2 className="title">Одна ясна думка замість ідеальної розмови.</h2>
        <div className="messageBuild">
          <div><span>ЩО СТАЛОСЯ</span><p>{example}</p></div>
          <div><span>ЩО ТИ ХОЧЕШ ДОНЕСТИ</span><p>{wanted || "Сказати про те, що для тебе важливо."}</p></div>
        </div>
        <div className="messageArtifact">
          <div className="artifactTop"><PenLine size={16}/><span>ЧЕРНЕТКА</span></div>
          <p>«Хочу повернутися до того, що сталося. {wanted || "Для мене це важливо, і я не хочу робити вигляд, що все нормально."} Можемо спокійно обговорити, як діяти далі?»</p>
          <div className="messageBtns"><button><Copy size={14}/>Скопіювати</button><button>Своїми словами</button></div>
        </div>
      </>}

      {brain.protocol.job==="CLARIFY" && <>
        <h2 className="title">Не вирішуємо все. З'ясовуємо одну річ.</h2>
        <div className="brainArtifact"><span>ТОБІ БРАКУЄ ВІДПОВІДІ</span><h3>{wanted || "Що партнер реально готовий обговорювати або змінювати зараз?"}</h3><p>Одна ясна відповідь корисніша за довгу розмову про всі можливі мотиви.</p></div>
        <div className="messageArtifact"><div className="artifactTop"><CircleHelp size={16}/><span>ОДНЕ ПИТАННЯ</span></div><p>«Я хочу зрозуміти одну конкретну річ: {wanted || "ти готовий повернутися до цієї теми й щось у ній змінювати, чи зараз ні?"}»</p></div>
      </>}

      {brain.protocol.job==="UNDERSTAND" && <>
        <h2 className="title">Не шукаємо пояснення партнеру. Спершу наводимо ясність у фактах.</h2>
        <div className="evidenceBoard">
          <div><span>ФАКТ / ПОДІЯ</span><b>{example}</b></div>
          <div><span>ЩО СХОЖЕ ЗАЧІПАЄ</span><b>{wanted || interpretedCenter}</b></div>
          <div><span>ЩО МИ ПОКИ НЕ ЗНАЄМО</span><b>Мотиви партнера та те, чи твоє перше трактування є точним.</b></div>
        </div>
      </>}

      {brain.protocol.job==="REGULATE" && <>
        <h2 className="title">Не треба вирішувати всю проблему на піку.</h2>
        <div className="brainArtifact"><span>ПЛАН НА ЗАРАЗ</span><h3>Не робити незворотний крок, поки тебе «штормить».</h3><p>Вибери конкретну точку повернення до теми: коли відчуєш, що знову можеш думати, а не тільки реагувати.</p></div>
        <div className="protocolWhy"><b>Важливо:</b><p>Пауза тут не означає уникнення. У неї є мета — повернутись до теми в кращому стані.</p></div>
      </>}

      {brain.protocol.job==="CHANGE" && <>
        <h2 className="title">Тепер перевіряємо не слова, а зміну.</h2>
        <div className="evidenceBoard">
          <div><span>ПОВТОРЕННЯ</span><b>{repeats>=5?"4+":repeats}</b></div>
          <div><span>РОЗМОВИ ПРО ЦЕ</span><b>{priorTalks>=3?"2+":priorTalks}</b></div>
          <div><span>НЕВТРИМАНІ ДОМОВЛЕНОСТІ</span><b>{failedAgreements}</b></div>
        </div>
        <div className="brainArtifact"><span>НАСТУПНИЙ КРОК</span><h3>Визнач одну спостережувану зміну.</h3><p>Не «ставитися серйозніше», а поведінку, яку можна побачити й перевірити через кілька днів.</p></div>
      </>}

      {brain.protocol.job==="DECIDE" && <>
        <h2 className="title">Ще один кращий текст не дасть головної інформації.</h2>
        <div className="decisionBoard">
          <div><span>ВЖЕ ВІДОМО</span><p>Тема повторюється й уже була предметом розмов.</p></div>
          <div><span>ВЖЕ ПРОБУВАЛИ</span><p>Були домовленості, але стійкого результату поки недостатньо.</p></div>
          <div><span>ЧОГО БРАКУЄ</span><p>Реальних даних про готовність підтримувати зміну діями, а не тільки словами.</p></div>
        </div>
        <div className="brainArtifact"><span>ТВОЄ ПИТАННЯ</span><h3>Що має реально змінитися, щоб ти сказала: «так, це рух»?</h3><p>Ти вирішуєш сама. Двоє лише допомагає зробити критерії видимими.</p></div>
      </>}

      {brain.protocol.job==="SAFETY" && <>
        <h2 className="title">Звичайна relationship-порада тут не є першим кроком.</h2>
        <div className="safetyArtifact"><ShieldCheck size={22}/><div><b>Не будемо підштовхувати до конфронтації або спільної розмови.</b><p>Якщо є безпосередня небезпека, пріоритет — безпечне місце та доступна людська або екстрена підтримка.</p></div></div>
      </>}

      <div className="spacer"/><Button onClick={()=>go("soloHome")}>{brain.protocol.job==="SAFETY"?"Зберегти безпечний крок":"Зберегти й перевірити в житті"}</Button>
    </Fade>;

    if(screen==="soloHome") return <Fade>
      <div className="soloHomeTop">
        <div><div className="eyebrow">МІЙ БІК</div><h2>Не пам'ять про чат. Пам'ять про те, що сталося.</h2></div>
        {brain.protocol.job!=="SAFETY" && <div className="partnerMini"><i>А</i><span>{entrySolo?"не запрошений":"ще не приєднався"}</span><button>{entrySolo?"Запросити":"Нагадати"}</button></div>}
      </div>

      <div className="evidenceStats">
        <div><b>{Math.max(1,totalCases)}</b><span>ситуацій</span></div>
        <div><b>{checkedOutcomes}</b><span>перевірених outcomes</span></div>
        <div><b>0</b><span>підтверджених патернів</span></div>
      </div>

      <div className="openSituation">
        <span>{followup===null?"ПОТРІБНО ПЕРЕВІРИТИ":"ОСТАННЯ СИТУАЦІЯ"} · {focusLabel}</span>
        <h3>{example.length>72?example.slice(0,72)+"…":example}</h3>
        <p>{followup===null?homeStep[brain.protocol.job].title:"Outcome збережено. Один результат ще не стає закономірністю."}</p>
        {followup===null && brain.protocol.job!=="SAFETY" && <button onClick={()=>go("soloFollowup")}>Що сталося потім? <ArrowRight size={14}/></button>}
      </div>

      <div className="evidenceTimeline">
        <div className="sectionHead"><span>Історія доказів</span><b>{records.length?"оновлюється":"починається зараз"}</b></div>
        {records.slice(-2).reverse().map((r,i)=><div className="timelineItem" key={r.example+r.outcome+i}>
          <i/>
          <div><span>{r.focus}</span><b>{r.example.length>60?r.example.slice(0,60)+"…":r.example}</b><p>{r.outcome}</p></div>
        </div>)}
        <div className="timelineItem current"><i/><div><span>{records.length?"ПОТОЧНИЙ КЕЙС":"ПЕРША ТОЧКА"}</span><b>{focusLabel}</b><p>{followup===null?"Outcome ще не перевірено":"Результат уже додано до історії."}</p></div></div>
      </div>

      {hasMap && <div className="homeSection">
        <div className="sectionHead"><span>Моя сторона</span><b>з твоєї карти</b></div>
        {[largestGap.idx,1,0].filter((v,i,a)=>a.indexOf(v)===i).slice(0,3).map(i=><div className="miniGap" key={i}><span>{mapAreas[i]}</span><b>{ownMap[i].now} → {ownMap[i].want}</b></div>)}
      </div>}

      <div className="hypothesisState">
        <span>ЩО ДВОЄ ВЖЕ МОЖЕ СКАЗАТИ</span>
        <b>{records.length<2?"Поки нічого стабільного — і це нормально.":"Є матеріал для першого порівняння, але ще не для ярлика."}</b>
        <p>{records.length<2?"Потрібні повторні реальні ситуації та outcomes, щоб відрізнити випадковість від того, що справді повторюється.":"Наступні схожі кейси покажуть, чи повторюється механіка, а не просто тема."}</p>
      </div>

      {brain.protocol.job!=="SAFETY" && <Button onClick={()=>{setExample("");setWanted("");setInterpretChoice(0);setRepeats(1);setPriorTalks(0);setFailedAgreements(0);setDistress(3);setFollowup(null);go("soloGap")}}>Розібрати нову ситуацію</Button>}
      {!entrySolo && brain.protocol.job!=="SAFETY" && <button className="textBtn prototypeLink" onClick={()=>{setRole("b");setMapI(0);go("mapQuestions")}}>Прототип: симулювати підключення партнера</button>}
    </Fade>;

    if(screen==="soloFollowup") return <Fade>
      <div className="eyebrow">ПОВЕРНЕННЯ ДО СИТУАЦІЇ</div>
      <h2 className="title">Що сталося після твого кроку?</h2>
      <p className="lead">Саме outcome навчає Двоє. Не «чи правильно ти зробила», а що реально відбулося.</p>
      <div className="followupChoices">
        {(followupOptions[brain.protocol.job]||followupOptions.UNDERSTAND).map((x,i)=><button key={x} className={followup===i?"selected":""} onClick={()=>setFollowup(i)}><span>{followup===i?<Check size={14}/>:i+1}</span><b>{x}</b></button>)}
      </div>
      {followup!==null && <div className="evidenceNote"><Sparkles size={16}/><p><b>Це стане першим outcome для такого типу ситуації.</b><br/>Якщо схоже повториться, Двоє порівняє не тільки історії, а й те, що ти зробила та що сталося потім.</p></div>}
      <div className="spacer"/><Button disabled={followup===null} onClick={()=>{
        const outcome=(followupOptions[brain.protocol.job]||followupOptions.UNDERSTAND)[followup??0];
        setRecords(prev=>prev.some(r=>r.example===example&&r.route===brain.protocol.job)?prev:[...prev,{example,focus:focusLabel,route:brain.protocol.job,outcome}]);
        go("soloHome");
      }}>Зберегти результат</Button>
    </Fade>;

    if(screen==="mapResult") return <Fade>
      <div className="eyebrow">ВАША КАРТА ГОТОВА</div><h2 className="title">Одна пара. Дві різні географії.</h2>
      <Radar/>
      <div className="resultSummary"><div><span>Найбільший збіг</span><b>Цінності</b></div><div><span>Найбільша різниця</span><b>Комунікація</b></div></div>
      <div className="findingsPreview">{findings.map(f=><div key={f.n}><span>{f.n}</span><p><b>{f.t}</b>{f.d}</p></div>)}</div>
      <div className="recommendation"><Sparkles size={18}/><div><span>Рекомендований старт</span><b>Межі у стосунках</b><p>Саме тут у вас найбільше невидимих відмінностей.</p></div></div>
      <Button onClick={()=>go("paywall")}>Відкрити перші 3 питання</Button>
    </Fade>;

    if(screen==="paywall") return <Fade>
      <div className="eyebrow">ПРОДОВЖИТИ ГЛИБШЕ</div><h2 className="title">Карта показала де. Модулі показують — що саме між вами відбувається.</h2>
      <div className="priceStack">
        <button className="priceCard"><span>Одна тема</span><b>390 ₴</b><p>Весь модуль, розбори, домовленості, перевірки</p></button>
        <button className="priceCard recommended"><div className="tag">Рекомендовано</div><span>Усі теми для пари</span><b>1290 ₴</b><p>14 модулів · назавжди · на двох</p></button>
      </div>
      <div className="trialNote"><LockKeyhole size={17}/><span>У прототипі відкриваємо перші 3 питання «Меж» без оплати.</span></div>
      <div className="spacer"/><Button onClick={()=>go("moduleIntro")}>Спробувати 3 питання</Button>
    </Fade>;

    if(screen==="moduleIntro") return <Fade>
      <div className="eyebrow">МОДУЛЬ · МЕЖІ</div><h2 className="display smallDisplay">Не про правила. Про те, де для кожного починається «мені вже не ок».</h2>
      <div className="moduleMeta">
        <div><span>Сьогодні</span><b>3 питання</b></div><div><span>Повний захід</span><b>≈ 25 хв на двох</b></div><div><span>Глибина</span><b>Рівень 1</b></div>
      </div>
      <p className="lead">Ви отримаєте однаковий набір. Відповідайте окремо, без підлаштування. Після здачі відповіді не редагуються.</p>
      <div className="spacer"/><Button onClick={()=>{setRole("a");setModuleI(0);go("moduleQuestions")}}>Почати свій бік</Button>
    </Fade>;

    if(screen==="moduleQuestions"){
      const q=moduleQs[moduleI], key=role+":"+moduleI;
      const current=moduleAnswers[key] ?? (role==="a"?q.a:q.b);
      return <Fade>
        <div className="questionTop"><span>{q.label}</span><b>{moduleI+1} / 3</b></div>
        <h2 className="question">{q.q}</h2>
        <div className="scenarioOptions">{q.opts.map((o,i)=><button key={o} className={current===i?"selected":""} onClick={()=>setModuleAnswers(x=>({...x,[key]:i}))}><span>{String.fromCharCode(65+i)}</span><b>{o}</b></button>)}</div>
        {moduleI===1 && <div className="lockedSignal"><LockKeyhole size={15}/><span>Є потенційна розбіжність. Вона відкриється лише після другого боку.</span></div>}
        <div className="spacer"/><Button onClick={()=>{
          setModuleAnswers(x=>({...x,[key]:current}));
          if(moduleI<2)setModuleI(moduleI+1);
          else if(role==="a"){setRole("b");setModuleI(0);go("moduleWaiting")}
          else {setRevealI(0);go("reveal")}
        }}>{moduleI<2?"Далі":"Здати відповіді"}</Button>
      </Fade>
    }

    if(screen==="moduleWaiting") return <Fade>
      <div className="eyebrow">ЗАХІД · МЕЖІ</div><h2 className="title">Ви — 3/3. Партнер — 1/3.</h2>
      <div className="waitingLenses"><div className="waitLens done"><span>Юлія</span><Check/></div><div className="waitLens"><span>Андрій</span><b>1 / 3</b></div></div>
      <p className="lead">Ваші відповіді вже не можна змінити. Чужих поки не видно взагалі.</p>
      <div className="spacer"/><Button onClick={()=>go("moduleQuestions")}>Симулювати партнера</Button>
    </Fade>;

    if(screen==="reveal"){
      const q=moduleQs[revealI], a=moduleAnswers["a:"+revealI]??q.a, bAns=moduleAnswers["b:"+revealI]??q.b;
      return <Fade>
        <div className="eyebrow">ВІДКРИТТЯ · {revealI+1}/3</div><h2 className="title">Тепер обидві відповіді поруч.</h2>
        <div className="revealQuestion">{q.q}</div>
        <div className="twoAnswers">
          <motion.div className="answerSide a" initial={{x:-30,opacity:0}} animate={{x:0,opacity:1}}><span>Юлія</span><b>{q.opts[a]}</b></motion.div>
          <motion.div className="answerSide b" initial={{x:30,opacity:0}} animate={{x:0,opacity:1}}><span>Андрій</span><b>{q.opts[bAns]}</b></motion.div>
        </div>
        <div className={"delta "+(a===bAns?"match":"diff")}><span>{a===bAns?"Збіг":"Різниця"}</span><b>{a===bAns?"Тут ви читаєте межу однаково":"Тут межа проходить у різних місцях"}</b></div>
        <div className="revealDots">{moduleQs.map((_,i)=><i key={i} className={i===revealI?"active":""}/>)}</div>
        <div className="spacer"/><Button onClick={()=>revealI<2?setRevealI(revealI+1):go("finding")}>{revealI<2?"Наступна відповідь":"Побачити, що це означає"}</Button>
      </Fade>
    }

    if(screen==="finding") return <Fade>
      <div className="eyebrow">ЗНАХІДКА · РІЗНІ МЕЖІ</div><h2 className="display smallDisplay">Для одного «простір» — нормальна автономність. Для іншого — вже сигнал дистанції.</h2>
      <div className="findingStory">
        <div><span>Що побачила система</span><p>У питаннях про доступність і телефон ви поставили межу в різних місцях.</p></div>
        <div className="quote a"><span>Юлія</span>«Я не беру телефон без дозволу»</div>
        <div className="quote b"><span>Андрій</span>«Можу взяти для побутової дрібниці»</div>
      </div>
      <div className="hypothesis"><Sparkles size={17}/><p><b>Гіпотеза для розмови, не діагноз:</b><br/>ви обоє можете вважати себе довірливими — але «довіра» у вас не означає однаковий доступ.</p></div>
      <div className="spacer"/><Button onClick={()=>go("talk")}>Поговорити про це</Button>
    </Fade>;

    if(screen==="talk") return <Fade>
      <div className="eyebrow">РОЗМОВА ВГОЛОС</div><h2 className="title">Не домовляйтесь одразу. Спочатку уточніть значення.</h2>
      <div className="conversationPrompt">«Що для тебе означає довіра, коли мова про особистий простір?»</div>
      <div className="talkRules">
        <div><span>01</span><p>Говоріть від себе: «для мене…»</p></div>
        <div><span>02</span><p>Не спростовуйте чужий досвід</p></div>
        <div><span>03</span><p>Мета — зрозуміти межу, не виграти</p></div>
      </div>
      <button className="timerBtn"><TimerReset size={18}/><span>15:00</span><b>Почати таймер</b></button>
      <div className="spacer"/><Button onClick={()=>go("agreement")}>Ми поговорили</Button>
    </Fade>;

    if(screen==="agreement") return <Fade>
      <div className="eyebrow">ОДНА ДОМОВЛЕНІСТЬ</div><h2 className="title">Що конкретно спробуєте до перевірки?</h2>
      <div className="agreementList">
        {[
          ["Питати перед тим, як брати телефон","Навіть для побутової дрібниці"],
          ["Називати потребу в просторі прямо","«Мені потрібно 40 хвилин на себе»"],
          ["Написати свою домовленість","Сформулювати разом"]
        ].map((a,i)=><button key={i} className={agreement===i?"selected":""} onClick={()=>setAgreement(i)}><span>{agreement===i?<Check size={15}/>:i+1}</span><div><b>{a[0]}</b><p>{a[1]}</p></div></button>)}
      </div>
      <div className="dateRow"><div><span>Відповідальний</span><b>{agreement===0?"Обоє":"Кожен за себе"}</b></div><div><span>Перевірка</span><b>через 12 днів</b></div></div>
      <div className="spacer"/><Button onClick={()=>go("home")}>Зафіксувати</Button>
    </Fade>;

    if(screen==="home") return <Fade>
      <div className="homeHead"><div><div className="eyebrow">ВАШ ПРОСТІР</div><h2>Юлія & Андрій</h2></div><div className="pairAv"><i>Ю</i><i>А</i></div></div>
      <div className="activeExperiment">
        <span>АКТИВНА ДОМОВЛЕНІСТЬ</span><h3>Питати перед тим, як брати телефон</h3>
        <div className="experimentFoot"><div><b>12</b><span>днів до перевірки</span></div><button onClick={()=>go("checkin")}>Перевірити зараз</button></div>
      </div>
      <div className="mapOfUs">
        <div className="sectionHead"><span>Карта нас</span><b>3 знайдені точки</b></div>
        {findings.map((f,i)=><button key={f.n}><span className={i===0?"hot":""}>{f.n}</span><div><b>{f.t}</b><p>{f.d}</p></div><ChevronRight size={17}/></button>)}
      </div>
    </Fade>;

    if(screen==="checkin") return <Fade>
      <div className="eyebrow">12 ДНІВ ПОТОМУ</div><h2 className="title">«Питати перед тим, як брати телефон»</h2>
      <p className="lead">Що сталося з домовленістю?</p>
      <div className="checkChoices">{["Спрацювало","Частково","Не вийшло"].map((c,i)=><button key={c} className={check===i?"selected":""} onClick={()=>setCheck(i)}><span>{check===i?<Check size={15}/>:null}</span><b>{c}</b></button>)}</div>
      <label className="reflection"><span>Що допомогло або заважало?</span><textarea placeholder="Коротко, своїми словами…"/></label>
      <div className="spacer"/><Button onClick={()=>go("home")}>Зберегти check-in</Button>
    </Fade>;

    return null;
  };

  return <Shell step={screen==="landing"?undefined:progress} onBack={history.length?back:undefined} onReset={reset}>
    <AnimatePresence mode="wait">{content()}</AnimatePresence>
  </Shell>
}
