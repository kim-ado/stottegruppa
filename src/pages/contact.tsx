import { useState } from 'react';
import '../css/contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Kontaktskjema:', { name, email, message });
    setSent(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="page-content">
      <h1>Kontakt oss</h1>
      <p>Har du spørskål, forslag eller vil bare si hei? Send oss en melding!</p>

      <hr className="section-divider" />

      <div className="contact-layout">
        <div className="contact-info card-2000s">
          <h2>Kontaktinformasjon</h2>
          <div className="contact-item">
            <strong>E-post:</strong>
            <span>kontakt@kristenstottegruppe.no</span>
          </div>
          <div className="contact-item">
            <strong>Telefon:</strong>
            <span>+47 123 45 678</span>
          </div>
          <div className="contact-item">
            <strong>Adresse:</strong>
            <span>Kirkeveien 1, 4610 Kristiansand</span>
          </div>
          <div className="contact-item">
            <strong>Sosiale medier:</strong>
            <span>@kristenstottegruppe</span>
          </div>

          <hr className="section-divider" />

          <h2>Åpningstider</h2>
          <p>Tirsdag: 18:00 — 20:00</p>
          <p>Torsdag: 18:00 — 20:00</p>
          <p>Søndag: Etter gudstjenesten</p>
        </div>

        <form className="contact-form card-2000s" onSubmit={handleSubmit}>
          <h2>Send melding</h2>
          {sent && (
            <p className="success-msg">
              Takk for meldingen! Vi svarer så snart vi kan.
            </p>
          )}
          <label htmlFor="name">Navn:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label htmlFor="email">E-post:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="message">Melding:</label>
          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" className="btn-2000s">
            Send melding
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
