/**
 * System-wide configuration constants
 * Centralizes all magic numbers and configuration values
 */

export const CONFIG = {
    FILE_UPLOAD: {
        MAX_SIZE: 10 * 1024 * 1024, // 10MB in bytes
        MAX_SIZE_MB: 10,
        ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'] as const,
        ALLOWED_DOCUMENT_TYPES: ['application/pdf'] as const,
        get ALLOWED_TYPES() {
            return [...this.ALLOWED_IMAGE_TYPES, ...this.ALLOWED_DOCUMENT_TYPES]
        },
    },

    GUEST_LINK: {
        DEFAULT_DURATION_HOURS: 24,
        MIN_DURATION_HOURS: 1,
        MAX_DURATION_HOURS: 168, // 7 days
        PIN_MIN: 100000,
        PIN_MAX: 999999,
    },

    PASSWORD: {
        MIN_LENGTH: 12,
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
