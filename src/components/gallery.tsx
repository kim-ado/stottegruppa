import { useEffect, useRef } from 'react';
import lightGallery from 'lightgallery';
import 'lightgallery/css/lightgallery.css';

import '../css/gallery.css';

const images = [
    'frederick',
    'håvard',
    'ingrid',
    'jo',
    'kim',
    'magnus',
    'maren',
    'maria',
    'marit',
    'moddis',
    'phillip',
    'tobias',
    'toffe',
    'tonje',
];

const Gallery = () => {
    const galleryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (galleryRef.current) {
            const instance = lightGallery(galleryRef.current);
            return () => {
                instance.destroy();
            };
        }
    }, []);

    return (
        <div className="page-content">
            <section className="gallery-section">
                <h1>Galleri</h1>
                <p>Bilder fra livet vårt sammen.</p>
                <div id="gallery" ref={galleryRef}>
                    {images.map((name) => (
                        <a key={name} href={`/images/linkedinbilder/${name}.jpg`}>
                            <img src={`/images/linkedinbilder/${name}.jpg`} alt={name} />
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Gallery;