# Gallery and Access Guide

## Access switch

All access decisions are in `access-control.ts`:

```ts
export const ACCESS_REQUIREMENTS = {
    gallery: 'registered',
    galleryImages: 'registered',
    events: 'member',
    quotes: 'member',
};
```

- `registered` means any logged-in user.
- `member` means a logged-in user whose `isMember` value is `true`.
- To make gallery creation or image uploads member-only, change the relevant `registered` value to `member`.
- Gallery links in the frontend and gallery authorization on the backend import this same file, so those two sides stay aligned.

## Gallery flow

1. `/gallery` shows the gallery list, without showing the images.
2. Opening a gallery uses a readable URL such as `/gallery/støttegruppen`.
3. A registered user opens **Galleri** and chooses **+ Nytt galleri**.
4. The gallery is saved in Redis and receives a readable slug URL.
5. The new gallery gets a **+ Bilde** action on its detail page.
6. Uploaded files are stored in `uploads/`, while their metadata and gallery membership are stored in Redis.
7. The existing portraits are kept together as one built-in **Støttegruppen** gallery. The original 14 images remain static files in `images/linkedinbilder/`, while new images are saved in Redis and `uploads/` under the same gallery.

## Local development

Redis must be running before the backend:

```bash
docker run -d -p 6379:6379 --name stottegruppa-redis redis
npm run dev:server
```

In a second terminal, start the frontend:

```bash
npm run dev
```
