import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

/**
 * Hash a plain-text password using bcrypt.
 * @param {string} plain
 * @returns {Promise<string>} hashed password
 */
export async function hashPassword(plain) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 * @param {string} plain
 * @param {string} hashed
 * @returns {Promise<boolean>}
 */
export async function comparePassword(plain, hashed) {
  return bcrypt.compare(plain, hashed);
}
