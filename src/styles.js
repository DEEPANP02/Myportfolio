export const GLOBAL_CSS = `
  /* Safe Google Fonts import */
  @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { 
    scroll-behavior: smooth; 
    font-size: 16px; 
    scroll-padding-top: 80px; 
    scroll-snap-type: y proximity; 
  }

  body {
    background: #080510;
    color: #d8e4ff;
    font-family: 'Plus Jakarta Sans', 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }


  body::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background-image:
      linear-gradient(rgba(124,58,237,.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(124,58,237,.045) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  ::-webkit-scrollbar { width: 3px; }
  ::-webkit-scrollbar-track { background: #080510; }
  ::-webkit-scrollbar-thumb { background: linear-gradient(#7c3aed, #a855f7); border-radius: 3px; }

  /* Keyframes */
  @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  @keyframes mq   { from { transform: translateX(0) } to { transform: translateX(-50%) } }
  @keyframes pulse { 0%,100% { box-shadow: 0 0 0 3px rgba(34,197,94,.28) } 50% { box-shadow: 0 0 0 9px rgba(34,197,94,.09) } }
  @keyframes hero-in { from { opacity: 0; transform: translateY(26px) } to { opacity: 1; transform: none } }
  /* Persistent Edge Glow */
  .edge-glow {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    pointer-events: none;
    z-index: 90;
    box-shadow: inset 1.5vw 0 5vw -1.5vw rgba(124, 58, 237, 0.35),
                inset -1.5vw 0 5vw -1.5vw rgba(168, 85, 247, 0.35);
  }

  /* Nav Links styling */
  .nav-desktop-links { list-style: none; display: flex; gap: 2rem; align-items: center; }
  .nav-link { 
    background: transparent; border: none; color: #6b5a8e; font-size: 0.8rem; 
    font-weight: 600; cursor: pointer; transition: color 0.3s; text-transform: capitalize;
  }
  .nav-link:hover { color: #d8e4ff !important; }

  @media (max-width: 767px) {
    .nav-desktop-links { display: none !important; }
    .nav-mobile-cta { display: block !important; }
  }
  .nav-mobile-cta { display: none; }

  /* Hero Panels Responsive Logic */
  .hero-right-panel {
    position: absolute; top: 0; right: 0; bottom: 0; width: 42%;
    display: flex; align-items: center; justify-content: center; z-index: 1;
  }

  /* Media Queries for Hero Section */
  @media (max-width: 1023px) {
    .hero-right-panel { width: 45%; }
  }

  @media (max-width: 767px) {
    .hero-right-panel {
      position: relative; width: 100%; height: auto; 
      padding-top: 2rem; margin-bottom: 3rem; order: -1;
      display: flex !important; flex-direction: column; align-items: center;
    }
    .photo-wrap { transform: scale(0.85); margin: 0 auto; }
    .hero-badge { display: none !important; }
    #home { padding-top: 120px !important; flex-direction: column; text-align: center; }
    #home p { margin-left: auto; margin-right: auto; }
    #home .hero-btns { justify-content: center; }
  }

  /* Contact Form Mobile Fix */
  .contact-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media (max-width: 600px) {
    .contact-form-grid { grid-template-columns: 1fr; }
  }

  /* Interactive States */
  .skill-card-neo {
    background: #0d091a; border: 1px solid rgba(124,58,237,0.1);
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  }
  .skill-card-neo:hover {
    transform: translateY(-8px); border-color: rgba(168,85,247,0.4);
    box-shadow: 0 15px 35px rgba(124,58,237,0.15), inset 0 0 40px rgba(168,85,247,0.05);
  }
  .card-proj {
    transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease, border-color 0.4s ease;
  }
  .card-proj:hover {
    transform: translateY(-12px); border-color: rgba(168,85,247,0.4) !important;
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 30px rgba(124,58,237,0.1);
  }
  .skill-badge:hover {
    transform: scale(1.05) translateY(-2px);
    background: linear-gradient(135deg, rgba(124,58,237,0.3), rgba(168,85,247,0.3)) !important;
    border-color: rgba(168,85,247,0.6) !important; color: #fff !important;
  }

  /* Section Titles */
  .section-title { font-family: 'Instrument Serif', Georgia, serif; font-size: clamp(2.5rem, 6vw, 4.5rem); line-height: 1; margin-bottom: 2.5rem; }
  .section-subtitle { font-size: 0.75rem; font-weight: 700; color: #a855f7; letter-spacing: 0.3em; text-transform: uppercase; margin-bottom: 1rem; }

  /* Mobile Responsive Fixes */
  @media (max-width: 767px) {
    section { padding: 140px 10% !important; scroll-snap-align: start; }
    .skill-card-neo { padding: 2.2rem !important; }
    .section-title { margin-bottom: 3rem; }
    .hero-right-panel { padding-top: 2rem !important; }
  }
`;
