export type AccessLevel = 'registered' | 'member';

export const ACCESS_REQUIREMENTS = {
    gallery: 'registered',
    galleryImages: 'registered',
    events: 'member',
    quotes: 'member',
} as const satisfies Record<string, AccessLevel>;

export interface AccessUser {
    isMember: boolean;
}

export const hasAccess = (
    user: AccessUser | null | undefined,
    requirement: AccessLevel,
): boolean => Boolean(user) && (requirement === 'registered' || Boolean(user?.isMember));