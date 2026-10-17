import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Menu, X,
  User, Settings, LogOut, ChevronDown, Sun, Moon
} from 'lucide-react';
import NotificationBell from '../../features/notifications/NotificationBell';
import { useTheme } from '../../context/ThemeContext/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

export default function Navbar({
  isLoggedIn = false,
  user = null,
  notificationCount = 0,
  currentPage = 'home',
  onNavigate,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const dropdownRef = useRef(null);
  const mobileRef = useRef(null);
  const lastScrollY = useRef(0);
  const hideTimer = useRef(null);

  const { theme, toggle } = useTheme();
  const { user: firebaseUser } = useAuth();

  const displayName = firebaseUser?.displayName || firebaseUser?.email?.split('@')[0] || 'User';
  const displayEmail = firebaseUser?.email || '';
  const photoURL = firebaseUser?.photoURL || null;
  const initials = displayName.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

  const nav = (path) => {
    setMobileOpen(false);
    setDropdownOpen(false);
    onNavigate?.(path);
  };

  // Always visible at top; hide on scroll down; show on scroll up then auto-hide
  useEffect(() => {
    const onScroll = () => {
      const current = window.scrollY;
      if (current < 10) {
        clearTimeout(hideTimer.current);
        setNavVisible(true);
      } else if (current < lastScrollY.current) {
        setNavVisible(true);
        clearTimeout(hideTimer.current);
        hideTimer.current = setTimeout(() => setNavVisible(false), 2000);
      } else if (current > lastScrollY.current) {
        clearTimeout(hideTimer.current);
        setNavVisible(false);
      }
      lastScrollY.current = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(hideTimer.current); };
  }, []);

  // Close dropdown/mobile on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <nav className={`navbar${navVisible ? '' : ' navbar--hidden'}`}>
      {/* Logo */}
      <a href="#" className="navbar-logo" onClick={e => { e.preventDefault(); nav(isLoggedIn ? 'dashboard' : 'home'); }}>
        <div className="navbar-logo__icon"><LayoutDashboard size={16} /></div>
        <span className="navbar-logo__text">For Me</span>
      </a>

      {/* Center links — desktop */}
      <ul className="navbar-links">
        {isLoggedIn ? (
          <>
            <li><a href="#" className={currentPage === 'dashboard' ? 'active' : ''} onClick={e => { e.preventDefault(); nav('dashboard'); }}>Dashboard</a></li>
            <li><a href="#" className={currentPage === 'todo' ? 'active' : ''} onClick={e => { e.preventDefault(); nav('todo'); }}>To-Do</a></li>
            <li><a href="#" className={currentPage === 'study' ? 'active' : ''} onClick={e => { e.preventDefault(); nav('study'); }}>Study</a></li>
            <li><a href="#" className={currentPage === 'exam' ? 'active' : ''} onClick={e => { e.preventDefault(); nav('exam'); }}>Exams</a></li>
            <li><a href="#" className={currentPage === 'career' ? 'active' : ''} onClick={e => { e.preventDefault(); nav('career'); }}>Career</a></li>
          </>
        ) : (
          <>
            <li><a href="#" className={currentPage === 'home' ? 'active' : ''} onClick={e => { e.preventDefault(); nav('home'); }}>Home</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#footer">About</a></li>
          </>
        )}
      </ul>

      {/* Right section — desktop */}
      <div className="navbar-right">
        {isLoggedIn ? (
          <>
        {/* Theme toggle */}
            <button className="navbar-theme-btn" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Bell */}
            <NotificationBell />

            {/* Avatar dropdown */}
            <div className="navbar-avatar-wrap" ref={dropdownRef}>
              <button
                className="navbar-avatar"
                onClick={() => setDropdownOpen(v => !v)}
                aria-label="User menu"
              >
                {photoURL
                  ? <img src={photoURL} alt={displayName} className="navbar-avatar__img" />
                  : <span className="navbar-avatar__initials">{initials}</span>
                }
                <ChevronDown size={14} className={`navbar-avatar__chevron${dropdownOpen ? ' open' : ''}`} />
              </button>

              {dropdownOpen && (
                <div className="navbar-dropdown">
                  <div className="navbar-dropdown__header">
                    <span className="navbar-dropdown__name">{displayName}</span>
                    <span className="navbar-dropdown__email">{displayEmail}</span>
                  </div>
                  <button className="navbar-dropdown__item" onClick={() => nav('profile')}>
                    <User size={15} /> Profile
                  </button>
                  <button className="navbar-dropdown__item" onClick={() => nav('settings')}>
                    <Settings size={15} /> Settings
                  </button>
                  <button className="navbar-dropdown__item navbar-dropdown__item--logout" onClick={() => { setDropdownOpen(false); onLogout?.(); }}>
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Theme toggle */}
            <button className="navbar-theme-btn" onClick={toggle} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {currentPage !== 'login' && (
              <button className="navbar-btn navbar-btn--outline" onClick={() => nav('login')}>Login</button>
            )}
            {currentPage !== 'signup' && (
              <button className="navbar-btn navbar-btn--primary" onClick={() => nav('signup')}>Sign Up</button>
            )}
          </>
        )}
      </div>

      {/* Hamburger */}
      <button
        className="navbar-hamburger"
        onClick={() => setMobileOpen(v => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="navbar-mobile" ref={mobileRef}>
          {isLoggedIn ? (
            <>
              <a href="#" className="navbar-mobile__link" onClick={e => { e.preventDefault(); nav('dashboard'); }}>Dashboard</a>
              <a href="#" className="navbar-mobile__link" onClick={e => { e.preventDefault(); nav('todo'); }}>To-Do</a>
              <a href="#" className="navbar-mobile__link" onClick={e => { e.preventDefault(); nav('study'); }}>Study</a>
              <a href="#" className="navbar-mobile__link" onClick={e => { e.preventDefault(); nav('exam'); }}>Exams</a>
              <a href="#" className="navbar-mobile__link" onClick={e => { e.preventDefault(); nav('career'); }}>Career</a>
              <div className="navbar-mobile__divider" />
              <a href="#" className="navbar-mobile__link" onClick={e => { e.preventDefault(); nav('profile'); }}>Profile</a>
              <a href="#" className="navbar-mobile__link" onClick={e => { e.preventDefault(); nav('settings'); }}>Settings</a>
              <button className="navbar-mobile__link navbar-mobile__link--logout" onClick={() => { setMobileOpen(false); onLogout?.(); }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <a href="#" className={`navbar-mobile__link${currentPage === 'home' ? ' active' : ''}`} onClick={e => { e.preventDefault(); nav('home'); }}>Home</a>
              <a href="#features" className="navbar-mobile__link" onClick={() => setMobileOpen(false)}>Features</a>
              <a href="#footer" className="navbar-mobile__link" onClick={() => setMobileOpen(false)}>About</a>
              <div className="navbar-mobile__divider" />
              {currentPage !== 'login' && (
                <button className="navbar-btn navbar-btn--outline navbar-mobile__btn" onClick={() => nav('login')}>Login</button>
              )}
              {currentPage !== 'signup' && (
                <button className="navbar-btn navbar-btn--primary navbar-mobile__btn" onClick={() => nav('signup')}>Sign Up</button>
              )}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
