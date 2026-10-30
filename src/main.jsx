import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { collections } from './photos';
import './styles.css';

const allPhotos = collections.flatMap(c =>
  c.photos.map((p, i) => ({
    ...p,
    collection: c.name,
    collectionSlug: c.slug,
    index: i
  }))
);

const featuredOrder = ['IMG 3369','IMG 0452', 'IMG 3411', 'IMG 3043', 'IMG 5656', 'IMG 0445','IMG 5652','IMG 6028'];

const orderedAllPhotos = [
  ...featuredOrder
    .map(title => allPhotos.find(photo => photo.title === title))
    .filter(Boolean),
  ...allPhotos.filter(photo => !featuredOrder.includes(photo.title))
];
const hero = { src: '/images/padel/hero_landscape.jpg', title: 'Hero', collection: 'PADEL', alt: 'Featured sports photograph' };

const EMAIL = 'albamo142@gmail.com';
const IG_HANDLE = 'atshots.pg';
const FORM_URL = 'https://formspree.io/f/YOUR_FORM_ID'; // <-- paste your Formspree ID here
const SHOOT_TYPES = ['Match day', 'Brand / Campaign', 'Portrait', 'Event', 'Other'];
const EMPTY_FORM = { name: '', email: '', type: '', date: '', details: '', _gotcha: '' };

function Arrow({ down = false }) {
  return <span className={`arrow ${down ? 'down' : ''}`}>↗</span>;
}

function App() {
  const [active, setActive] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const filters = ['All', ...collections.map(c => c.name)];
  const visible = useMemo(
    () => active === 'All'
      ? orderedAllPhotos
      : allPhotos.filter(p => p.collection === active),
    [active]
  );

  const nextPhoto = (current, direction) => {
    const list = active === 'All' ? orderedAllPhotos : allPhotos.filter(p => p.collection === active);
    const i = list.findIndex(p => p.src === current?.src);
    return list[(i + direction + list.length) % list.length];
  };

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightbox]);

  useEffect(() => {
    const onKey = (e) => {
      if (!lightbox) return;
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox(prev => nextPhoto(prev, 1));
      if (e.key === 'ArrowLeft') setLightbox(prev => nextPhoto(prev, -1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox, active]);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(false);
    window.addEventListener('scroll', close, { passive: true });
    return () => window.removeEventListener('scroll', close);
  }, [menuOpen]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  const sendEnquiry = async (e) => {
    e.preventDefault();
    if (form._gotcha) return; // spam bots fill the hidden field
    setStatus('sending');
    try {
      const res = await fetch(FORM_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          shoot_type: form.type || 'Not specified',
          shoot_date: form.date || 'Not specified',
          details: form.details,
          _subject: `New shoot enquiry: ${form.type || 'General'}`
        })
      });
      if (!res.ok) throw new Error('Request failed');
      setStatus('sent');
      setForm(EMPTY_FORM);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="site">
      <header className="nav">
        <button className="brand" onClick={() => scrollTo('home')} aria-label="Go to top">
          <span>ALBERT AMOAKO</span><em>SPORT</em>
        </button>
        <nav className={menuOpen ? 'open' : ''}>
          <button onClick={() => scrollTo('work')}>WORK</button>
          <button onClick={() => scrollTo('about')}>ABOUT</button>
          <button onClick={() => scrollTo('contact')}>CONTACT</button>
        </nav>
        <button
          className="menu"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </header>

      <main>
        <section id="home" className="hero">
          <img className="hero-image" src={hero.src} alt="Featured sports photograph" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow"><span /> SPORTS PHOTOGRAPHER <b>·</b> FOOTBALL / BRAND / LIVE SPORT</p>
            <h1><span>  A </span><strong> MAN </strong> <span> OF ART</span></h1>
            <div className="hero-bottom">
              <p><b>Your story, captured in every frame. Every picture tells a different story.</b></p>
              <button className="portfolio-link" onClick={() => scrollTo('work')}>VIEW THE PORTFOLIO <Arrow /></button>
            </div>
          </div>
        </section>

        <section id="about" className="about section dark-section">
          <div className="about-number">01</div>
          <div className="about-copy">
            <p className="eyebrow orange">ABOUT ME</p>
            <h2>SPORT TELLS<br/><span>STORIES</span></h2>
            <p className="lead">
              <b>TIME WILL TELL</b>
            </p>
            <p>
              I'm Albert Amoako, an 18 year old London-based sports photographer focused on capturing the energy, emotion, and intensity behind every moment.
              From a man behind the lens, I create pictures that turns beautiful moments into lasting memories.
            </p>
            <button className="text-link" onClick={() => scrollTo('contact')}>LET'S WORK TOGETHER <Arrow /></button>
          </div>
          <div className="about-image">
            <img src="/images/about-me.jpg" alt="about-me" />
          </div>
        </section>

        <section id="work" className="work section">
          <div className="section-head">
            <div className="about-number">02</div>
            <div><p className="eyebrow orange"><b>THE MASTERPIECES</b></p><h2>MY WORK</h2></div>
            <p className="section-intro">A collection of stories, campaigns, portraits and moments from the world of sport.</p>
          </div>
          <div className="filters" role="tablist" aria-label="Portfolio categories">
            {filters.map(f => <button key={f} className={active === f ? 'active' : ''} onClick={() => setActive(f)}>{f}</button>)}
          </div>
          <div className="masonry">
            {visible.map((photo, i) => (
              <button className={`photo-card card-${i % 7}`} key={photo.src} onClick={() => setLightbox(photo)}>
                <img src={photo.src} alt={`${photo.collection} — ${photo.title}`} loading={i < 8 ? 'eager' : 'lazy'} />
                <span className="photo-meta"><b>{photo.collection}</b><small>{photo.title}</small></span>
              </button>
            ))}
          </div>
        </section>

        <section className="statement">
          <p>EVERY SHOOT HAS A STORY TO TELL<br/><span>MAKE IT COUNT.</span></p>
        </section>

        <section id="contact" className="contact section dark-section">
          <div className="contact-main">
            <p className="eyebrow orange">LET'S CREATE MEMORIES</p>
            <h2>HAVE A SHOOT<br /><span>IN MIND?</span></h2>
            <p className="contact-intro">
              Tell me what you're shooting, where it is and what you need the images to do.
              I'll get back to you with availability and a tailored approach.
            </p>

            <div className="contact-meta">
              <span><i className="dot" /> Taking bookings</span>
              <span>London &amp; UK</span>
              <span>Replies within 24h</span>
            </div>

            <div className="channels">
              <a
                className="channel primary"
                href={`https://ig.me/m/${IG_HANDLE}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="ig-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
                </svg>
                <span className="channel-text">
                  <small>FASTEST REPLY</small>
                  <b>DM @{IG_HANDLE} on Instagram</b>
                </span>
                <Arrow />
              </a>

              <a className="channel" href={`mailto:${EMAIL}`}>
                <span className="channel-icon">@</span>
                <span className="channel-text">
                  <small>EMAIL</small>
                  <b>{EMAIL}</b>
                </span>
                <Arrow />
              </a>
            </div>

            <div className="socials">
              <a href={`https://www.instagram.com/${IG_HANDLE}/`} target="_blank" rel="noopener noreferrer">VIEW INSTAGRAM</a>
              <button type="button" onClick={copyEmail}>{copied ? 'COPIED ✓' : 'COPY EMAIL'}</button>
            </div>
          </div>

          {status === 'sent' ? (
            <div className="contact-form form-success" role="status">
              <span className="success-tick">✓</span>
              <h3>Message sent.</h3>
              <p>Thanks for getting in touch. I'll reply within 24 hours.</p>
              <button type="button" className="text-link" onClick={() => setStatus('idle')}>
                SEND ANOTHER <Arrow />
              </button>
            </div>
          ) : (
            <form className="contact-form" onSubmit={sendEnquiry}>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="name">YOUR NAME</label>
                  <input
                    id="name"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Name or team"
                  />
                </div>
                <div className="field">
                  <label htmlFor="email">YOUR EMAIL</label>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="field">
                <label>WHAT ARE YOU SHOOTING?</label>
                <div className="chips">
                  {SHOOT_TYPES.map(t => (
                    <button
                      type="button"
                      key={t}
                      className={form.type === t ? 'active' : ''}
                      onClick={() => setForm({ ...form, type: form.type === t ? '' : t })}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="field">
                <label htmlFor="date">EVENT DATE (OPTIONAL)</label>
                <input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                />
              </div>

              <div className="field">
                <label htmlFor="details">LOCATION &amp; DETAILS</label>
                <textarea
                  id="details"
                  rows="4"
                  required
                  value={form.details}
                  onChange={e => setForm({ ...form, details: e.target.value })}
                  placeholder="Where is it, and what do you need the photos for?"
                />
              </div>

              {/* Hidden spam trap: real people never see or fill this */}
              <input
                type="text"
                name="_gotcha"
                tabIndex="-1"
                autoComplete="off"
                className="hp"
                aria-hidden="true"
                value={form._gotcha}
                onChange={e => setForm({ ...form, _gotcha: e.target.value })}
              />

              <button type="submit" className="send-btn" disabled={status === 'sending'}>
                {status === 'sending' ? 'SENDING…' : 'SEND ENQUIRY'} <Arrow />
              </button>

              {status === 'error' && (
                <p className="form-error" role="alert">
                  Something went wrong and your message wasn't sent. Try again, or DM @{IG_HANDLE} on Instagram.
                </p>
              )}
            </form>
          )}
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} <b>ALBERT AMOAKO | SPORT</b></span>
        <span><b>SPORTS PHOTOGRAPHY / LONDON</b></span>
        <button onClick={() => scrollTo('home')}>BACK TO TOP ↑</button>
      </footer>

      {lightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
          <button className="close" onClick={() => setLightbox(null)} aria-label="Close">×</button>
          <button className="lb-prev" onClick={(e) => { e.stopPropagation(); setLightbox(nextPhoto(lightbox, -1)); }}>←</button>
          <figure onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={`${lightbox.collection} — ${lightbox.title}`} />
            <figcaption><b>{lightbox.collection}</b><span>{lightbox.title}</span></figcaption>
          </figure>
          <button className="lb-next" onClick={(e) => { e.stopPropagation(); setLightbox(nextPhoto(lightbox, 1)); }}>→</button>
        </div>
      )}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);