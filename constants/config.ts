/**
 * System-wide configuration constants
 * Centralizes all magic numbers and configuration values
 */

// Signed URL Expiry Presets (in seconds)
export const SIGNED_URL_EXPIRY = {
    ONE_HOUR: 3600,
    ONE_DAY: 86400,
    ONE_WEEK: 604800,
    ONE_MONTH: 2592000,
    THREE_MONTHS: 7776000,
    SIX_MONTHS: 15552000,
    ONE_YEAR: 31536000,
    FIVE_YEARS: 157680000,
} as const

export const CONFIG = {
    FILE_UPLOAD: {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
        MAX_SIZE_MB: 10,
        GUEST_MAX_SIZE: 5 * 1024 * 1024, // 5MB in bytes for guests
        GUEST_MAX_SIZE_MB: 5,
        GUEST_MAX_PHOTOS_PER_CASE: 5, // Maximum photos a guest can upload per case
        STAFF_MAX_PHOTOS_PER_CASE: 20, // Maximum photos staff/admin can upload per case
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
        ALLOWED_DOCUMENT_TYPES: ['application/pdf'] as const,
        get ALLOWED_TYPES() {
            return [...this.ALLOWED_IMAGE_TYPES, ...this.ALLOWED_DOCUMENT_TYPES]
        },
    },

    GUEST_LINK: {
        MAX_LINKS_PER_CASE: 5,          // Maximum active links per case
        MAX_UPLOADS_PER_LINK: 3,        // Maximum uploads per guest link
        DEFAULT_DURATION_HOURS: 24,
        MIN_DURATION_HOURS: 1,
        MAX_DURATION_HOURS: 168, // 7 days
        PIN_MIN: 100000,
        PIN_MAX: 999999,
    },

    PASSWORD: {
        MIN_LENGTH: 8,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBER: true,
        REQUIRE_SPECIAL: true,
    },

    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        MAX_PAGE_SIZE: 100,
    },

    RATE_LIMIT: {
        LOGIN: {
            POINTS: 5, // Max attempts
            DURATION: 15 * 60, // 15 minutes in seconds
        },
        PIN_VERIFICATION: {
            POINTS: 3,
            DURATION: 10 * 60, // 10 minutes
        },
    },

    CASE_NOTE: {
        MIN_LENGTH: 1,
        MAX_LENGTH: 5000,
    },

    INVOLVED_PARTY: {
        NAME_MIN_LENGTH: 2,
        NAME_MAX_LENGTH: 100,
        ADDRESS_MAX_LENGTH: 500,
    },
} as const

export type FileUploadConfig = typeof CONFIG.FILE_UPLOAD
export type GuestLinkConfig = typeof CONFIG.GUEST_LINK
export type PasswordConfig = typeof CONFIG.PASSWORD
