// src/components/LandingPage.js
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';
import teamImg from './assets/Team.jpg';
import partners from './assets/Partners.jpg';
import AOS from 'aos';
import 'aos/dist/aos.css';

const LandingPage = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="landing-container">
      <section className="hero" data-aos="zoom-in" data-aos-duration="800">
        <div className="hero-content">
          <h1 className="hero-title">
  <span className="bulb">💡</span>
  <span className="shine-text"> Unleash your creativity</span>
</h1>
          <p>
            Join the future of content. Secure your work on-chain, earn without middlemen, and thrive in a decentralized world powered by Internet Computer Protocol.

          </p>
          <Link to="/login" className="hero-btn">🚀 Get Started</Link>
        </div>
      </section>

      <section className="benefits" data-aos="fade-up">
        <h2>Why Choose DecentMonetize?</h2>
        <ul>
          <li><strong>Immutable Ownership:</strong> Your content is timestamped and protected on-chain.</li>
          <li><strong>Smart Payments:</strong> Automatic and direct revenue sharing using blockchain.</li>
          <li><strong>Fair Economics:</strong> No middlemen. You earn what you deserve.</li>
        </ul>
      </section>

      <section className="how-it-works" data-aos="fade-up">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1️⃣ Register</h3>
            <p>Sign up using Internet Identity or Plug Wallet.</p>
          </div>
          <div className="step">
            <h3>2️⃣ Upload</h3>
            <p>Share content and secure ownership with cryptographic hashing.</p>
          </div>
          <div className="step">
            <h3>3️⃣ Earn</h3>
            <p>Smart contracts manage sales, royalties, and access control.</p>
          </div>
        </div>
      </section>

      <section className="examples" data-aos="fade-up">
        <h2>Use Cases</h2>
        <div className="cards">
          <div><h3>🎵 Music</h3><p>Artists monetize tracks independently without record labels.</p></div>
          <div><h3>📝 Blogging</h3><p>Writers earn crypto rewards for informative content.</p></div>
          <div><h3>📹 Video</h3><p>Creators get paid per view without ads or sponsors.</p></div>
        </div>
      </section>

      <section className="team-section" data-aos="fade-up">
        <h2>Meet the Team</h2>
        <img src={teamImg} alt="Our Team" className="team-image" />
      </section>

      <section className="partners" data-aos="fade-up">
        <h2>Our Collaborators</h2>
        <img src={partners} alt="Partners and Supporters" className="partner-logos" />
      </section>

      <section className="testimonials" data-aos="fade-up">
        <h2>User Voices</h2>
        <div className="testi">
          <p>“This platform helped me launch my poetry into the world — and get paid for it!”</p>
          <span>- Kriti, Indie Author</span>
        </div>
        <div className="testi">
          <p>“Finally a place where my designs are protected and sold on my terms.”</p>
          <span>- Ajay, Freelance Illustrator</span>
        </div>
      </section>

      <footer className="landing-footer">
        <p>📧 support@decentmonetize.com | 🌐 decentmonetize.com</p>
        <p>📃 <Link to="/terms">Terms & Conditions</Link> | Privacy Policy | © 2025 Purushottam, Shretimanegi, Sai Ganesh</p>
      </footer>
    </div>
  );
};

export default LandingPage;