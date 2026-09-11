import '../css/events.css';

interface Event {
  date: string;
  title: string;
  location: string;
  description: string;
  upcoming: boolean;
}

const events: Event[] = [
  {
    date: '2026-09-20',
    title: 'Bønn & Kaffe',
    location: 'Stua til Tobias',
    description: 'Vi samles for bønn, prat og god kaffe. Alle er velkommen!',
    upcoming: true,
  },
  {
    date: '2026-10-04',
    title: 'Grillkveld i hagen',
    location: 'Hos Maren og Phillip',
    description: 'Sesongens siste grillkveld. Ta med godt humør og en salat til deling.',
    upcoming: true,
  },
  {
    date: '2026-10-18',
    title: 'Filmkveld: «Livets mening»',
    location: 'Storsalen',
    description: 'Vi ser en film sammen og diskuterer temaene etterpå. Popcorn inkludert!',
    upcoming: true,
  },
  {
    date: '2026-11-01',
    title: 'Felles søndagsgudstjeneste',
    location: 'Kirken',
    description: 'Vi går sammen som gruppe til søndagsgudstjenesten og spiser lunsj etterpå.',
    upcoming: true,
  },
  {
    date: '2026-11-15',
    title: 'Vinteravslutning',
    location: 'Hytta til Magnus',
    description: 'Helgetur med brettspill, god mat og fellesskap. Påmelding åpner snart!',
    upcoming: true,
  },
  {
    date: '2026-06-15',
    title: 'Sommertur til fjells',
    location: 'Preikestolen',
    description: 'Vi gikk til Preikestolen sammen — en fantastisk tur med strålende vær!',
    upcoming: false,
  },
  {
    date: '2026-05-01',
    title: '1. Mai frokost',
    location: 'Kim sitt sted',
    description: 'Felles frokost og feiring av dagen. God stemning og pannekaker!',
    upcoming: false,
  },
  {
    date: '2026-03-22',
    title: 'Påskeverksted',
    location: 'Storsalen',
    description: 'Vi lagde påskepynt og hadde quiz. Vinnerlaget fikk sjokolade!',
    upcoming: false,
  },
];

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('no-NO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const Events = () => (
  <div className="page-content">
    <h1>Arrangementer</h1>
    <p>Her er en oversikt over hva som skjer i støttegruppa.</p>

    <hr className="section-divider" />

    <section>
      <h2>Kommende arrangementer</h2>
      <div className="events-list">
        {events
          .filter((e) => e.upcoming)
          .map((e, i) => (
            <div key={i} className="card-2000s event-card">
              <div className="event-date">{formatDate(e.date)}</div>
              <h3>{e.title}</h3>
              <p className="event-location">Sted: {e.location}</p>
              <p>{e.description}</p>
            </div>
          ))}
      </div>
    </section>

    <hr className="section-divider" />

    <section>
      <h2>Tidligere arrangementer</h2>
      <div className="events-list">
        {events
          .filter((e) => !e.upcoming)
          .map((e, i) => (
            <div key={i} className="card-2000s event-card past-event">
              <div className="event-date">{formatDate(e.date)}</div>
              <h3>{e.title}</h3>
              <p className="event-location">Sted: {e.location}</p>
              <p>{e.description}</p>
            </div>
          ))}
      </div>
    </section>
  </div>
);

export default Events;
