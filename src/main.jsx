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

function Arrow({ down = false }) {
  return <span className={`arrow ${down ? 'down' : ''}`}>↗</span>;
}

function App() {
  const [active, setActive] = useState('All');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState(null);

  const filters = ['All', ...collections.map(c => c.name)];
  const visible = useMemo(
  () => active === 'All'
    ? orderedAllPhotos
    : allPhotos.filter(p => p.collection === active),
  [active]
);

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
  }, [lightbox]);

  const nextPhoto = (current, direction) => {
    const list = active === 'All' ? allPhotos : allPhotos.filter(p => p.collection === active);
    const i = list.findIndex(p => p.src === current?.src);
    return list[(i + direction + list.length) % list.length];
  };

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
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
        <button className="book top-book" onClick={() => scrollTo('contact')}>BOOK A SHOOT</button>
        <button className="menu" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle menu">{menuOpen ? '×' : '☰'}</button>
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
            <h2>SPORT IS<br/><span>STORY.</span></h2>
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
                 <img 
                         src="/images/about-me.jpg" 
                        alt="about-me" 
                />
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
          <div><p className="eyebrow orange">LET'S CREATE MEMORIES</p><h2>HAVE A SHOOT<br/><span>IN MIND?</span></h2></div>
          <div className="contact-side">
            <p>Tell me what you're shooting, where it is and what you need the images to do. I'll get back to you with availability and a tailored approach.</p>
            <div className="socials"><a href="https://www.instagram.com/atshots.pg/" target="_blank" rel="noopener noreferrer">INSTAGRAM</a><a href="https://mail.google.com/mail/?view=cm&fs=1&to=albamo142@gmail.com" target="_blank" rel="noopener noreferrer">EMAIL</a></div>
          </div>
        </section>
      </main>

      <footer><span>© {new Date().getFullYear()} <b>ALBERT AMOAKO | SPORT</b></span><span><b>SPORTS PHOTOGRAPHY / LONDON</b></span><button onClick={() => scrollTo('home')}>BACK TO TOP ↑</button></footer>

      {lightbox && <div className="lightbox" role="dialog" aria-modal="true" onClick={() => setLightbox(null)}>
        <button className="close" onClick={() => setLightbox(null)} aria-label="Close">×</button>
        <button className="lb-prev" onClick={(e) => { e.stopPropagation(); setLightbox(nextPhoto(lightbox, -1)); }}>←</button>
        <figure onClick={e => e.stopPropagation()}>
          <img src={lightbox.src} alt={`${lightbox.collection} — ${lightbox.title}`} />
          <figcaption><b>{lightbox.collection}</b><span>{lightbox.title}</span></figcaption>
        </figure>
        <button className="lb-next" onClick={(e) => { e.stopPropagation(); setLightbox(nextPhoto(lightbox, 1)); }}>→</button>
      </div>}
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    