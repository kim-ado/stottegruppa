import { useEffect, useState } from 'react';
import '../css/about_us.css';

interface TeamMember {
  name: string;
  title: string;
  img: string;
  description: string;
}

const teamMembers: TeamMember[] = [
  { name: 'Abid Hussain Raja', title: 'Leder', img: '/images/linkedinbilder/Abid_Hussain_Raja.jpg', description: 'Holder retning på gruppen og sørger for at alle blir sett og hørt.' },
  { name: 'Frederick Dahlgren Nilsen', title: 'Medgrunnlegger', img: '/images/linkedinbilder/frederick.jpg', description: 'Var med på å starte gruppen og bygger videre på fellesskapet vårt.' },
  { name: 'Kim Andre Karlsen', title: 'IT-ansvarlig', img: '/images/linkedinbilder/kim.jpg', description: 'Holder de digitale løsningene våre i gang og gjør det enklere å holde kontakten.' },
  { name: 'Maren Paulsen', title: 'Arrangementskoordinator', img: '/images/linkedinbilder/maren.jpg', description: 'Planlegger samlinger og sørger for at det alltid skjer noe hyggelig.' },
  { name: 'Magnus Øgrey', title: 'Menighetskontakt', img: '/images/linkedinbilder/magnus.jpg', description: 'Bygger broer til menigheter og andre fellesskap vi deler troen med.' },
  { name: 'Tobias Vraalsen', title: 'Medlem', img: '/images/linkedinbilder/tobias.jpg', description: 'En del av gjengen som bidrar med energi, erfaringer og godt humør.' },
  { name: 'Phillip Øgrey Finsådal', title: 'Medlem', img: '/images/linkedinbilder/phillip.jpg', description: 'Bidrar til et trygt og inkluderende miljø for hele gruppen.' },
  { name: 'Sebastian Løvaas', title: 'Medlem', img: '/images/linkedinbilder/Sebastian_Løvaas.jpg', description: 'Er med på å skape fellesskap gjennom samtaler, støtte og tilstedeværelse.' },
  { name: 'Thea Aaberge Sanderud', title: 'Medlem', img: '/images/linkedinbilder/Thea_Aaberge_Sanderud.jpg', description: 'Bidrar med varme og engasjement i gruppens hverdag.' },
  { name: 'Silje Haugen', title: 'Medlem', img: '/images/linkedinbilder/Silje_Haugen.jpg', description: 'Er en viktig del av fellesskapet og stiller opp for andre.' },
  { name: 'Eline Grønvold', title: 'Medlem', img: '/images/linkedinbilder/Eline_Grønvold.jpg', description: 'Bidrar til åpne samtaler og et fellesskap med plass til alle.' },
];

const AboutUs = () => {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  useEffect(() => {
    if (!selectedMember) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedMember(null);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedMember]);

  return (
  <div className="page-content about-page">
    <div className="about-header">
      <h1>Om oss</h1>
      <p>
        Vi er en gjeng som møtes for å dele troen, støtte hverandre og ha det gøy sammen.
        Her er menneskene bak Kristen Støttegruppe.
      </p>
    </div>

    <div className="about-story">
      <h2>Vår historie</h2>
      <p>
        Det hele startet som en liten bibelgruppe på et kjøkkenbord. Noen venner som ville
        utforske troen sammen, dele livets opp- og nedturer, og bygge et ekte fellesskap.
        I dag er vi en voksende gjeng som fortsatt tror på det enkle: at vi er sterkere sammen.
      </p>
    </div>

    <p className="group-description">
      <strong>Har du lyst til å bli med?</strong> Alle er velkommen — uansett hvor du er i troen.
      Ta gjerne <a href="/kontakt">kontakt med oss</a> for mer info!
    </p>

    <hr className="section-divider" />

    <div className="person-grid" role="list">
      {teamMembers.map((member) => (
        <button
          key={member.name}
          type="button"
          className="person-card"
          onClick={() => setSelectedMember(member)}
          aria-label={`Se profil for ${member.name}`}
        >
          <img
            src={member.img}
            alt={member.name}
            onError={(event) => {
              event.currentTarget.src = '/images/cross.png';
            }}
          />
          <span className="person-info">
            <span className="person-name">{member.name}</span>
            <span className="person-role">{member.title}</span>
          </span>
        </button>
      ))}
    </div>

    {selectedMember && (
      <div
        className="profile-modal-backdrop"
        role="presentation"
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            setSelectedMember(null);
          }
        }}
      >
        <article
          className="profile-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="profile-modal-name"
        >
          <button
            type="button"
            className="profile-modal-close"
            onClick={() => setSelectedMember(null)}
            aria-label="Lukk profilkort"
          >
            ×
          </button>
          <img
            className="profile-modal-image"
            src={selectedMember.img}
            alt={selectedMember.name}
            onError={(event) => {
              event.currentTarget.src = '/images/cross.png';
            }}
          />
          <div className="profile-modal-content">
            <p className="profile-modal-role">{selectedMember.title}</p>
            <h2 id="profile-modal-name">{selectedMember.name}</h2>
            <p>{selectedMember.description}</p>
          </div>
        </article>
      </div>
    )}
  </div>
  );
};

export default AboutUs;
