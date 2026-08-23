import { useState, useEffect, useRef } from 'react';
import {
  BookOpen, FileText, ClipboardList, Briefcase,
  CheckSquare, FolderOpen, Wallet, Activity,
  Target, LayoutDashboard,
  Zap, BarChart2, Download, Layers,
  Mail, Globe, Share2, AtSign,
  ShieldCheck, RefreshCw, BrainCircuit, Rocket
} from 'lucide-react';
import kurals from '../data/thirukural.json';
import './HomePage.css';

const FEATURES = [
  { id: 'study',  icon: BookOpen,      title: 'Study Planner',             desc: 'Organize subjects, topics & revision schedules.',      route: '/dashboard/study' },
  { id: 'exam',   icon: FileText,      title: 'Govt Exam Prep',            desc: 'RRB, SSC, TNPSC, Banking — syllabus & cutoffs.',       route: '/dashboard/exam' },
  { id: 'mock',   icon: ClipboardList, title: 'Mock Tests & Analysis',     desc: 'Practice tests with weak-topic tracking.',             route: '/dashboard/mock' },
  { id: 'career', icon: Briefcase,     title: 'Career & Company Tracker',  desc: 'Watchlist, skills gap & interview info.',              route: '/dashboard/career' },
  { id: 'todo',   icon: CheckSquare,   title: 'To-Do & Time Balancer',     desc: 'Daily tasks with time allocation tracking.',           route: '/dashboard/todo' },
  { id: 'docs',   icon: FolderOpen,    title: 'Document Vault',            desc: 'Google Drive-backed secure document storage.',         route: '/dashboard/docs' },
  { id: 'budget', icon: Wallet,        title: 'Budget & Shopping Planner', desc: 'Expense tracking and purchase checklists.',            route: '/dashboard/budget' },
  { id: 'health', icon: Activity,      title: 'Health Tracker',            desc: 'Water, sleep, workout & nutrition logs.',              route: '/dashboard/health' },
  { id: 'vision', icon: Target,        title: 'Motivation & Vision Board', desc: 'Goals, affirmations & your personal vision board.',    route: '/dashboard/vision' },
];

const VALUES = [
  {
    icon: BrainCircuit,
    title: 'Built Around Your Goals',
    desc: 'Every module — study, career, health, budget — is designed to work together, not in isolation.',
    stat: '9 modules'
  },
  {
    icon: BarChart2,
    title: 'Know Where You Stand',
    desc: 'Mock test analysis and topic tracking show your weak areas before they cost you marks.',
    stat: 'Smart analytics'
  },
  {
    icon: ShieldCheck,
    title: 'Your Data, Always Safe',
    desc: 'Documents backed by Google Drive. Nothing stored carelessly — your files stay yours.',
    stat: 'Drive-backed'
  },
  {
    icon: Download,
    title: 'Export Anytime',
    desc: 'Pull your data into Google Sheets whenever you need it. Full control, always.',
    stat: 'Google Sheets'
  },
];

const HERO_CARDS = [
  { icon: BookOpen,      label: 'Study Planner' },
  { icon: ClipboardList, label: 'Mock Tests' },
  { icon: Briefcase,     label: 'Career Track' },
  { icon: Activity,      label: 'Health Log' },
];

export default function HomePage({ isLoggedIn = false, onNavigate }) {
  const [index, setIndex] = useState(0);
  const [animClass, setAnimClass] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimClass('kural-exit');
      setTimeout(() => {
        setIndex(i => (i + 1) % kurals.length);
        setAnimClass('kural-enter');
        setTimeout(() => setAnimClass(''), 500);
      }, 400);
    }, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const kural = kurals[index];
  const navigate = (path) => { if (onNavigate) onNavigate(path); };
  const handleFeatureClick = (f) => navigate(isLoggedIn ? f.route : 'login');

  return (
    <div className="home-page">

      {/* ── THIRUKURAL ── */}
      <div className="home-kural-label">All-in-one productivity platform</div>
      <section className="home-kural-section">
        <div className="home-kural-carousel">
          <div className="home-kural-slide home-kural-slide--prev">
            <div className="home-kural-slide__meta">
              <span>{kurals[(index - 1 + kurals.length) % kurals.length].athigaram}</span>
            </div>
            <div className="home-kural-slide__lines">
              {kurals[(index - 1 + kurals.length) % kurals.length].kural.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>

          <div className={`home-kural-slide home-kural-slide--active ${animClass}`}>
            <div className="home-kural-slide__meta">
              <span className="home-kural-slide__tag">{kural.paal}</span>
              <span className="home-kural-slide__tag">{kural.iyal}</span>
              <span className="home-kural-slide__tag home-kural-slide__tag--accent">{kural.athigaram}</span>
              <span className="home-kural-slide__num">#{kural.number}</span>
            </div>
            <div className="home-kural-slide__lines">
              {kural.kural.map((l, i) => <div key={i} className="home-kural-slide__line">{l}</div>)}
            </div>
            <div className="home-kural-slide__porul-label">பொருள்</div>
            <div className="home-kural-slide__porul">{kural.porul}</div>
          </div>

          <div className="home-kural-slide home-kural-slide--next">
            <div className="home-kural-slide__meta">
              <span>{kurals[(index + 1) % kurals.length].athigaram}</span>
            </div>
            <div className="home-kural-slide__lines">
              {kurals[(index + 1) % kurals.length].kural.map((l, i) => <div key={i}>{l}</div>)}
            </div>
          </div>
        </div>
      </section>

      {/* ── HERO ── */}
      <section className="home-hero">
        <div className="home-hero__content">
          <h1 className="home-hero__title">
            One Platform for Your<br />
            <span>Study, Career & Life</span>
          </h1>
          <p className="home-hero__sub">
            Manage your exam prep, career goals, daily tasks, health, budget,
            and more — all from a single organized dashboard built for serious learners.
          </p>
          <div className="home-hero__actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('signup')}>
              Get Started
            </button>
            <button className="btn btn-outline btn-lg" onClick={() => navigate('login')}>
              Login
            </button>
          </div>
        </div>
        <div className="home-hero__visual">
          <div className="home-hero__graphic">
            <div className="hhg-top">
              {HERO_CARDS.slice(0, 2).map((c) => {
                const CardIcon = c.icon;
                return (
                  <div key={c.label} className="hhg-card">
                    <div className="hhg-card__icon"><CardIcon size={20} color="#fff" /></div>
                    <span className="hhg-card__label">{c.label}</span>
                    <div className="hhg-card__bar"><div className="hhg-card__bar-fill" /></div>
                  </div>
                );
              })}
            </div>
            <div className="hhg-stat-row">
              <div className="hhg-stat">
                <span className="hhg-stat__num">9</span>
                <span className="hhg-stat__txt">Modules</span>
              </div>
              <div className="hhg-stat">
                <span className="hhg-stat__num">1</span>
                <span className="hhg-stat__txt">Login</span>
              </div>
              <div className="hhg-stat">
                <span className="hhg-stat__num">∞</span>
                <span className="hhg-stat__txt">Progress</span>
              </div>
            </div>
            <div className="hhg-bottom">
              {HERO_CARDS.slice(2).map((c) => {
                const CardIcon = c.icon;
                return (
                  <div key={c.label} className="hhg-card">
                    <div className="hhg-card__icon"><CardIcon size={20} color="#fff" /></div>
                    <span className="hhg-card__label">{c.label}</span>
                    <div className="hhg-card__bar"><div className="hhg-card__bar-fill" style={{width:'55%'}} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="home-features" id="features">
        <div className="home-section-header">
          <span className="home-section-header__label">What We Offer</span>
          <h2><span className="deco">~</span> Everything You Need, In One Place <span className="deco">~</span></h2>
          <p>Nine focused modules, one login — built to keep you moving forward.</p>
        </div>
        <div className="home-features__grid">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.id}
                className="home-feature-card"
                onClick={() => handleFeatureClick(f)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleFeatureClick(f)}
              >
                <div className="home-feature-card__icon"><Icon size={20} /></div>
                <div className="home-feature-card__title">{f.title}</div>
                <div className="home-feature-card__desc">{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── VALUE PROPS ── */}
      <section className="home-values" id="why">
        <div className="home-values__header">
          <div className="home-values__badge">Why choose us</div>
          <h2>Everything else is just another tab.<br />For Me keeps it all in one place.</h2>
         
        </div>
        <div className="home-values__grid">
          {VALUES.map((v) => {
            const Icon = v.icon;
            return (
              <div key={v.title} className="home-value-item">
                <div className="home-value-item__top">
                  <div className="home-value-item__icon"><Icon size={20} /></div>
                  <span className="home-value-item__stat">{v.stat}</span>
                </div>
                <div className="home-value-item__title">{v.title}</div>
                <div className="home-value-item__desc">{v.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="home-cta">
        <div className="home-cta__inner">
          <div className="home-cta__content">
            <div className="home-cta__badge">Get started free</div>
            <div className="home-cta__title">Stop juggling apps.<br />Start making real progress.</div>
            <p className="home-cta__sub">Everything you need to study smarter, manage your career, stay healthy, and hit your goals — in one place, from day one.</p>
          </div>
          <div className="home-cta__actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('signup')}>
              Create Free Account
            </button>
            <span className="home-cta__note">No credit card required</span>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="home-footer" id="footer">
        <div className="home-footer__inner">
          <div className="home-footer__brand">
            <div className="home-footer__logo">
              <div className="home-footer__logo-icon"><LayoutDashboard size={16} /></div>
              <span>For Me</span>
            </div>
            <p>An all-in-one platform for students and professionals who take their growth seriously.</p>
            <div className="home-footer__socials">
              <a href="mailto:hello@forme.app" aria-label="Email"><Mail size={15} /></a>
              <a href="#" aria-label="Twitter"><AtSign size={15} /></a>
              <a href="#" aria-label="LinkedIn"><Share2 size={15} /></a>
              <a href="#" aria-label="Website"><Globe size={15} /></a>
            </div>
          </div>

          <div className="home-footer__col">
            <h4>Platform</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#why">Why For Me</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('signup'); }}>Create Account</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); navigate('login'); }}>Sign In</a></li>
            </ul>
          </div>

          <div className="home-footer__col">
            <h4>Modules</h4>
            <ul>
              <li><a href="#">Study Planner</a></li>
              <li><a href="#">Mock Tests</a></li>
              <li><a href="#">Career Tracker</a></li>
              <li><a href="#">Budget Planner</a></li>
              <li><a href="#">Health Log</a></li>
            </ul>
          </div>

          <div className="home-footer__col">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:hello@forme.app">hello@forme.app</a></li>
              <li><a href="#">Twitter / X</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">GitHub</a></li>
            </ul>
          </div>
        </div>

        <div className="home-footer__bottom">
          <span>© {new Date().getFullYear()} For Me. All rights reserved.</span>
          <div className="home-footer__bottom-links">
            <a href="#">Privacy Policy</a>
            <span className="home-footer__dot" />
            <a href="#">Terms of Service</a>
            <span className="home-footer__dot" />
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
