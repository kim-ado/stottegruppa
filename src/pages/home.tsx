const Home = () => (
  <div className="page-content">
    <section className="hero-section">
      <img src="/images/cross.png" alt="Kors" className="hero-cross" />
      <h1>Velkommen til Kristen Støttegruppe</h1>
      <p className="hero-tagline">Sammen i tro, fellesskap og glede</p>
    </section>

    <hr className="section-divider" />

    <section className="welcome-section">
      <h2>Hvem er vi?</h2>
      <p>
        Kristen Støttegruppe er en gjeng venner som deler troen, latteren og livet sammen.
        Vi møtes for å støtte hverandre, utforske troen og ha det gøy på veien.
        Enten du er ny i troen eller har gått i mange år — her er det plass til deg!
      </p>
    </section>

    <hr className="section-divider" />

    <section className="verse-section">
      <h2>Dagens vers</h2>
      <blockquote className="daily-verse">
        <p>&ldquo;For jeg vet de tanker jeg tenker om dere, sier Herren.
          Det er tanker til fred og ikke til ulykke.
          Jeg vil gi dere fremtid og håp.&rdquo;</p>
        <cite>— Jeremia 29:11</cite>
      </blockquote>
    </section>

    <hr className="section-divider" />


  </div>
);

export default Home;
