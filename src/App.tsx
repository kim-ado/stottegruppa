import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/navbar';
import Footer from './components/footer';
import Home from './pages/home';
import Gallery from './components/gallery';
import AboutUs from './components/about_us';
import Quotes from './pages/quotes';
import Events from './pages/events';
import Merch from './pages/merch';
import Contact from './pages/contact';
import Guestbook from './pages/guestbook';
import Login from './pages/login';
import Register from './pages/register';
import AddPicture from './pages/add_picture';
import AddEvent from './pages/add_event';
import AddQuote from './pages/add_quote';
import NotFound from './pages/not_found';
import './App.css';

function AppContent() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/gallery/add" element={<AddPicture />} />
        <Route path="/om-oss" element={<AboutUs />} />
        <Route path="/sitater" element={<Quotes />} />
        <Route path="/sitater/add" element={<AddQuote />} />
        <Route path="/arrangementer" element={<Events />} />
        <Route path="/arrangementer/add" element={<AddEvent />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/kontakt" element={<Contact />} />
        <Route path="/gjestebok" element={<Guestbook />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
