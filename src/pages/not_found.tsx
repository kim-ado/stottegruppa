import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="page-content" style={{ textAlign: 'center', padding: '60px 32px' }}>
    <h1 style={{ fontSize: '72px' }}>404</h1>
    <h2>Siden ble ikke funnet</h2>
    <p style={{ margin: '16px 0' }}>
      Beklager, men siden du leter etter eksisterer ikke.
      Kanskje den har flyttet seg, eller så skrev du feil adresse.
    </p>
    <hr className="section-divider" />
    <p>
      <Link to="/" className="btn-2000s">
        Tilbake til forsiden
      </Link>
    </p>
    <p style={{ marginTop: '24px', fontSize: '14px', color: '#888' }}>
      Hvis du mener dette er en feil, ta gjerne{' '}
      <Link to="/kontakt">kontakt med oss</Link>.
    </p>
  </div>
);

export default NotFound;
