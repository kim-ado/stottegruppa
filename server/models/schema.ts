/**
 * Redis Database Schema
 * This file documents the Redis data structure used for storing data
 * 
 * Key Patterns:
 * - users:{username} - User account data
 * - sessions:{sessionId} - Session data for JWT tokens
 * - gallery:images:{imageId} - Gallery image metadata
 * - gallery:categories - Set of image categories
 * - events:{eventId} - Event data
 * - events:list - Sorted set of all event IDs (sorted by date)
 * - quotes:{quoteId} - Quote data
 * - quotes:list - Sorted set of all quote IDs (sorted by timestamp)
 * - users:{username}:uploaded:images - Set of image IDs uploaded by user
 * - users:{username}:created:events - Set of event IDs created by user
 * - users:{username}:added:quotes - Set of quote IDs added by user
 */

/**
 * USER DATA STRUCTURE
 * Key: users:{username}
 * Type: Hash
 * Fields:
 * - id: unique user identifier (UUID)
 * - username: username (unique)
 * - email: email address
 * - passwordHash: bcrypt hashed password
 * - isMember: boolean (true if member, false if just registered)
 * - createdAt: ISO timestamp
 * - updatedAt: ISO timestamp
 * - lastLogin: ISO timestamp
 * - role: 'user' | 'admin'
 */
export interface UserRedisData {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    isMember: boolean;
    createdAt: string;
    updatedAt: string;
    lastLogin: string;
    role: 'user' | 'admin';
}

/**
 * GALLERY IMAGE DATA STRUCTURE
 * Key: gallery:images:{imageId}
 * Type: Hash
 * Fields:
 * - id: unique image identifier (UUID)
 * - title: image title
 * - url: path to image file
 * - thumbnail: path to thumbnail
 * - uploadedBy: username of uploader
 * - uploadedAt: ISO timestamp
 * - category: 'general' | 'events' | 'members'
 * - width: image width in pixels
 * - height: image height in pixels
 * - size: file size in bytes
 * - description: optional image description
 */
export interface GalleryImageRedisData {
    id: string;
    title: string;
    url: string;
    thumbnail: string;
    uploadedBy: string;
    uploadedAt: string;
    category: string;
    width: number;
    height: number;
    size: number;
    description?: string;
}

/**
 * EVENT DATA STRUCTURE
 * Key: events:{eventId}
 * Type: Hash
 * Fields:
 * - id: unique event identifier (UUID)
 * - title: event title
 * - description: event description
 * - date: ISO timestamp of event
 * - location: location of event (optional)
 * - createdBy: username of creator
 * - createdAt: ISO timestamp when created
 * - updatedAt: ISO timestamp when last updated
 * - attendees: number of confirmed attendees (optional)
 * - image: URL to event image (optional)
 */
export interface EventRedisData {
    id: string;
    title: string;
    description: string;
    date: string;
    location?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    attendees?: number;
    image?: string;
}

/**
 * QUOTE DATA STRUCTURE
 * Key: quotes:{quoteId}
 * Type: Hash
 * Fields:
 * - id: unique quote identifier (UUID)
 * - text: quote text
 * - author: author name (optional)
 * - source: source reference (optional, e.g., Bible verse)
 * - addedBy: username of who added the quote
 * - addedAt: ISO timestamp when added
 * - likes: number of likes (optional)
 */
export interface QuoteRedisData {
    id: string;
    text: string;
    author?: string;
    source?: string;
    addedBy: string;
    addedAt: string;
    likes?: number;
}

/**
 * SESSION DATA STRUCTURE
 * Key: sessions:{sessionId}
 * Type: Hash
 * TTL: 7 days (configurable)
 * Fields:
 * - userId: unique user identifier
 * - username: username
 * - email: user email
 * - isMember: member status
 * - role: user role
 * - expiresAt: ISO timestamp
 */
export interface SessionRedisData {
    userId: string;
    username: string;
    email: string;
    isMember: boolean;
    role: string;
    expiresAt: string;
}

/**
 * SETUP SCRIPT EXAMPLE
 * 
 * // Initialize default categories
 * SADD gallery:categories "general" "events" "members"
 * 
 * // Create index for sorted searches
 * // FT.CREATE events:index ON HASH PREFIX 1 "events:" SCHEMA date NUMERIC
 * 
 * Note: Redis doesn't have built-in full-text search by default.
 * Consider using Redis Search module if advanced queries needed.
 */
