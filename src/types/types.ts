// Auth types
export interface User {
    id: string;
    username: string;
    email: string;
    isMember: boolean;
    createdAt: string;
}

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    login: (username: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => void;
}

// Content types
export interface GalleryImage {
    id: string;
    url: string;
    title: string;
    uploadedBy: string;
    uploadedAt: string;
    galleryId?: string;
    category?: string;
}

export interface GalleryAlbum {
    id: string;
    slug?: string;
    title: string;
    description?: string;
    images: GalleryImage[];
    createdBy?: string;
    createdAt?: string;
    isBuiltIn?: boolean;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location?: string;
    createdBy: string;
    createdAt: string;
}

export interface Quote {
    id: string;
    text: string;
    author?: string;
    source?: string;
    addedBy: string;
    addedAt: string;
}
