declare var lightGallery: any;

document.addEventListener('DOMContentLoaded', () => {
  const galleryElement = document.getElementById('gallery');
  if (galleryElement) {
    lightGallery(galleryElement, {
      // Add any LightGallery options here
      // e.g. thumbnail: true
    });
  }
});