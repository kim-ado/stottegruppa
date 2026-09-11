import '../css/quotes.css';

interface Quote {
  text: string;
  reference: string;
  category: string;
}

const quotes: Quote[] = [
  {
    text: 'For jeg vet de tanker jeg tenker om dere, sier Herren. Det er tanker til fred og ikke til ulykke. Jeg vil gi dere fremtid og håp.',
    reference: 'Jeremia 29:11',
    category: 'Håp',
  },
  {
    text: 'Herren er min hytte, jeg mangler ikke noe. Han lar meg ligge i grønne enger, Han leder meg til vann der jeg finner hvile.',
    reference: 'Salme 23:1-2',
    category: 'Trøst',
  },
  {
    text: 'Alt makter jeg i Ham som gjør meg sterk.',
    reference: 'Filipperne 4:13',
    category: 'Styrke',
  },
  {
    text: 'Vær ikke bekymret for noe, men la i alle ting deres begjæringer komme fram for Gud i påkallelse og bønn med takksigelse.',
    reference: 'Filipperne 4:6',
    category: 'Tro',
  },
  {
    text: 'For så høyt har Gud elsket verden at Han gav sin Sønn, den enbårne, for at hver den som tror på Ham, ikke skal gå fortapt, men ha evig liv.',
    reference: 'Johannes 3:16',
    category: 'Kjærlighet',
  },
  {
    text: 'Stol på Herren av hele ditt hjerte, og stol ikke på din egen forstand. Kjenn Ham på alle dine veier, så skal Han gjøre dine stier rette.',
    reference: 'Ordspråkene 3:5-6',
    category: 'Tro',
  },
  {
    text: 'Han gir den trette kraft, og den som ikke har krefter, gir Han stor styrke.',
    reference: 'Jesaja 40:29',
    category: 'Styrke',
  },
  {
    text: 'Vær modig og sterk! Vær ikke redd, og vær ikke skrekkslagen! For Herren din Gud er med deg overalt hvor du går.',
    reference: 'Josva 1:9',
    category: 'Mot',
  },
  {
    text: 'Be, så skal dere få. Let, så skal dere finne. Bank på, så skal det bli lukket opp for dere.',
    reference: 'Matteus 7:7',
    category: 'Bønn',
  },
  {
    text: 'Men frukten av Ånden er kjærlighet, glede, fred, langmodighet, vennlighet, godhet, trofasthet, ydmykhet, selvbeherskelse.',
    reference: 'Galaterne 5:22-23',
    category: 'Livet',
  },
  {
    text: 'Kom til meg, alle som strever og har tungt å bære, og jeg vil gi dere hvile.',
    reference: 'Matteus 11:28',
    category: 'Trøst',
  },
  {
    text: 'Herren er mitt lys og min frelse. Hvem skal jeg frykte? Herren er mitt livs vern. Hvem skal jeg være redd for?',
    reference: 'Salme 27:1',
    category: 'Mot',
  },
];

const Quotes = () => (
  <div className="page-content">
    <h1>Sitater &amp; Vers</h1>
    <p className="quotes-intro">
      Ord som inspirerer, trøster og gir oss styrke i hverdagen.
    </p>

    <hr className="section-divider" />

    <div className="quotes-grid">
      {quotes.map((q, i) => (
        <div key={i} className="card-2000s quote-card">
          <span className="quote-category">{q.category}</span>
          <blockquote>
            <p>&ldquo;{q.text}&rdquo;</p>
          </blockquote>
          <cite>— {q.reference}</cite>
        </div>
      ))}
    </div>
  </div>
);

export default Quotes;
