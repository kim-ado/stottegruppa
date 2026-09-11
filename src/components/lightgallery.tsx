import { useEffect, useRef } from 'react';
import lightGallery from 'lightgallery';
import 'lightgallery/css/lightgallery.css';

import Navbar from '../components/navbar';
import '../css/gallery.css';

const images: string[] = [
    'frederick.jpg',
    'håvard.jpg',
    'ingrid.jpg',
    'jo.jpg',
    'kim.jpg',
    'magnus.jpg',
    'maren.jpg',
    'maria.jpg',
    'marit.jpg',
    'moddis.jpg',
    'phillip.jpg',
    'tobias.jpg',
    'toffe.jpg',
    'tonje.jpg',
];

const Gallery: React.FC = () => {
    const galleryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (galleryRef.current) {
            const gallery = lightGallery(galleryRef.current);
            return () => {
                gallery.destroy();
            };
        }
    }, []);

    return (
        <main>
            <Navbar />
            <section className="gallery-section">
                <h2>LinkedIn-bilder</h2>
                <p>Profilbilder av medlemmene i støttegruppa.</p>
                <div id="gallery" ref={galleryRef}>
                    {images.map((img) => (
                        <a key={img} href={`/images/linkedinbilder/${img}`}>
                            <img src={`/images/linkedinbilder/${img}`} alt={img} />
                        </a>
                    ))}
                </div>
            </section>
        </main>
    );
};

export default Gallery;