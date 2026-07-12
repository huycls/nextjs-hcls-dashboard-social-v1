export const AUTH_COOKIE_NAME = "avispark_token";
export const AUTH_REFRESH_COOKIE_NAME = "avispark_refresh";
export const USER_PROFILE_STORAGE_KEY = "Avispark-user-profile";

/** Matches Nest access JWT TTL (~15m) */
export const ACCESS_TOKEN_MAX_AGE = 60 * 15;
/** Matches Nest refresh JWT TTL (~7d); remember-me extends cookie only */
export const REFRESH_TOKEN_MAX_AGE_SESSION = 60 * 60 * 24 * 7;
export const REFRESH_TOKEN_MAX_AGE_REMEMBER = 60 * 60 * 24 * 30;
