import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Timer, Play, Pause, RotateCcw, CheckCircle2, Trash2,
  BookOpen, Briefcase, Moon, Dumbbell, Car, MoreHorizontal,
  Clock, TrendingUp, LayoutGrid, CalendarDays, ListChecks, Settings,
  Coffee,
} from 'lucide-react';
import './PromoTodo.css';
import { getTimeActivities } from '../../api/time/timeActivityApi';
import { getPromoSessions, createPromoSession, deletePromoSession, savePromoProgress } from '../../api/time/promoSessionApi';

const C = { indigo: '#343090', violet: '#5f59f7', blue: '#6592fd', sky: '#44c2fd', purple: '#8c61ff' };

const CATEGORIES = [
  { key: 'study',    label: 'Study',            icon: <BookOpen size={15} />,       color: C.violet },
  { key: 'work',     label: 'Work',             icon: <Briefcase size={15} />,      color: C.blue   },
  { key: 'sleep',    label: 'Sleep',            icon: <Moon size={15} />,           color: C.indigo },
  { key: 'exercise', label: 'Exercise',         icon: <Dumbbell size={15} />,       color: C.sky    },
  { key: 'travel',   label: 'Travel',           icon: <Car size={15} />,            color: C.purple },
  { key: 'other',    label: 'Other Activities', icon: <MoreHorizontal size={15} />, color: '#7c6fcd' },
];
const CAT_MAP = Object.fromEntries(CATEGORIES.map(c => [c.key, c]));

const todayISO = new Date().toISOString().split('T')[0];
const todayDow = new Date().getDay();

function isScheduledToday(act) {
  if (act.repeat === 'daily')    return true;
  if (act.repeat === 'weekdays') return todayDow >= 1 && todayDow <= 5;
  if (act.repeat === 'weekends') return todayDow === 0 || todayDow === 6;
  if (act.repeat === 'weekly')   return act.repeatDay === todayDow;
  if (act.repeat === 'monthly')  return act.repeatDate === new Date().getDate();
  if (act.repeat === 'custom')   return (act.customDays || []).includes(todayDow);
  if (act.repeat === 'none')     return act.startDate === todayISO;
  return false;
}

const fmtTime = (secs) => {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return h > 0
    ? `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
    : `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
};

const fmtDur = (secs) => {
  if (!secs || secs <= 0) return '0m';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h > 0 && m > 0) return `${h}h ${m}m`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}m`;
  return `${secs}s`;
};

function ViewNav() {
  const navigate = useNavigate();
  const views = [
    { key: 'overview',  label: 'Overview',   path: '/dashboard/time',           icon: <LayoutGrid size={13} /> },
    { key: 'daily',     label: 'Daily',      path: '/dashboard/time/daily',     icon: <CalendarDays size={13} /> },
    { key: 'weekly',    label: 'Weekly',     path: '/dashboard/time/weekly',    icon: <TrendingUp size={13} /> },
    { key: 'monthly',   label: 'Monthly',    path: '/dashboard/time/monthly',   icon: <Clock size={13} /> },
    { key: 'promotodo', label: 'Promo Todo', path: '/dashboard/time/promotodo', icon: <Timer size={13} /> },
  ];
  return (
    <div className="tb-viewnav">
      {views.map(v => (
        <button
          key={v.key}
          className={`tb-viewnav-btn ${location.pathname === v.path ? 'active' : ''}`}
          onClick={() => navigate(v.path)}
        >
          {v.icon}{v.label}
        </button>
      ))}
    </div>
  );
}

// phase: 'study' | 'break'
export default function PromoTodo() {
  const [todayActs, setTodayActs] = useState([]);
  const [selectedAct, setSelectedAct] = useState(null);

  // pomodoro config
  const [pomodoroMode, setPomodoroMode]     = useState(false);
  const [studyMins,    setStudyMins]        = useState(25);
  const [breakMins,    setBreakMins]        = useState(5);
  const [totalSessions, setTotalSessions]  = useState(4);
  const [showConfig,   setShowConfig]       = useState(false);

  // timer state
  const [phase,        setPhase]       = useState('study'); // 'study' | 'break'
  const [remaining,    setRemaining]   = useState(0);
  const [timerSecs,    setTimerSecs]   = useState(0);  // total for current phase
  const [running,      setRunning]     = useState(false);
  const [finished,     setFinished]    = useState(false);
  const [activeCat,    setActiveCat]   = useState('study');
  const [activeLabel,  setActiveLabel] = useState('');
  const [activeSetSecs, setActiveSetSecs] = useState(0);
  const [currentSession, setCurrentSession] = useState(1); // which pomodoro session
  const [studyElapsed, setStudyElapsed] = useState(0); // accumulated study seconds this run

  // per-activity remaining tracking: { [actId]: remainingSecs }
  const [actProgress, setActProgress] = useState({});

  // logged sessions (completed logs only)
  const [sessions, setSessions] = useState([]);

  const intervalRef = useRef(null);

  useEffect(() => {
    getTimeActivities()
      .then(r => setTodayActs(r.data.data.map(a => ({ ...a, id: a._id })).filter(isScheduledToday)))
      .catch(() => {});
    getPromoSessions()
      .then(r => {
        const all = r.data.data.map(s => ({
          ...s,
          id: s._id,
          date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        }));
        // separate progress records (seconds===0, remainingSecs!=null) from real logs
        const progress = {};
        const logs = [];
        all.forEach(s => {
          if (s.remainingSecs !== null && s.remainingSecs !== undefined && s.seconds === 0) {
            progress[s.actId] = s.remainingSecs;
          } else {
            logs.push(s);
          }
        });
        setActProgress(progress);
        setSessions(logs);
      })
      .catch(() => {});
  }, []);

  // countdown tick
  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining(r => {
          if (r <= 1) {
            clearInterval(intervalRef.current);
            setRunning(false);
            setFinished(true);
            return 0;
          }
          // accumulate study elapsed
          if (phase === 'study') setStudyElapsed(e => e + 1);
          return r - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, phase]);

  const timerActive = timerSecs > 0;
  const progress = timerSecs > 0 ? ((timerSecs - remaining) / timerSecs) * 100 : 0;
  const cat = CAT_MAP[activeCat] || CATEGORIES[0];

  const handleSelectActivity = (act) => {
    if (running || (timerSecs > 0 && !finished)) return;
    setSelectedAct(act);
  };

  const handleStart = () => {
    if (!selectedAct) return;
    const setSecs = selectedAct.hours * 3600 + selectedAct.minutes * 60;
    if (setSecs <= 0) return;

    setActiveCat(selectedAct.category);
    setActiveLabel(selectedAct.name);
    setActiveSetSecs(setSecs);
    setFinished(false);
    setStudyElapsed(0);
    setCurrentSession(1);
    setPhase('study');

    if (pomodoroMode) {
      // check if there's saved remaining for this activity
      const savedRemaining = actProgress[selectedAct.id];
      const studySecs = studyMins * 60;
      // if saved remaining exists and is less than full study block, resume from there
      const startSecs = (savedRemaining !== undefined && savedRemaining < studySecs && savedRemaining > 0)
        ? savedRemaining
        : studySecs;
      setTimerSecs(studySecs);
      setRemaining(startSecs);
    } else {
      const savedRemaining = actProgress[selectedAct.id];
      const startSecs = (savedRemaining !== undefined && savedRemaining > 0 && savedRemaining < setSecs)
        ? savedRemaining
        : setSecs;
      setTimerSecs(setSecs);
      setRemaining(startSecs);
    }
    setRunning(true);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    // save remaining progress to backend
    if (selectedAct) {
      savePromoProgress({
        actId: selectedAct.id,
        remainingSecs: remaining,
        setSecs: activeSetSecs,
        category: activeCat,
        label: activeLabel,
      }).then(r => {
        const rem = r.data.data.remainingSecs;
        setActProgress(prev => ({ ...prev, [selectedAct.id]: rem }));
      }).catch(() => {});
    }
  };

  const handleResume = () => setRunning(true);

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setFinished(false);
    setRemaining(0);
    setTimerSecs(0);
    setActiveSetSecs(0);
    setStudyElapsed(0);
    setCurrentSession(1);
    setPhase('study');
  };

  // when a pomodoro study phase finishes → move to break
  const handleStartBreak = () => {
    const bSecs = breakMins * 60;
    setPhase('break');
    setTimerSecs(bSecs);
    setRemaining(bSecs);
    setFinished(false);
    setRunning(true);
  };

  // when break finishes → next study session
  const handleNextSession = () => {
    if (currentSession >= totalSessions) {
      // all sessions done
      setFinished(true);
      setRunning(false);
      return;
    }
    setCurrentSession(s => s + 1);
    setPhase('study');
    const studySecs = studyMins * 60;
    setTimerSecs(studySecs);
    setRemaining(studySecs);
    setFinished(false);
    setRunning(true);
  };

  const handleLog = async () => {
    // only log actual study time completed
    const elapsed = phase === 'study' ? (timerSecs - remaining) : studyElapsed;
    if (elapsed <= 0) return;
    const payload = {
      actId:    selectedAct?.id ?? null,
      category: activeCat,
      label:    activeLabel,
      setSecs:  activeSetSecs,
      seconds:  elapsed,
      pomodoroMode,
      studyMins,
      breakMins,
      totalSessions,
      completedSessions: currentSession,
      remainingSecs: null,
    };
    try {
      const r = await createPromoSession(payload);
      const s = r.data.data;
      setSessions(prev => [{
        ...s,
        id: s._id,
        date: new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      }, ...prev]);
      // clear saved progress for this activity since we logged it
      if (selectedAct) {
        setActProgress(prev => { const n = { ...prev }; delete n[selectedAct.id]; return n; });
        savePromoProgress({ actId: selectedAct.id, remainingSecs: 0, setSecs: activeSetSecs, category: activeCat, label: activeLabel }).catch(() => {});
      }
    } catch {}
    handleReset();
  };

  // Time Accumulated: only sum seconds from real logged sessions (not progress records)
  // planned = sum of setSecs per category; actual = sum of seconds logged
  const totals = CATEGORIES.map(c => {
    const catSessions = sessions.filter(s => s.category === c.key);
    const actual  = catSessions.reduce((sum, s) => sum + (s.seconds || 0), 0);
    const planned = catSessions.reduce((sum, s) => sum + (s.setSecs  || 0), 0);
    return { ...c, actual, planned };
  }).filter(c => c.actual > 0);

  const grandTotal = sessions.reduce((sum, s) => sum + (s.seconds || 0), 0);

  // categories that have at least one session logged
  const loggedCats = CATEGORIES.filter(c => sessions.some(s => s.category === c.key));
  const [expandedCats, setExpandedCats] = useState(() => Object.fromEntries(CATEGORIES.map(c => [c.key, true])));
  const toggleCat = (key) => setExpandedCats(prev => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="tb-page">
      <div className="tb-header-band">
        <div className="tb-header-left">
          <Timer size={22} />
          <div>
            <h2>Promo Todo Timer</h2>
            <span className="tb-date">Pick a task → run the timer → see actual vs planned time</span>
          </div>
        </div>
        <div className="tb-strip">
          <div className="tb-stat-block">
            <span className="tb-stat-label">Time Accumulated</span>
            <span className="tb-stat-value">{fmtDur(grandTotal)}</span>
          </div>
          <div className="tb-strip-div" />
          <div className="tb-stat-block">
            <span className="tb-stat-label">Sessions</span>
            <span className="tb-stat-value">{sessions.length}</span>
          </div>
        </div>
      </div>

      <ViewNav />

      <div className="pt-layout">
        {/* LEFT */}
        <div className="pt-left">

          {/* Pomodoro Config */}
          <div className="tb-card pt-config-card">
            <div className="tb-card-header" style={{ cursor: 'pointer' }} onClick={() => setShowConfig(v => !v)}>
              <Settings size={16} style={{ color: C.violet }} />
              <h3>Pomodoro Settings</h3>
              <label className="pt-toggle" onClick={e => e.stopPropagation()}>
                <input type="checkbox" checked={pomodoroMode} onChange={e => setPomodoroMode(e.target.checked)} />
                <span className="pt-toggle-slider" />
              </label>
              <span className="pt-config-arrow">{showConfig ? '▲' : '▼'}</span>
            </div>
            {showConfig && (
              <div className="pt-config-body">
                <div className="pt-config-row">
                  <label>Study (min)</label>
                  <input type="number" min={1} max={120} value={studyMins}
                    onChange={e => setStudyMins(Math.max(1, +e.target.value))} />
                </div>
                <div className="pt-config-row">
                  <label>Break (min)</label>
                  <input type="number" min={1} max={60} value={breakMins}
                    onChange={e => setBreakMins(Math.max(1, +e.target.value))} />
                </div>
                <div className="pt-config-row">
                  <label>Sessions</label>
                  <input type="number" min={1} max={20} value={totalSessions}
                    onChange={e => setTotalSessions(Math.max(1, +e.target.value))} />
                </div>
                {pomodoroMode && (
                  <div className="pt-config-preview">
                    {studyMins}m study × {totalSessions} sessions + {breakMins}m breaks
                    = ~{Math.round((studyMins * totalSessions + breakMins * (totalSessions - 1)))}m total
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Today's Activities */}
          <div className="tb-card pt-setup-card">
            <div className="tb-card-header">
              <ListChecks size={16} style={{ color: C.violet }} />
              <h3>Today's Activities</h3>
              {todayActs.length > 0 && <span className="tb-badge">{todayActs.length}</span>}
            </div>

            {todayActs.length === 0 ? (
              <div className="tb-empty">
                <CalendarDays size={28} />
                <p>No activities for today — add them in the Time Balancer page first</p>
              </div>
            ) : (
              <div className="pt-act-list">
                {todayActs.map(act => {
                  const c = CAT_MAP[act.category];
                  const isSelected = selectedAct?.id === act.id;
                  const setSecs = act.hours * 3600 + act.minutes * 60;
                  const savedRem = actProgress[act.id];
                  const hasProgress = savedRem !== undefined && savedRem > 0 && savedRem < setSecs;
                  return (
                    <button
                      key={act.id}
                      className={`pt-act-item ${isSelected ? 'selected' : ''}`}
                      style={isSelected ? { borderColor: c.color, background: `${c.color}12` } : {}}
                      onClick={() => handleSelectActivity(act)}
                      disabled={running || (timerSecs > 0 && !finished)}
                    >
                      <span className="pt-act-item-icon" style={{ color: c.color }}>{c.icon}</span>
                      <div className="pt-act-item-info">
                        <span className="pt-act-item-name">{act.name}</span>
                        <span className="pt-act-item-dur" style={{ color: c.color }}>
                          Planned: {fmtDur(setSecs)}
                          {hasProgress && (
                            <span className="pt-act-resume-badge"> · {fmtDur(savedRem)} left</span>
                          )}
                        </span>
                      </div>
                      {isSelected && <CheckCircle2 size={16} style={{ color: c.color, flexShrink: 0 }} />}
                    </button>
                  );
                })}
              </div>
            )}

            {!timerActive && (
              <button
                className="pt-start-btn"
                onClick={handleStart}
                disabled={!selectedAct || (selectedAct.hours * 3600 + selectedAct.minutes * 60) <= 0}
              >
                <Play size={16} />
                {selectedAct && actProgress[selectedAct.id] > 0 ? 'Resume Timer' : 'Start Timer'}
              </button>
            )}
          </div>

          {/* Timer Display */}
          {timerActive && (
            <div className="tb-card pt-timer-card">
              {pomodoroMode && (
                <div className="pt-pomo-status">
                  <span className={`pt-phase-badge ${phase}`}>
                    {phase === 'study' ? <><BookOpen size={12}/> Study</> : <><Coffee size={12}/> Break</>}
                  </span>
                  <span className="pt-session-counter">Session {currentSession} / {totalSessions}</span>
                </div>
              )}

              <div className="pt-timer-cat" style={{ color: phase === 'break' ? '#f59e0b' : cat.color }}>
                {phase === 'break' ? <Coffee size={15} /> : cat.icon}
                <span>{phase === 'break' ? 'Break Time' : activeLabel}</span>
              </div>

              <div className="pt-circle-wrap">
                <svg className="pt-circle-svg" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" className="pt-circle-bg" />
                  <circle
                    cx="60" cy="60" r="52"
                    className="pt-circle-prog"
                    style={{
                      stroke: phase === 'break' ? '#f59e0b' : cat.color,
                      strokeDashoffset: `${326.7 - (326.7 * progress) / 100}`,
                    }}
                  />
                </svg>
                <div className="pt-circle-inner">
                  <span className="pt-time-display" style={{ color: finished ? '#22c55e' : (phase === 'break' ? '#f59e0b' : cat.color) }}>
                    {finished ? '✓ Done!' : fmtTime(remaining)}
                  </span>
                  <span className="pt-time-sub">
                    {finished
                      ? phase === 'study' ? 'Study done!' : 'Break done!'
                      : `of ${fmtTime(timerSecs)}`}
                  </span>
                </div>
              </div>

              {/* planned vs elapsed — only show for study phase */}
              {phase === 'study' && (
                <div className="pt-vs-row">
                  <div className="pt-vs-block">
                    <span className="pt-vs-label">Planned</span>
                    <span className="pt-vs-val" style={{ color: C.violet }}>{fmtDur(activeSetSecs)}</span>
                  </div>
                  <div className="pt-vs-sep">vs</div>
                  <div className="pt-vs-block">
                    <span className="pt-vs-label">Elapsed</span>
                    <span className="pt-vs-val" style={{ color: cat.color }}>{fmtDur(timerSecs - remaining)}</span>
                  </div>
                </div>
              )}

              <div className="pt-prog-bar-wrap">
                <div className="pt-prog-bar" style={{ width: `${progress}%`, background: phase === 'break' ? '#f59e0b' : cat.color }} />
              </div>
              <div className="pt-prog-label">
                <span>{phase === 'break' ? 'Break' : fmtDur(timerSecs - remaining) + ' elapsed'}</span>
                <span>{progress.toFixed(0)}%</span>
              </div>

              <div className="pt-controls">
                {!finished && (
                  running
                    ? <button className="pt-ctrl-btn pause"  onClick={handlePause}><Pause size={16} /> Pause</button>
                    : <button className="pt-ctrl-btn resume" onClick={handleResume}><Play size={16} /> Resume</button>
                )}
                {/* after study phase done in pomodoro → start break */}
                {finished && pomodoroMode && phase === 'study' && currentSession < totalSessions && (
                  <button className="pt-ctrl-btn break-btn" onClick={handleStartBreak}>
                    <Coffee size={16} /> Start Break
                  </button>
                )}
                {/* after break done → next session */}
                {finished && pomodoroMode && phase === 'break' && (
                  <button className="pt-ctrl-btn resume" onClick={handleNextSession}>
                    <Play size={16} /> Next Session
                  </button>
                )}
                <button className="pt-ctrl-btn log"   onClick={handleLog}><CheckCircle2 size={16} /> Log Time</button>
                <button className="pt-ctrl-btn reset" onClick={handleReset}><RotateCcw size={16} /> Reset</button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="pt-right">
          {totals.length > 0 && (
            <div className="tb-card">
              <div className="tb-card-header">
                <TrendingUp size={16} style={{ color: C.violet }} />
                <h3>Time Accumulated</h3>
                <span className="pt-acc-note">logged only</span>
              </div>
              <div className="pt-totals-list">
                {totals.map(c => {
                  const pct = c.planned > 0 ? Math.min((c.actual / c.planned) * 100, 100) : 100;
                  const over = c.planned > 0 && c.actual > c.planned;
                  return (
                    <div key={c.key} className="tb-bd-row">
                      <span className="tb-bd-icon" style={{ color: c.color }}>{c.icon}</span>
                      <span className="tb-bd-label">{c.label}</span>
                      <div className="tb-bd-bar-wrap">
                        <div className="tb-bd-bar" style={{ width: `${pct}%`, background: over ? '#f59e0b' : c.color }} />
                      </div>
                      <span className="tb-bd-pct" style={{ color: over ? '#f59e0b' : undefined }}>
                        {c.planned > 0 ? `${pct.toFixed(0)}%` : '—'}
                      </span>
                      <span className="tb-bd-hrs" style={{ color: c.color }}>{fmtDur(c.actual)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {sessions.length === 0 ? (
            <div className="tb-card">
              <div className="tb-card-header">
                <Clock size={16} style={{ color: C.violet }} />
                <h3>Session Log</h3>
              </div>
              <div className="tb-empty">
                <Timer size={30} />
                <p>No sessions yet — pick a task and start the timer</p>
              </div>
            </div>
          ) : (
            loggedCats.map(c => {
              const catSessions = sessions.filter(s => s.category === c.key);
              const catTotal = catSessions.reduce((sum, s) => sum + (s.seconds || 0), 0);
              const expanded = expandedCats[c.key];
              return (
                <div key={c.key} className="tb-card pt-cat-log-card">
                  <div
                    className="tb-card-header pt-cat-log-header"
                    style={{ cursor: 'pointer', borderLeft: `3px solid ${c.color}`, paddingLeft: '12px' }}
                    onClick={() => toggleCat(c.key)}
                  >
                    <span style={{ color: c.color }}>{c.icon}</span>
                    <h3 style={{ color: c.color }}>{c.label}</h3>
                    <span className="tb-badge" style={{ background: `${c.color}20`, color: c.color }}>{catSessions.length}</span>
                    <span className="pt-cat-log-total" style={{ color: c.color }}>{fmtDur(catTotal)}</span>
                    <span className="pt-config-arrow">{expanded ? '▲' : '▼'}</span>
                  </div>
                  {expanded && (
                    <div className="pt-session-list">
                      {catSessions.map(s => {
                        const diff = s.seconds - s.setSecs;
                        const over = diff > 0;
                        const exact = Math.abs(diff) < 30;
                        return (
                          <div key={s.id} className="pt-session-row">
                            <span className="pt-session-dot" style={{ background: c.color }} />
                            <div className="pt-session-info">
                              <span className="pt-session-label">{s.label}</span>
                              <span className="pt-session-date">{s.date}</span>
                            </div>
                            <div className="pt-session-compare">
                              <span className="pt-session-actual" style={{ color: c.color }}>{fmtDur(s.seconds)}</span>
                              <span className="pt-session-planned">/ {fmtDur(s.setSecs)}</span>
                              {s.setSecs > 0 && (
                                <span className={`pt-session-diff ${exact ? 'on-time' : over ? 'over' : 'under'}`}>
                                  {exact ? '✓ on time' : over ? `+${fmtDur(Math.abs(diff))} over` : `−${fmtDur(Math.abs(diff))} under`}
                                </span>
                              )}
                            </div>
                            <button
                              className="tb-icon-btn red"
                              onClick={async () => {
                                try { await deletePromoSession(s._id || s.id); } catch {}
                                setSessions(prev => prev.filter(x => x.id !== s.id));
                              }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
