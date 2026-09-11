import '../css/footer.css';

const Footer = () => (
  <footer className="site-footer">
    <div className="marquee-bar">
      <span className="marquee-inner">
        Velkommen til Kristen Støttegruppe! Sammen i tro, fellesskap og glede. Besøk oss gjerne igjen!
      </span>
    </div>
    <div className="footer-content">
      <div className="footer-links">
        <a href="/">Hjem</a>
        <span className="footer-sep">|</span>
        <a href="/om-oss">Om oss</a>
        <span className="footer-sep">|</span>
        <a href="/gallery">Galleri</a>
        <span className="footer-sep">|</span>
        <a href="/sitater">Sitater</a>
        <span className="footer-sep">|</span>
        <a href="/kontakt">Kontakt</a>
      </div>
      <div className="visitor-counter">
        <span>Du er besøkende #</span>
        <span className="counter-number">00147</span>
      </div>
      <p className="footer-copy">
        &copy; 2026 Kristen Støttegruppe. Alle rettigheter reservert.
      </p>
      <p className="footer-ie">
        Best viewed in Internet Explorer 6.0 — 1024x768
      </p>
    </div>
  </footer>
);

export default Footer;
