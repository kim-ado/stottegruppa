import '../css/person.css';
import '../css/about_us.css';

const teamMembers = [
  { name: 'Abid Hussain Raja', title: 'Leder', img: '/images/linkedinbilder/Abid_Hussain_Raja.jpg' },
  { name: 'Frederick Tallaksen', title: 'Medgrunnlegger', img: '/images/linkedinbilder/frederick.jpg' },
  { name: 'Kim Andre Karlsen', title: 'IT-ansvarlig', img: '/images/linkedinbilder/kim.jpg' },
  { name: 'Maren Paulsen', title: 'Arrangementskoordinator', img: '/images/linkedinbilder/maren.jpg' },
  { name: 'Magnus Øgrey', title: 'Menighetskontakt', img: '/images/linkedinbilder/magnus.jpg' },
  { name: 'Tobias Vraalsen', title: 'Medlem', img: '/images/linkedinbilder/tobias.jpg' },
  { name: 'Phillip Øgrey Finsådal', title: 'Medlem', img: '/images/linkedinbilder/phillip.jpg' },
  { name: 'Sebastian Løvaas', title: 'Medlem', img: '/images/linkedinbilder/Sebastian_Løvaas.jpg' },
  { name: 'Thea Aaberge Sanderud', title: 'Medlem', img: '/images/linkedinbilder/Thea_Aaberge_Sanderud.jpg' },
  { name: 'Silje Haugen', title: 'Medlem', img: '/images/linkedinbilder/Silje_Haugen.jpg' },
  { name: 'Eline Grønvold', title: 'Medlem', img: '/images/linkedinbilder/Eline_Grønvold.jpg' },
];

const AboutUs = () => (
  <div className="page-content">
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

    <div className="person-grid">
      {teamMembers.map((member, index) => (
        <div key={index} className="card-2000s person-card">
          <img src={member.img} alt={member.name} />
          <div className="person-info">
            <h3>{member.name}</h3>
            <p>{member.title}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default AboutUs;
