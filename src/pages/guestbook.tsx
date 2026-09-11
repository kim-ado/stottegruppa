import '../css/guestbook.css';

interface GuestbookEntry {
  name: string;
  date: string;
  message: string;
}

const entries: GuestbookEntry[] = [
  {
    name: 'Tobias',
    date: '10. september 2026',
    message: 'Så flott side! Gud velsigne dere alle sammen.',
  },
  {
    name: 'Maria',
    date: '8. september 2026',
    message: 'Elsker denne gjengen! Dere er de beste.',
  },
  {
    name: 'Frederick',
    date: '5. september 2026',
    message: 'Bærum neste! Men først — mer kaffe.',
  },
  {
    name: 'Maren',
    date: '1. september 2026',
    message: 'Kjempebra initiativ med nettsiden. Stolt av dere!',
  },
  {
    name: 'Kim',
    date: '28. august 2026',
    message: 'Husk å følge oss på Instagram også da!',
  },
  {
    name: 'Magnus',
    date: '25. august 2026',
    message: 'Gleder meg til neste arrangement. Det blir bra!',
  },
  {
    name: 'Anonym',
    date: '20. august 2026',
    message: 'Fant denne siden tilfeldig. Veldig fin atmosfære her!',
  },
];

const Guestbook = () => (
  <div className="page-content">
    <h1>Gjestebok</h1>
    <p>Skriv en hilsen til oss! Vi setter pris på alle ord.</p>

    <hr className="section-divider" />

    <div className="guestbook-entries">
      {entries.map((entry, i) => (
        <div key={i} className="card-2000s guestbook-entry">
          <div className="entry-header">
            <strong>{entry.name}</strong>
            <span className="entry-date">{entry.date}</span>
          </div>
          <p>{entry.message}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Guestbook;
