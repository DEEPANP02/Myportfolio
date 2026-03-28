import React, { useState, useEffect, useRef } from "react";
import { useForm, ValidationError } from '@formspree/react';
import profilePhoto from "./assets/profile_photo.jpg";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  SKILLS, EXP, PROJECTS, STATS, CERTS, CONTACT_INFO, MQ_ITEMS 
} from "./constants";
import { GLOBAL_CSS } from "./styles";

/* ── CUSTOM HOOKS ── */
function useInView(options = { threshold: 0.1 }) {
  const [isIntersecting, setIntersecting] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true);
        observer.unobserve(entry.target);
      }
    }, options);
    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);
    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options]);

  return [ref, isIntersecting];
}

function useCounter(end, decimals = 0, startTrigger = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!startTrigger) return;
    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, startTrigger]);
  return count;
}

/* ── COMPONENTS ── */
function FadeUp({ children, delay = 0, className = "" }) {
  const [ref, vis] = useInView();
  return (
    <motion.div 
      ref={ref} 
      className={className} 
      initial={{ opacity: 0, y: 30 }}
      animate={vis ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}

function ParallaxWrapper({ children, speed = 0.2 }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (val) => val * speed);
  return (
    <motion.div style={{ y }}>
      {children}
    </motion.div>
  );
}

function ScrollGlowWrapper({ children }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "0.5 0.5", "1 0"]
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.02, 0.95]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 1, 0.7]);
  const brightness = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 0.8]);

  return (
    <motion.div 
      ref={ref} 
      style={{ scale, opacity, filter: `brightness(${brightness})` }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {children}
    </motion.div>
  );
}

function BackgroundOrbs() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 5000], [0, -600]);
  const y2 = useTransform(scrollY, [0, 5000], [0, -1200]);
  const y3 = useTransform(scrollY, [0, 5000], [0, -400]);
  const y4 = useTransform(scrollY, [0, 5000], [0, -900]);

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <motion.div style={{ y: y1, position: "absolute", top: "10%", left: "-5%", width: "80vw", height: "80vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)", filter: "blur(80px)" }} />
      <motion.div style={{ y: y2, position: "absolute", top: "50%", right: "-10%", width: "90vw", height: "90vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.1) 0%, transparent 70%)", filter: "blur(100px)" }} />
      <motion.div style={{ y: y3, position: "absolute", top: "80%", left: "20%", width: "70vw", height: "70vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)", filter: "blur(70px)" }} />
      <motion.div style={{ y: y4, position: "absolute", top: "30%", left: "50%", width: "60vw", height: "60vw", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)", filter: "blur(90px)" }} />
    </div>
  );
}

function Label({ children }) {
  return (
    <div style={{ fontSize: ".67rem", fontWeight: 700, letterSpacing: ".24em", textTransform: "uppercase", color: "#a855f7", display: "flex", alignItems: "center", gap: ".8rem", marginBottom: "1rem" }}>
      <span style={{ width: 32, height: 1.5, background: "linear-gradient(90deg,#7c3aed,#a855f7)", display: "inline-block" }} />
      {children}
    </div>
  );
}

function StatCell({ s, last }) {
  const [ref, vis] = useInView();
  const n = useCounter(s.val, s.dec, vis);
  return (
    <div ref={ref} className="stat-cell" style={{ 
      padding: "3.5rem 2rem", textAlign: "center", transition: "background .3s", 
      borderRight: !last ? "1px solid rgba(124,58,237,.12)" : "none" 
    }}>
      <div style={{ 
        fontFamily: "'Instrument Serif',Georgia,serif", fontSize: "clamp(2.4rem,5vw,3.6rem)", 
        background: "linear-gradient(135deg,#c084fc,#a855f7)", WebkitBackgroundClip: "text", 
        WebkitTextFillColor: "transparent", lineHeight: 1, marginBottom: ".6rem" 
      }}>
        {n.toFixed(s.dec)}{s.suffix}
      </div>
      <div style={{ fontSize: ".71rem", color: "#6b5a8e", letterSpacing: ".14em", textTransform: "uppercase", fontWeight: 600 }}>{s.label}</div>
    </div>
  );
}

function ContactForm() {
  const [state, handleSubmit] = useForm("mkopgejn");

  if (state.succeeded) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🎉</div>
        <h3 style={{ color: "#d8e4ff", marginBottom: "0.5rem" }}>Success!</h3>
        <p style={{ color: "#6b5a8e" }}>Thanks for your message. I'll get back to you soon!</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ ...btnStyle, marginTop: "1.5rem", background: "rgba(124,58,237,0.1)", border: "1px solid #7c3aed" }}
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div className="contact-form-grid">
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <input type="text" name="name" id="name" placeholder="Name" required style={inputStyle} />
          <ValidationError prefix="Name" field="name" errors={state.errors} style={{ fontSize: "0.7rem", color: "#f43f5e" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <input type="email" name="email" id="email" placeholder="Email" required style={inputStyle} />
          <ValidationError prefix="Email" field="email" errors={state.errors} style={{ fontSize: "0.7rem", color: "#f43f5e" }} />
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <input type="text" name="subject" id="subject" placeholder="Subject" required style={inputStyle} />
        <ValidationError prefix="Subject" field="subject" errors={state.errors} style={{ fontSize: "0.7rem", color: "#f43f5e" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <textarea name="message" id="message" placeholder="How can I help?" rows="4" required style={inputStyle}></textarea>
        <ValidationError prefix="Message" field="message" errors={state.errors} style={{ fontSize: "0.7rem", color: "#f43f5e" }} />
      </div>
      <button type="submit" disabled={state.submitting} style={{ ...btnStyle, opacity: state.submitting ? 0.7 : 1 }}>
        {state.submitting ? "Sending..." : "Send Message"}
      </button>
      {state.errors && !state.succeeded && (
        <div style={{ fontSize: "0.8rem", color: "#f43f5e", fontWeight: 700 }}>
          Submission failed. Please check the fields above.
        </div>
      )}
    </form>
  );
}

const inputStyle = {
  background: "rgba(124,58,237,.03)", border: "1px solid rgba(124,58,237,.15)", 
  borderRadius: "8px", padding: "0.9rem 1.1rem", color: "#d8e4ff", fontSize: "0.85rem", 
  outline: "none", width: "100%"
};

const btnStyle = {
  background: "linear-gradient(135deg,#7c3aed,#9333ea)", color: "#fff", 
  padding: "0.9rem 1.8rem", borderRadius: "8px", border: "none", cursor: "pointer", 
  fontSize: "0.75rem", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase"
};

/* ── MAIN APP ── */
export default function App() {
  const [m, setM] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e) => setM({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);


  const go = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <BackgroundOrbs />


      {/* Navigation */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, padding: "1.2rem 5%", display: "flex", justifyContent: "space-between", alignItems: "center", background: "rgba(8,5,16,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
        <div style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: "1.5rem", fontWeight: 800, color: "#d8e4ff", letterSpacing: "-0.03em" }}>Deepan <span style={{ color: "#a855f7" }}>P</span></div>
        <ul className="nav-desktop-links">
          {["about", "skills", "experience", "projects", "education"].map(id => (
            <li key={id}><button onClick={() => go(id)} className="nav-link">{id}</button></li>
          ))}
          <li><button onClick={() => go("contact")} style={{ ...btnStyle, padding: "0.5rem 1.2rem", fontSize: "0.65rem" }}>Hire Me</button></li>
        </ul>
        <div className="nav-mobile-cta">
           <button onClick={() => go("contact")} style={{ ...btnStyle, padding: "0.5rem 1.2rem", fontSize: "0.65rem" }}>Hire Me</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", padding: "0 5%" }}>
        <div className="hero-right-panel">
          <div className="photo-wrap" style={{ position: "relative", width: 340, height: 340 }}>
            <div style={{ position: "absolute", inset: -4, borderRadius: "50%", background: "linear-gradient(135deg,#7c3aed,#a855f7)", animation: "spin 8s linear infinite" }} />
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", overflow: "hidden", zIndex: 2, background: "#110c20" }}>
              <img src={profilePhoto} alt="Deepan" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 20%", transform: "scale(1.1)" }} />
            </div>
          </div>
          <div className="hero-badge" style={{ position: "absolute", bottom: "5%", right: "5%", width: 100, height: 100, borderRadius: "50%", background: "#110c20", border: "1px solid #a855f7", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: "0.6rem", fontWeight: 700, color: "#a855f7", animation: "spin 20s linear infinite" }}>
            FULL<br/>STACK<br/>DEV
          </div>
        </div>

        <div style={{ position: "relative", zIndex: 2, maxWidth: 800 }}>
          <FadeUp>
            <div style={{ display: "inline-flex", alignItems: "center", gap: ".85rem", fontSize: ".7rem", fontWeight: 700, letterSpacing: ".24em", textTransform: "uppercase", color: "#a855f7", marginBottom: "1.6rem" }}>
              <span style={{ width: 38, height: 1.5, background: "linear-gradient(90deg,#7c3aed,#a855f7)", display: "inline-block" }} />
              Open to work · Tiruchirapalli, TN
            </div>
            
            <h1 style={{ 
              fontFamily: "'Bricolage Grotesque', sans-serif", 
              fontSize: "clamp(3.8rem, 9.5vw, 8.5rem)", 
              lineHeight: 0.91, 
              marginBottom: "1rem",
              fontWeight: 800,
              position: "relative"
            }}>
              Building<br/>
              <em style={{ 
                fontFamily: "'Instrument Serif', Georgia, serif",
                fontStyle: "italic",
                fontWeight: 400,
                background: "linear-gradient(105deg,#c084fc 0%,#a855f7 100%)", 
                WebkitBackgroundClip: "text", 
                WebkitTextFillColor: "transparent",
                textShadow: "0 0 30px rgba(168,85,247,0.5)",
                marginRight: "0.5rem"
              }}>digital</em>
              <div style={{ 
                display: "inline-block", 
                width: "clamp(2rem, 5vw, 4rem)", 
                height: "clamp(2rem, 5vw, 4rem)", 
                borderRadius: "50%", 
                border: "2px solid rgba(168,85,247,0.3)", 
                position: "relative",
                verticalAlign: "middle",
                marginLeft: "-0.5rem",
                marginRight: "1rem"
              }}>
                <div style={{ 
                  position: "absolute", 
                  top: "50%", 
                  left: "50%", 
                  transform: "translate(-50%, -50%)", 
                  width: 10, 
                  height: 10, 
                  background: "#a855f7", 
                  borderRadius: "50%",
                  boxShadow: "0 0 20px #a855f7" 
                }} />
              </div>
              <br/>
              products.
            </h1>

            <p style={{ fontSize: "1.05rem", color: "#6b5a8e", maxWidth: 500, marginBottom: "2.8rem", lineHeight: 1.8 }}>
              Full Stack Developer crafting high-performance web apps with Django, PostgreSQL & modern JS. From backend logic to pixel-perfect interfaces — I build it all.
            </p>
            <div className="hero-btns" style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => go("contact")} style={btnStyle}>Start a Project</button>
              <button onClick={() => go("projects")} style={{ ...btnStyle, background: "transparent", border: "1px solid rgba(124,58,237,0.35)", color: "#d8e4ff" }}>View Work</button>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Marquee */}
      <div style={{ background: "#100c1f", padding: "1.2rem 0", borderTop: "1px solid rgba(124,58,237,0.1)", borderBottom: "1px solid rgba(124,58,237,0.1)", overflow: "hidden" }}>
        <div style={{ display: "flex", width: "200%", gap: "4rem", animation: "mq 40s linear infinite" }}>
          {[...MQ_ITEMS, ...MQ_ITEMS].map((n, i) => (
            <span key={i} style={{ fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", color: "#3a2060", letterSpacing: "0.22em", whiteSpace: "nowrap" }}>{n}</span>
          ))}
        </div>
      </div>

      {/* Sections */}
      <section id="skills" style={{ padding: "180px 5%", background: "rgba(8, 5, 16, 0.65)", scrollSnapAlign: "start", position: "relative", zIndex: 1 }}>
        <FadeUp><Label>Expertise</Label></FadeUp>
        <ParallaxWrapper speed={-0.05}>
          <h2 className="section-title">The tools I <em>master.</em></h2>
        </ParallaxWrapper>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem" }}>
          {SKILLS.map((sk, i) => (
            <ScrollGlowWrapper key={i}>
              <div className="skill-card-neo" style={{ padding: "2.5rem", borderRadius: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#a855f7" }} />
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", color: "#d8e4ff", letterSpacing: "0.1em" }}>{sk.cat}</span>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
                  {sk.items.map((it, j) => (
                    <span key={j} className="skill-badge" style={{ background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.12)", padding: "0.4rem 1rem", borderRadius: "100px", fontSize: "0.75rem", color: "#9c7fce" }}>{it}</span>
                  ))}
                </div>
              </div>
            </ScrollGlowWrapper>
          ))}
        </div>
      </section>

      <section id="experience" style={{ padding: "180px 5%", background: "rgba(16, 12, 31, 0.65)", scrollSnapAlign: "start", position: "relative", zIndex: 1, borderTop: "1px solid rgba(124,58,237,0.1)", borderBottom: "1px solid rgba(124,58,237,0.1)" }}>
        <FadeUp><Label>Career</Label></FadeUp>
        <ParallaxWrapper speed={-0.05}>
          <h2 className="section-title">Where <em>code</em> meets production.</h2>
        </ParallaxWrapper>
        <div style={{ background: "#080510", borderRadius: "28px", border: "1px solid rgba(124,58,237,0.15)", overflow: "hidden" }}>
          <div style={{ padding: "2.5rem", background: "linear-gradient(135deg,#3b1a8c,#7c3aed)", color: "#fff" }}>
            <div style={{ fontSize: "1.6rem", fontWeight: 600 }}>Full Stack Developer</div>
            <div style={{ fontStyle: "italic", opacity: 0.8, fontSize: "0.95rem" }}>R2S Tech Solutions · Nov 2025 – Present</div>
          </div>
          <div style={{ padding: "2rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1rem" }}>
            {EXP.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "1rem", padding: "1.2rem", background: "rgba(124,58,237,0.04)", borderRadius: "14px", border: "1px solid rgba(124,58,237,0.08)" }}>
                <span style={{ fontSize: "1.2rem" }}>{item.icon}</span>
                <span style={{ fontSize: "0.82rem", color: "#6b5a8e", lineHeight: 1.65 }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" style={{ padding: "180px 5%", background: "rgba(8, 5, 16, 0.65)", scrollSnapAlign: "start", position: "relative", zIndex: 1 }}>
        <FadeUp><Label>Gallery</Label></FadeUp>
        <ParallaxWrapper speed={-0.05}>
          <h2 className="section-title">Projects that <em>solve</em> problems.</h2>
        </ParallaxWrapper>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "3rem" }}>
          {PROJECTS.map((p, i) => (
            <ScrollGlowWrapper key={i}>
              <div className="card-proj" style={{ borderRadius: "26px", overflow: "hidden", border: "1px solid rgba(124,58,237,0.14)", background: "#100c1f", display: "flex", flexDirection: "column" }}>
              <div style={{ height: "240px", background: p.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4.5rem", position: "relative" }}>
                <span style={{ position: "absolute", top: "1.5rem", left: "1.5rem", fontSize: "1rem", fontWeight: 800, opacity: 0.2, color: "#fff" }}>0{i+1}</span>
                {p.icon}
              </div>
              <div style={{ padding: "2.2rem", flex: 1, display: "flex", flexDirection: "column" }}>
                {p.badge && (
                  <div style={{ 
                    display: "inline-flex", alignItems: "center", gap: "0.5rem", 
                    padding: "0.4rem 1rem", borderRadius: "100px", 
                    background: p.isLive ? "rgba(16,185,129,0.06)" : "rgba(124,58,237,0.08)",
                    border: p.isLive ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(124,58,237,0.15)",
                    marginBottom: "1.2rem", width: "fit-content"
                  }}>
                    {p.isLive && <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981", boxShadow: "0 0 10px #10b981", animation: "pulse 2s infinite" }} />}
                    <span style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.15em", color: p.isLive ? "#10b981" : "#a855f7" }}>{p.badge}</span>
                  </div>
                )}
                
                <h3 style={{ fontSize: "1.6rem", color: "#d8e4ff", marginBottom: p.subtitle ? "0.3rem" : "0.8rem", fontWeight: 700 }}>{p.title}</h3>
                {p.subtitle && <p style={{ fontSize: "0.85rem", color: "#6b5a8e", marginBottom: "1rem", letterSpacing: "0.05em", fontWeight: 500, fontFamily: "monospace" }}>{p.subtitle}</p>}
                
                <p style={{ fontSize: "0.88rem", color: "#8c82a5", lineHeight: 1.75, marginBottom: "1.6rem", flex: 1 }}>{p.desc}</p>

                {p.perfStats && (
                  <div style={{ 
                    display: "grid", gridTemplateColumns: "repeat(3, 1fr)", 
                    background: "rgba(124,58,237,0.03)", padding: "1.5rem 1rem", 
                    borderRadius: "16px", border: "1px solid rgba(124,58,237,0.1)", 
                    marginBottom: "1.5rem", textAlign: "center" 
                  }}>
                    {p.perfStats.map((ps, idx) => (
                      <div key={idx} style={{ borderRight: idx < 2 ? "1px solid rgba(124,58,237,0.1)" : "none" }}>
                        <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#10b981" }}>{ps.val}</div>
                        <div style={{ fontSize: "0.55rem", fontWeight: 700, color: "#5b4e7a", letterSpacing: "0.1em", marginTop: "0.3rem" }}>{ps.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.2rem" }}>
                  {p.tags.map((t, j) => <span key={j} style={{ fontSize: "0.65rem", padding: "0.4rem 0.8rem", background: "rgba(124,58,237,0.06)", border: "1px solid rgba(124,58,237,0.1)", borderRadius: "8px", color: "#c084fc", fontWeight: 600 }}>{t}</span>)}
                </div>
                <div style={{ color: "#a855f7", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.05em", opacity: 0.8 }}>{p.stat}</div>
              </div>
            </div>
          </ScrollGlowWrapper>
          ))}
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", background: "#100c1f", borderTop: "1px solid rgba(124,58,237,0.15)" }}>
        {STATS.map((s, i) => <StatCell key={i} s={s} last={i === STATS.length - 1} />)}
      </section>

      <section id="education" style={{ padding: "120px 5%", background: "#080510" }}>
        <FadeUp><Label>Background</Label></FadeUp>
        <h2 className="section-title">Academic <em>milestones.</em></h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "4rem" }}>
          <div>
            <div className="section-subtitle">Academic</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="edu-card" style={{ padding: "2rem", background: "#100c1f", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "18px" }}>
                <div style={{ color: "#a855f7", fontSize: "0.75rem", fontWeight: 700, marginBottom: "0.6rem" }}>2020 – 2024</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 600, color: "#d8e4ff", marginBottom: "0.4rem" }}>B.E. Computer Science</div>
                <div style={{ fontSize: "0.9rem", color: "#6b5a8e", marginBottom: "1.2rem" }}>Hindusthan College of Engineering & Technology</div>
                <div style={{ color: "#a855f7", fontWeight: 700, fontSize: "0.85rem", background: "rgba(168,85,247,0.1)", padding: "0.5rem 1rem", borderRadius: "100px", display: "inline-block" }}>CGPA 8.41 / 10</div>
              </div>
            </div>
          </div>
          <div>
            <div className="section-subtitle">Certifications</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {CERTS.map((c, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "1.3rem", padding: "1.4rem", background: "#100c1f", border: "1px solid rgba(124,58,237,0.12)", borderRadius: "18px" }}>
                  <span style={{ fontSize: "1.6rem" }}>{c.e}</span>
                  <div>
                    <div style={{ fontWeight: 600, color: "#d8e4ff", fontSize: "0.95rem" }}>{c.name}</div>
                    <div style={{ fontSize: "0.78rem", color: "#6b5a8e" }}>{c.org}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" style={{ padding: "120px 5%", background: "#0d091a", borderTop: "1px solid rgba(124,58,237,0.15)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "5rem" }}>
          <div>
            <FadeUp><Label>Ready?</Label></FadeUp>
            <h2 className="section-title">Let's build<br/>something <em>new.</em></h2>
            <p style={{ color: "#6b5a8e", marginBottom: "2.5rem", lineHeight: 1.8, fontSize: "1rem" }}>
              Have a question or a project idea? Feel free to reach out. I'm always open to new opportunities.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              {CONTACT_INFO.map((c, i) => (
                <a key={i} href={c.href || "#"} className="ct-link" style={{ display: "flex", alignItems: "center", gap: "1.2rem", textDecoration: "none", color: "#d8e4ff" }}>
                  <span style={{ fontSize: "1.4rem" }}>{c.e}</span>
                  <div>
                    <div style={{ fontSize: "0.68rem", color: "#6b5a8e", textTransform: "uppercase", letterSpacing: "0.05em" }}>{c.label}</div>
                    <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{c.val}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div style={{ background: "#100c1f", padding: "3rem", borderRadius: "28px", border: "1px solid rgba(124,58,237,0.16)", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <ContactForm />
          </div>
        </div>
      </section>

      <footer style={{ padding: "2.5rem 5%", background: "#080510", borderTop: "1px solid rgba(124,58,237,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
        <div style={{ fontSize: "0.8rem", color: "#3a2060" }}>© 2025 Deepan P. Tiruchirappalli, TN.</div>
        <div style={{ fontSize: "0.8rem", color: "#6b5a8e", fontWeight: 500 }}>Developer Portfolio · Built with React</div>
      </footer>
    </>
  );
}
