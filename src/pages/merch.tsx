import '../css/merch.css';

interface Product {
  name: string;
  price: string;
  description: string;
  badge?: string;
}

const products: Product[] = [
  {
    name: 'Støttegruppa T-skjorte',
    price: '249,-',
    description: 'Klassisk hvit t-skjorte med kors-logoen vår på brystet. Fås i S, M, L, XL.',
    badge: 'Populær!',
  },
  {
    name: 'Kaffekopp med logo',
    price: '149,-',
    description: 'Start dagen med troen! Porselenskopp med Kristen Støttegruppe-logo.',
  },
  {
    name: 'Hettegenser «Sammen i tro»',
    price: '449,-',
    description: 'Varm og god hettegenser med brodert tekst. Perfekt for kalde kvelder.',
    badge: 'Ny!',
  },
  {
    name: 'Stickers-pakke (5 stk)',
    price: '79,-',
    description: 'Klistremerker med ulike kristne symboler og sitater fra siden vår.',
  },
  {
    name: 'Notatbok med vers',
    price: '129,-',
    description: 'Notatbok med inspirerende vers på hvert ark. Perfekt for bønner og refleksjoner.',
  },
  {
    name: 'Keychain med kors',
    price: '59,-',
    description: 'Enkel nøkkelring med lite kors i tre. Alltid med deg på veien.',
  },
];

const Merch = () => (
  <div className="page-content">
    <h1>Merch</h1>
    <p>Støtt støttegruppa og vis at du er en del av fellesskapet!</p>

    <hr className="section-divider" />

    <div className="products-grid">
      {products.map((p, i) => (
        <div key={i} className="card-2000s product-card">
          <div className="product-placeholder">
            <span>{p.name.charAt(0)}</span>
          </div>
          <h3>
            {p.name}
            {p.badge && <span className="new-badge">{p.badge}</span>}
          </h3>
          <p className="product-price">{p.price}</p>
          <p>{p.description}</p>
          <button className="btn-2000s">Legg i handlekurv</button>
        </div>
      ))}
    </div>
  </div>
);

export default Merch;
