import React from 'react';
import {
  Activity, ArrowRight, BookOpen, Brain, CalendarDays, CheckCircle2,
  ChevronDown, CircleHelp, Clock3, Code2, Flame, LayoutDashboard,
  ListChecks, Settings, Target, TrendingUp, Trophy, Zap
} from 'lucide-react';

const sections = [
  { name: 'Vocabulary', count: 10, time: '10 min', icon: BookOpen, tone: 'blue', detail: 'Synonyms, antonyms, idioms and grammar' },
  { name: 'Reasoning', count: 10, time: '15 min', icon: Brain, tone: 'green', detail: 'Series, logic, directions and relations' },
  { name: 'Arithmetic & logical', count: 10, time: '20 min', icon: Target, tone: 'amber', detail: 'Percentages, ratios, averages and more' },
  { name: 'Coding challenge', count: 1, time: '30 min', icon: Code2, tone: 'violet', detail: 'One programming problem with test cases' },
];

function Sidebar() {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><Zap size={19} fill="currentColor" /></div><div><strong>PrepMaster</strong><span>AI PLACEMENT PREP</span></div></div>
    <div className="nav-label">WORKSPACE</div>
    <a className="nav-item active"><LayoutDashboard size={18}/> Dashboard</a>
    <a className="nav-item"><ListChecks size={18}/> Daily assessment</a>
    <a className="nav-item"><Activity size={18}/> Performance</a>
    <a className="nav-item"><CalendarDays size={18}/> Test history</a>
    <div className="nav-label second">PREFERENCES</div>
    <a className="nav-item"><Settings size={18}/> Settings</a>
    <div className="sidebar-bottom"><div className="help-icon"><CircleHelp size={18}/></div><div><strong>Need a hand?</strong><span>Assessment guide</span></div><ArrowRight size={16} className="help-arrow"/></div>
  </aside>;
}

function SectionCard({ section }) {
  const Icon = section.icon;
  return <div className="section-card">
    <div className={`section-icon ${section.tone}`}><Icon size={19}/></div>
    <div className="section-copy"><strong>{section.name}</strong><span>{section.detail}</span></div>
    <div className="section-meta"><strong>{section.count}</strong><span>questions</span></div>
    <div className="section-time"><Clock3 size={14}/>{section.time}</div>
  </div>;
}

export default function App() {
  const totalQuestions = sections.reduce((sum, item) => sum + item.count, 0);
  return <div className="app-shell">
    <Sidebar />
    <main className="main-content">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Dashboard</strong></div><div className="top-actions"><div className="today-chip"><CalendarDays size={15}/> Daily practice</div><div className="avatar">S</div><div className="profile-name"><strong>My workspace</strong><span>Personal account</span></div><ChevronDown size={16} className="muted-icon"/></div></header>
      <div className="page-wrap">
        <section className="welcome-row"><div><div className="eyebrow">WEDNESDAY, NOVEMBER 11, 2026</div><h1>Good morning. Ready to improve?</h1><p>Your daily placement practice is ready when you are. One focused session at a time.</p></div><div className="streak-pill"><Flame size={17}/><strong>Build your streak</strong><span>Start today</span></div></section>

        <section className="hero-card"><div className="hero-content"><div className="live-label"><span className="live-dot"/> DAILY ASSESSMENT</div><h2>Today's placement test</h2><p>Four focused sections. One complete picture of your preparation.</p><div className="hero-stats"><div><strong>{totalQuestions}</strong><span>Total questions</span></div><div><strong>75 min</strong><span>Estimated duration</span></div><div><strong>50</strong><span>Maximum marks</span></div></div><button className="primary-button" onClick={() => alert('The assessment engine is coming in Phase 2. The dashboard foundation is ready!')}>Start today's test <ArrowRight size={17}/></button></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="paper-card"><div className="paper-top"><span/><span/><span/></div><div className="paper-line wide"/><div className="paper-line"/><div className="paper-option selected"><CheckCircle2 size={14}/> Answer selected</div><div className="paper-line short"/><div className="paper-option"><span className="empty-circle"/> Next question</div></div><div className="floating-score"><Trophy size={17}/><div><strong>50 marks</strong><span>Available today</span></div></div></div></section>

        <section className="section-heading"><div><div className="eyebrow">YOUR TEST BREAKDOWN</div><h2>Four sections. One daily goal.</h2></div><span className="total-tag">{totalQuestions} questions total</span></section>
        <section className="section-list">{sections.map(section => <SectionCard key={section.name} section={section}/>)}</section>

        <section className="lower-grid"><div className="panel progress-panel"><div className="panel-heading"><div><h3>Preparation overview</h3><p>Your progress will appear here after your first test.</p></div><TrendingUp size={19}/></div><div className="empty-state"><div className="empty-icon"><Activity size={22}/></div><strong>Your progress starts with one test</strong><span>Complete today's assessment to unlock scores, accuracy and topic-level insights.</span></div></div><div className="panel adaptive-panel"><div className="adaptive-icon"><Brain size={20}/></div><div className="eyebrow">ADAPTIVE PRACTICE</div><h3>Questions that grow with you.</h3><p>The difficulty will adjust based on your previous performance, moving from easy to medium and then hard as your accuracy improves.</p><div className="difficulty-track"><span className="easy">Easy</span><i/><span className="medium">Medium</span><i/><span className="hard">Hard</span></div></div></section>
        <footer className="footer"><span>© 2026 PrepMaster AI</span><span>Built for consistent progress <span className="footer-dot">•</span> Phase 1 preview</span></footer>
      </div>
    </main>
  </div>;
}
