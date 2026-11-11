import React, { useEffect, useMemo, useState } from 'react';
import { generateAssessment } from '../services/api.js';
import {
  Activity, ArrowLeft, ArrowRight, BookOpen, Brain, CalendarDays, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, Code2, Flame, LayoutDashboard, ListChecks,
  Settings, Target, TrendingUp, Trophy, Zap, Flag, Send, RotateCcw
} from 'lucide-react';

const sections = [
  { id:'vocabulary', name:'Vocabulary', count:10, seconds:10*60, icon:BookOpen, tone:'blue', detail:'Synonyms, antonyms and usage' },
  { id:'reasoning', name:'Reasoning', count:10, seconds:15*60, icon:Brain, tone:'green', detail:'Patterns, logic and analytical thinking' },
  { id:'arithmetic', name:'Arithmetic & logical', count:10, seconds:20*60, icon:Target, tone:'amber', detail:'Quantitative aptitude and logic' },
  { id:'coding', name:'Coding challenge', count:1, seconds:30*60, icon:Code2, tone:'violet', detail:'One programming problem' },
];

const bank = {
 vocabulary: [
  ['Choose the synonym of “Abundant”.',['Scarce','Plentiful','Tiny','Empty'],1,'Abundant means available in large quantities; plentiful is its synonym.'],
  ['Choose the antonym of “Reluctant”.',['Unwilling','Hesitant','Willing','Doubtful'],2,'Reluctant means unwilling; willing is the opposite.'],
  ['Choose the correctly spelled word.',['Accomodate','Acommodate','Accommodate','Acomodate'],2,'Accommodate is spelled with double c and double m.'],
  ['“Break the ice” means:', ['End a relationship','Start a friendly conversation','Create a problem','Delay a task'],1,'The idiom means to ease tension and begin social interaction.'],
  ['Choose the synonym of “Brief”.',['Concise','Lengthy','Complex','Vague'],0,'Brief means short or concise.'],
  ['Choose the antonym of “Expand”.',['Extend','Enlarge','Contract','Increase'],2,'Contract means to become smaller, opposite to expand.'],
  ['Fill in the blank: She has been working here ___ 2022.',['for','since','from','by'],1,'Use since with a specific starting point in time.'],
  ['Choose the correct sentence.',['He do not know.','He does not knows.','He does not know.','He not know.'],2,'With he/she/it, use does + base form of the verb.'],
  ['Choose the synonym of “Diligent”.',['Lazy','Careless','Hardworking','Impatient'],2,'Diligent means showing careful and persistent effort.'],
  ['Choose the antonym of “Transparent”.',['Clear','Opaque','Visible','Obvious'],1,'Opaque means not transparent or allowing no light through.']
 ],
 reasoning: [
  ['Find the next number: 2, 6, 12, 20, 30, ?', ['36','40','42','44'],2,'Differences are 4, 6, 8, 10; next difference is 12. Answer: 42.'],
  ['If CAT is coded as DBU, how is DOG coded?', ['EPH','CNE','EOG','FPH'],0,'Each letter is shifted forward by one: D→E, O→P, G→H.'],
  ['Choose the odd one out.',['Square','Triangle','Circle','Cube'],3,'Cube is three-dimensional; the others are two-dimensional shapes.'],
  ['A is the brother of B. B is the sister of C. How is A related to C?', ['Brother','Sister','Father','Cannot determine'],0,'A is male and sibling of B; B and C are siblings, so A is C’s brother.'],
  ['A person walks 5 km north, then 3 km east. In which direction is the person from the start?', ['North-west','South-east','North-east','South-west'],2,'Moving north and then east places the person north-east of the start.'],
  ['Complete the series: AZ, BY, CX, DW, ?', ['EV','FU','EW','EX'],0,'First letters move forward; second letters move backward. Next is EV.'],
  ['If all roses are flowers and some flowers fade quickly, which conclusion must be true?', ['All roses fade quickly','Some roses fade quickly','All roses are flowers','No flowers are roses'],2,'Only the statement that all roses are flowers is guaranteed.'],
  ['Find the missing number: 3, 9, 27, 81, ?', ['162','189','243','324'],2,'Each term is multiplied by 3. 81 × 3 = 243.'],
  ['Which comes next in the letter series: B, E, H, K, ?', ['M','N','O','P'],1,'Letters advance by three positions: B, E, H, K, N.'],
  ['If yesterday was Monday, what day will it be the day after tomorrow?', ['Tuesday','Wednesday','Thursday','Friday'],2,'Yesterday Monday means today Tuesday; day after tomorrow is Thursday.']
 ],
 arithmetic: [
  ['What is 20% of 250?', ['25','40','50','60'],2,'20% = 1/5; 250 ÷ 5 = 50.'],
  ['A product costs ₹800 and is sold for ₹920. Find the profit percentage.', ['10%','12%','15%','20%'],2,'Profit = 120; profit percentage = 120/800 × 100 = 15%.'],
  ['The average of 12, 18, 20 and 10 is:', ['14','15','16','17'],1,'Sum = 60; average = 60 ÷ 4 = 15.'],
  ['If 5 workers finish a job in 12 days, how many days will 10 workers take at the same rate?', ['3','5','6','8'],2,'Total work = 5 × 12 = 60 worker-days; 60 ÷ 10 = 6 days.'],
  ['The ratio 24:36 in simplest form is:', ['2:3','3:2','4:5','6:9'],0,'Divide both terms by 12 to get 2:3.'],
  ['A train travels 180 km in 3 hours. Its average speed is:', ['50 km/h','55 km/h','60 km/h','65 km/h'],2,'Speed = distance ÷ time = 180 ÷ 3 = 60 km/h.'],
  ['A number increased by 25% becomes 100. What was the original number?', ['75','80','85','90'],1,'Original × 1.25 = 100, so original = 80.'],
  ['Simple interest on ₹2,000 at 5% per annum for 2 years is:', ['₹100','₹150','₹200','₹250'],2,'SI = P × R × T / 100 = 2000 × 5 × 2 / 100 = ₹200.'],
  ['If x + 7 = 19, then x equals:', ['10','11','12','13'],2,'Subtract 7 from both sides: x = 12.'],
  ['A bag has 3 red and 2 blue balls. Probability of drawing a blue ball is:', ['1/5','2/5','3/5','1/2'],1,'There are 2 blue balls out of 5 total balls, so probability is 2/5.']
 ]
};

const codingQuestion = {
 title:'Two Sum',
 difficulty:'Easy',
 statement:'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. Assume exactly one solution exists and you may not use the same element twice.',
 input:'nums = [2, 7, 11, 15], target = 9',
 output:'[0, 1]',
 constraints:'2 ≤ nums.length ≤ 10⁴; -10⁹ ≤ nums[i] ≤ 10⁹; exactly one valid answer exists.',
 starter:'#include <bits/stdc++.h>\\nusing namespace std;\\n\\nint main() {\\n    // Write your solution here\\n    return 0;\\n}'
};

function Sidebar({view,onNavigate}) {
 const links=[['dashboard','Dashboard',LayoutDashboard],['test','Daily assessment',ListChecks],['results','Performance',Activity]];
 return <aside className="sidebar">
  <div className="brand"><div className="brand-mark"><Zap size={19} fill="currentColor"/></div><div><strong>PrepMaster</strong><span>AI PLACEMENT PREP</span></div></div>
  <div className="nav-label">WORKSPACE</div>
  {links.map(([id,label,Icon])=><button key={id} className={`nav-item ${view===id?'active':''}`} onClick={()=>onNavigate(id)}><Icon size={18}/>{label}</button>)}
  <div className="nav-label second">PREFERENCES</div><button className="nav-item" onClick={()=>onNavigate('dashboard')}><Settings size={18}/> Settings</button>
  <div className="sidebar-bottom"><div className="help-icon"><CircleHelp size={18}/></div><div><strong>Need a hand?</strong><span>Assessment guide</span></div></div>
 </aside>;
}

function formatTime(value){const m=Math.floor(value/60).toString().padStart(2,'0');const s=(value%60).toString().padStart(2,'0');return `${m}:${s}`;}

export default function App(){
 const [view,setView]=useState('dashboard');
 const [activeSection,setActiveSection]=useState(0);
 const [questionIndex,setQuestionIndex]=useState(0);
 const [answers,setAnswers]=useState({});
 const [marked,setMarked]=useState({});
 const [code,setCode]=useState(codingQuestion.starter);
 const [remaining,setRemaining]=useState(sections.map(s=>s.seconds));
 const [started,setStarted]=useState(false);
 const [submitted,setSubmitted]=useState(false);
 const [sectionDone,setSectionDone]=useState({});
 const [startedAt,setStartedAt]=useState(null);
 const [questionSets,setQuestionSets]=useState(bank);
 const [codingTask,setCodingTask]=useState(codingQuestion);
 const [preparedAssessment,setPreparedAssessment]=useState(null);
 const [aiStatus,setAiStatus]=useState('Preparing fresh AI questions...');

 const current=sections[activeSection];
 const questions=current.id==='coding'?[codingTask]:questionSets[current.id];
 const answerKey=`${current.id}-${questionIndex}`;
 const answeredCount=Object.keys(answers).length;
 const total=31;
 const sectionAnswers=questions.length;
 const currentAnswer=answers[answerKey];

 useEffect(()=>{
  let cancelled=false;
  generateAssessment('medium').then(data=>{
   if(cancelled) return;
   const toRows=items=>items.map(q=>[q.prompt,q.options,q.correctAnswerIndex,q.explanation,q.topic]);
   setPreparedAssessment({
    questionSets:{vocabulary:toRows(data.vocabulary),reasoning:toRows(data.reasoning),arithmetic:toRows(data.arithmetic)},
    coding:{...data.coding}
   });
   setAiStatus('Fresh Gemini assessment is ready.');
  }).catch(error=>{
   if(!cancelled) setAiStatus('Gemini unavailable — a local backup test is ready. ' + error.message);
  });
  return ()=>{cancelled=true;};
 },[]);

 useEffect(()=>{
  if(!started || submitted || remaining[activeSection] <= 0) return;
  const timer = setInterval(() => {
   setRemaining(prev => prev.map((value, index) =>
    index === activeSection ? Math.max(0, value - 1) : value
   ));
  }, 1000);
  return () => clearInterval(timer);
 },[started,submitted,activeSection]);

 useEffect(()=>{
  if(!started || submitted || remaining[activeSection] > 0) return;
  setSectionDone(prev => ({ ...prev, [current.id]: true }));
  if(activeSection === sections.length - 1){
   finishTest();
  } else {
   setActiveSection(index => index + 1);
   setQuestionIndex(0);
  }
 },[remaining,activeSection,started,submitted,current.id]);

 const score=useMemo(()=>{
  let correct=0,attempted=0;
  Object.entries(answers).forEach(([key,val])=>{
   if(key.startsWith('coding-')) return;
   attempted++;
   const [sectionId,indexText]=key.split('-');
   const questionSet=questionSets[sectionId];
   if(questionSet?.[Number(indexText)]?.[2]===val) correct++;
  });
  return {correct,attempted,marks:correct};
 },[answers,questionSets]);

 function startTest(){
  // Start immediately with the bundled question bank. AI generation must never block an exam.
  const nextCodingTask=preparedAssessment?.coding || codingQuestion;
  if(preparedAssessment){
   setQuestionSets(preparedAssessment.questionSets);
   setCodingTask(preparedAssessment.coding);
   setPreparedAssessment(null);
   setAiStatus('Using your freshly generated Gemini assessment.');
  } else {
   setQuestionSets(bank);
   setCodingTask(codingQuestion);
  }
  setAnswers({});setMarked({});setCode(nextCodingTask.starter);
  setRemaining(sections.map(s=>s.seconds));setActiveSection(0);setQuestionIndex(0);setSectionDone({});
  setSubmitted(false);setStarted(true);setView('test');setStartedAt(Date.now());
 }
 function choose(value){setAnswers(prev=>({...prev,[answerKey]:value}));}
 function toggleMark(){setMarked(prev=>({...prev,[answerKey]:!prev[answerKey]}));}
 function advanceSection(auto=false){
  setSectionDone(prev=>({...prev,[current.id]:true}));
  if(activeSection===sections.length-1){finishTest();return;}
  setActiveSection(prev=>prev+1);setQuestionIndex(0);
 }
 function finishTest(){setSubmitted(true);setStarted(false);setView('results');}
 function submitConfirm(){if(window.confirm('Submit the test now? You cannot change answers after submission.'))finishTest();}
 function resetTest(){setAnswers({});setMarked({});setCode(codingTask.starter);setRemaining(sections.map(s=>s.seconds));setActiveSection(0);setQuestionIndex(0);setSectionDone({});setSubmitted(false);setStarted(false);setView('dashboard');}
 function selectQuestion(i){setQuestionIndex(i);}
 const sectionProgress=questions.length?questions.filter((_,i)=>answers[`${current.id}-${i}`]!==undefined).length:0;

 return <div className="app-shell">
  <Sidebar view={view} onNavigate={id=>{if(id==='test'&&started)setView('test');else if(id==='dashboard')setView('dashboard');else if(id==='results'&&submitted)setView('results');}}/>
  <main className="main-content">
   <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>{view==='dashboard'?'Dashboard':view==='test'?'Daily assessment':'Results'}</strong></div><div className="top-actions"><div className="today-chip"><CalendarDays size={15}/> Daily practice</div><div className="avatar">S</div><div className="profile-name"><strong>My workspace</strong><span>Personal account</span></div><ChevronDown size={16} className="muted-icon"/></div></header>
   {view==='dashboard'&&<div className="page-wrap">
    <section className="welcome-row"><div><div className="eyebrow">DAILY PLACEMENT PRACTICE</div><h1>Good morning. Ready to improve?</h1><p>Your daily placement practice is ready when you are. One focused session at a time.</p><p className="ai-status">{aiStatus}</p></div><div className="streak-pill"><Flame size={17}/><strong>Build your streak</strong><span>Start today</span></div></section>
    <section className="hero-card"><div className="hero-content"><div className="live-label"><span className="live-dot"/> DAILY ASSESSMENT</div><h2>Today's placement test</h2><p>Four focused sections. One complete picture of your preparation.</p><div className="hero-stats"><div><strong>31</strong><span>Total questions</span></div><div><strong>75 min</strong><span>Estimated duration</span></div><div><strong>50</strong><span>Maximum marks</span></div></div><button className="primary-button" onClick={startTest}>Start today's test <ArrowRight size={17}/></button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="paper-card"><div className="paper-top"><span/><span/><span/></div><div className="paper-line wide"/><div className="paper-line"/><div className="paper-option selected"><CheckCircle2 size={14}/> Answer selected</div><div className="paper-line short"/><div className="paper-option"><span className="empty-circle"/> Next question</div></div><div className="floating-score"><Trophy size={17}/><div><strong>50 marks</strong><span>Available today</span></div></div></div></section>
    <section className="section-heading"><div><div className="eyebrow">YOUR TEST BREAKDOWN</div><h2>Four sections. One daily goal.</h2></div><span className="total-tag">31 questions total</span></section>
    <section className="section-list">{sections.map(s=><div className="section-card" key={s.id}><div className={`section-icon ${s.tone}`}><s.icon size={19}/></div><div className="section-copy"><strong>{s.name}</strong><span>{s.detail}</span></div><div className="section-meta"><strong>{s.count}</strong><span>questions</span></div><div className="section-time"><Clock3 size={14}/>{Math.round(s.seconds/60)} min</div></div>)}</section>
    <section className="lower-grid"><div className="panel progress-panel"><div className="panel-heading"><div><h3>Preparation overview</h3><p>Your progress will appear here after your first test.</p></div><TrendingUp size={19}/></div><div className="empty-state"><div className="empty-icon"><Activity size={22}/></div><strong>Your progress starts with one test</strong><span>Complete today's assessment to unlock scores, accuracy and topic-level insights.</span></div></div><div className="panel adaptive-panel"><div className="adaptive-icon"><Brain size={20}/></div><div className="eyebrow">ADAPTIVE PRACTICE</div><h3>Questions that grow with you.</h3><p>Gemini prepares fresh questions for vocabulary, reasoning, arithmetic and coding in the background. A local backup is available if AI is unavailable.</p><div className="difficulty-track"><span className="easy">Easy</span><i/><span className="medium">Medium</span><i/><span className="hard">Hard</span></div></div></section>
    <footer className="footer"><span>© 2026 PrepMaster AI</span><span>Phase 2 · Examination engine preview</span></footer>
   </div>}
   {view==='test'&&started&&!submitted&&<div className="exam-wrap">
    <div className="exam-top"><div><div className="eyebrow">DAILY PLACEMENT ASSESSMENT</div><h1>{current.name}</h1><p>Section {activeSection+1} of 4 · {current.count} questions</p></div><div className={`timer-box ${remaining[activeSection]<60?'urgent':''}`}><Clock3 size={18}/><div><span>TIME LEFT</span><strong>{formatTime(remaining[activeSection])}</strong></div></div></div>
    <div className="exam-progress"><div className="progress-label"><span>Overall test progress</span><strong>{answeredCount}/{total} answered</strong></div><div className="progress-track"><i style={{width:`${answeredCount/total*100}%`}}/></div></div>
    <div className="exam-layout">
     <section className="question-panel">
      <div className="question-head"><span className="question-number">QUESTION {questionIndex+1} <i>/ {questions.length}</i></span><button className={`review-button ${marked[answerKey]?'marked':''}`} onClick={toggleMark}><Flag size={15}/>{marked[answerKey]?'Marked for review':'Mark for review'}</button></div>
      {current.id==='coding'?<div className="coding-content"><div className="coding-title"><span className="difficulty-chip">EASY</span><h2>{codingTask.title}</h2></div><p>{codingTask.statement}</p><h4>Example</h4><pre>Input: {codingTask.input}{'\\n'}Output: {codingTask.output}</pre><h4>Constraints</h4><p>{codingTask.constraints}</p><label className="editor-label">Your C++ solution</label><textarea className="code-editor" spellCheck="false" value={code} onChange={e=>setCode(e.target.value)}/><p className="editor-note">Code execution and hidden test-case grading will be added in a later phase. Your code is saved in this test session.</p></div>
      :<><h2 className="question-text">{questions[questionIndex][0]}</h2><div className="options-list">{questions[questionIndex][1].map((option,i)=><button key={i} className={`option-button ${currentAnswer===i?'selected':''}`} onClick={()=>choose(i)}><span className="option-letter">{String.fromCharCode(65+i)}</span><span>{option}</span>{currentAnswer===i&&<CheckCircle2 size={17}/>}</button>)}</div></>}
      <div className="question-actions"><button className="secondary-button" disabled={questionIndex===0} onClick={()=>setQuestionIndex(i=>i-1)}><ArrowLeft size={15}/> Previous</button><div className="right-actions">{questionIndex<questions.length-1?<button className="primary-blue-button" onClick={()=>setQuestionIndex(i=>i+1)}>Save & next <ArrowRight size={15}/></button>:<button className="primary-blue-button" onClick={()=>advanceSection()}>{activeSection===3?'Finish test':'Submit section'} <ArrowRight size={15}/></button>}</div></div>
     </section>
     <aside className="question-nav panel"><div className="nav-panel-title"><strong>Question palette</strong><span>{sectionProgress}/{questions.length} answered</span></div><div className="question-grid">{questions.map((_,i)=><button key={i} className={`q-number ${questionIndex===i?'current':''} ${answers[`${current.id}-${i}`]!==undefined?'answered':''} ${marked[`${current.id}-${i}`]?'flagged':''}`} onClick={()=>selectQuestion(i)}>{i+1}</button>)}</div><div className="legend"><span><i className="legend-current"/>Current</span><span><i className="legend-answered"/>Answered</span><span><i className="legend-flagged"/>Review</span></div><div className="section-switch"><strong>Sections</strong>{sections.map((s,i)=><div key={s.id} className={`switch-row ${i===activeSection?'active':''} ${sectionDone[s.id]?'done':''}`}><span>{i+1}. {s.name}</span><small>{sectionDone[s.id]?'Completed':i<activeSection?'Submitted':`${Math.round(s.seconds/60)} min`}</small></div>)}</div><button className="submit-test-button" onClick={submitConfirm}><Send size={15}/> Submit entire test</button></aside>
    </div>
   </div>}
   {view==='results'&&submitted&&<div className="page-wrap results-wrap"><div className="eyebrow">ASSESSMENT COMPLETE</div><h1>Your test summary</h1><p className="results-subtitle">Here is your performance for this practice session.</p><div className="result-hero"><div><span>MCQ SCORE</span><strong>{score.marks}<i>/30</i></strong><small>{score.correct} correct · {score.attempted-score.correct} incorrect · {30-score.attempted} unattempted</small></div><div className="result-medal"><Trophy size={32}/></div></div><div className="result-cards"><div className="panel"><span>MCQ ACCURACY</span><strong>{score.attempted?Math.round(score.correct/score.attempted*100):0}%</strong></div><div className="panel"><span>ATTEMPTED</span><strong>{score.attempted}/30</strong></div><div className="panel"><span>CODING</span><strong>{code.trim()===codingTask.starter.trim()?'Not attempted':'Submitted'}</strong></div></div><div className="panel result-detail"><h3>Section breakdown</h3>{sections.map(s=><div className="result-row" key={s.id}><span>{s.name}</span><strong>{s.id==='coding'?(code.trim()===codingTask.starter.trim()?'Not submitted':'Pending evaluation'):`${questionSets[s.id].filter((q,i)=>answers[`${s.id}-${i}`]===q[2]).length}/${s.count} correct`}</strong></div>)}</div><div className="results-actions"><button className="primary-blue-button" onClick={resetTest}><RotateCcw size={15}/> Back to dashboard</button></div><section className="panel answer-review"><h3>Answer explanations</h3><p>Review your answers and explanations after completing the test.</p>{sections.filter(s=>s.id!=='coding').map(s=>{const rows=questionSets[s.id];return <div className="review-section" key={s.id}><h4>{s.name}</h4>{rows.map((q,i)=>{const selected=answers[`${s.id}-${i}`];return <details className="review-item" key={`${s.id}-${i}`}><summary>Q{i+1}. {q[0]}</summary><div className="review-answer"><span>Your answer: {selected===undefined?'Not attempted':q[1][selected]}</span><strong>Correct answer: {q[1][q[2]]}</strong><p>{q[3]}</p>{q[4]&&<small>Topic: {q[4]}</small>}</div></details>;})}</div>;})}</section></div>}
  </main>
 </div>;
}
