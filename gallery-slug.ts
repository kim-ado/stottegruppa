export const toGallerySlug = (title: string): string => (
    title
        .trim()
        .toLocaleLowerCase('nb-NO')
        .replace(/[^\p{L}\p{N}]+/gu, '-')
        .replace(/^-+|-+$/g, '')
);