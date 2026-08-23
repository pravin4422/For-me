# Auth Pages UI — Glassmorphism Design System

## Applied To
- `LoginPage.jsx` / `LoginPage.css`
- `SignupPage.jsx` / `SignupPage.css`
- `ForgotPasswordPage.jsx` / `ForgotPasswordPage.css`

---

## Background
```css
background: url('https://images.wallpapersden.com/image/download/firewatch-new-hd-22-art_bWpubm2UmZqaraWkpJRnamtlrWZpaWU.jpg') no-repeat center center / cover;
```
- Applied on the page wrapper (`.login-page`, `.signup-page`, `.forgot-page`)
- `min-height: calc(100vh - 64px)` — accounts for the top navbar height (64px)
- `padding-top: 64px` on the outer wrapper

---

## Card (Glass Panel)
```css
background: transparent;
border: 2px solid rgba(255, 255, 255, 0.2);
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);
box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
border-radius: 10px;
padding: 30px 40px;
color: #fff;
width: 100%;
max-width: 420px;
font-family: 'Poppins', sans-serif;
```

---

## Font
```css
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
font-family: 'Poppins', sans-serif;
```

---

## Heading
```css
font-size: 32px–36px;
font-weight: 700;
color: #fff;
text-align: center;
```

## Subtext
```css
font-size: 14px;
color: rgba(255, 255, 255, 0.75);
text-align: center;
```

---

## Inputs (Pill style)
```css
width: 100%;
height: 50px;
background: transparent;
border: 2px solid rgba(255, 255, 255, 0.2);
border-radius: 40px;
font-size: 16px;
color: #fff;
padding: 0 45px 0 20px;   /* right padding for icon */
font-family: 'Poppins', sans-serif;
```
- Placeholder color: `rgba(255, 255, 255, 0.85)`
- Focus border: `rgba(255, 255, 255, 0.6)`
- Error border: `rgba(255, 100, 100, 0.7)`
- Labels are hidden (`display: none`) — placeholders serve as labels

### Icon inside input (Font Awesome)
```jsx
<div style={{ position: 'relative' }}>
  <input className="auth-input" placeholder="..." />
  <i className="fa-solid fa-envelope" style={{
    position: 'absolute', right: 20, top: '50%',
    transform: 'translateY(-50%)', fontSize: 18,
    color: 'rgba(255,255,255,0.85)', pointerEvents: 'none'
  }} />
</div>
```
- Icon examples: `fa-user`, `fa-envelope`, `fa-lock`, `fa-mobile-screen`
- Eye toggle button uses: `fa-lock` (hidden) / `fa-eye-slash` (visible)

---

## Primary Button (White pill)
```css
width: 100%;
height: 45px;
background: #fff;
color: #333;
border: none;
border-radius: 40px;
font-size: 16px;
font-weight: 600;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
font-family: 'Poppins', sans-serif;
```
### Hover state
```css
background: transparent;
color: #fff;
border: 2px solid rgba(255, 255, 255, 0.2);
box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
```

---

## Google / Secondary Button
```css
background: rgba(255, 255, 255, 0.12);
color: #fff;
border: 2px solid rgba(255, 255, 255, 0.2);
border-radius: 40px;
height: 45px;
```
### Hover
```css
background: rgba(255, 255, 255, 0.2);
border-color: rgba(255, 255, 255, 0.4);
```

---

## Tab Switch (Login Email/Mobile)
```css
border: 2px solid rgba(255, 255, 255, 0.2);
border-radius: 40px;
overflow: hidden;
```
- Active tab: `background: rgba(255, 255, 255, 0.25); color: #fff;`
- Inactive tab: `color: rgba(255, 255, 255, 0.75);`

---

## Divider
```css
.divider-line  { background: rgba(255, 255, 255, 0.25); }
.divider-text  { color: rgba(255, 255, 255, 0.75); font-size: 13px; }
```

---

## Link Buttons
```css
color: #fff;
font-weight: 600;
background: none;
border: none;
font-family: 'Poppins', sans-serif;
```
- Hover: `text-decoration: underline`

---

## Error Message
```css
color: #fff;
background: rgba(217, 48, 37, 0.45);
border: 1px solid rgba(255, 100, 100, 0.4);
border-radius: 40px;
padding: 10px 16px;
font-size: 13px;
```

---

## Field-level Error
```css
color: rgba(255, 180, 180, 1);
font-size: 12px;
margin-top: 6px;
padding-left: 8px;
```

---

## Confirm / Verify Icon Circle
```css
width: 72px;
height: 72px;
background: rgba(255, 255, 255, 0.12);
border-radius: 50%;
color: #fff;
font-size: 32px;
```

---

## Font Awesome CDN (index.html)
```html
<link rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  crossorigin="anonymous" referrerpolicy="no-referrer" />
```
Already added to `frontend/index.html`.

---

## Page Wrapper Pattern
```jsx
<div className="auth-page-wrapper">        // padding-top: 64px
  <div className="auth-page">              // bg image + flex center
    <div className="auth-card">            // glass card
      ...
    </div>
  </div>
</div>
```

---

## Responsive
```css
@media (max-width: 480px) {
  .auth-card { padding: 30px 24px; }
  .auth-heading { font-size: 26px; }
}
```

---

## Checklist — When applying to a new auth page
- [ ] Import Poppins font at top of CSS
- [ ] Page wrapper has `padding-top: 64px`
- [ ] Page div has the background image + `min-height: calc(100vh - 64px)`
- [ ] Card uses glass styles (transparent bg, blur, white border)
- [ ] All inputs are pill-shaped (`border-radius: 40px`, height 50px)
- [ ] FA icon placed absolutely inside each input wrapper
- [ ] Primary button is white pill with transparent hover
- [ ] All text/icons/placeholders are white or white with opacity
- [ ] Labels hidden, placeholders used instead
- [ ] Error styles use red-tinted glass (not solid red)
- [ ] Font Awesome CDN present in `index.html`
