import { Link } from 'react-router-dom';
import '../css/latest_news.css';

interface NewsItem {
    date: string;
    dateLabel: string;
    category: string;
    title: string;
    summary: string;
    href: string;
    linkLabel: string;
    featured?: boolean;
}

const newsItems: NewsItem[] = [
    {
        date: '2026-09-18',
        dateLabel: '18. sep',
        category: 'Galleri',
        title: 'Nye bilder i Støttegruppen',
        summary: 'Galleri-siden har fått en ny oppslagstavle og plass til flere bilder fra livet vårt sammen.',
        href: '/gallery/støttegruppen',
        linkLabel: 'Se galleriet',
        featured: true,
    },
    {
        date: '2026-09-15',
        dateLabel: '15. sep',
        category: 'Arrangement',
        title: 'Bønn & Kaffe nærmer seg',
        summary: 'Vi møtes til bønn, prat og god kaffe 20. september. Alle er velkommen.',
        href: '/arrangementer',
        linkLabel: 'Se arrangementer',
    },
    {
        date: '2026-09-10',
        dateLabel: '10. sep',
        category: 'Fellesskap',
        title: 'Bli bedre kjent med gjengen',
        summary: 'Trykk på et profilkort på «Om oss» for å lese litt mer om menneskene bak gruppen.',
        href: '/om-oss',
        linkLabel: 'Møt oss',
    },
    {
        date: '2026-09-05',
        dateLabel: '05. sep',
        category: 'På tavla',
        title: 'Har du et oppslag til siden?',
        summary: 'Ta kontakt dersom du har en idé, en oppdatering eller noe hyggelig du vil dele med gruppen.',
        href: '/kontakt',
        linkLabel: 'Ta kontakt',
    },
];

const LatestNews = () => (
    <div className="page-content news-page">
        <header className="news-header">
            <div>
                <p className="news-kicker">Oppslagstavle</p>
                <h1>Siste nytt</h1>
                <p className="news-intro">Små og store ting som skjer i Kristen Støttegruppe.</p>
            </div>
            <div className="news-header-stamp" aria-label="Sist oppdatert 18. september 2026">
                <span>NYTT</span>
                <strong>18.09</strong>
            </div>
        </header>

        <section className="news-board" aria-labelledby="news-board-title">
            <div className="news-board-topline">
                <h2 id="news-board-title">På tavla</h2>
                <span>Kristen Støttegruppe</span>
            </div>
            <div className="news-list">
                {newsItems.map((item) => (
                    <article key={item.title} className={`news-item${item.featured ? ' news-item-featured' : ''}`}>
                        <time className="news-date" dateTime={item.date}>
                            <span>{item.dateLabel}</span>
                            <small>2026</small>
                        </time>
                        <div className="news-item-content">
                            <p className="news-category">{item.category}</p>
                            <h3>{item.title}</h3>
                            <p className="news-summary">{item.summary}</p>
                            <Link to={item.href} className="news-link">{item.linkLabel} »</Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    </div>
);

export default LatestNews;