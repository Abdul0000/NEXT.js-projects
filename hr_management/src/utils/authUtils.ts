import { scrypt, timingSafeEqual } from 'crypto';

const KEY_LENGTH = 64; // Length of the derived key
// const DIGEST_ALGORITHM = 'sha512'; // Digest algorithm for scrypt

/**
 * Password ko hash karta hai ek naye salt ke saath.
 * @param password Hash kiya jane wala password.
 * @returns {Promise<{ hashedPassword: string, salt: string }>} Hashed password aur salt.
 */
export async function hashPassword(password: string, salt:string): Promise<string> {
    return new Promise((resolve, reject) => {
        // Naya random salt banayen
        scrypt(password, salt, KEY_LENGTH, (err, hash) => {
            if (err) reject(err);
            resolve(
                hash.toString('hex').normalize(),
            );
        });
    });
}

/**
 * Dale gaye password ko stored hash se compare karta hai.
 * @param password Dale gaya password.
 * @param storedHash Database mein store kiya hua hashed password.
 * @param storedSalt Database mein store kiya hua salt.
 * @returns {Promise<boolean>} Agar passwords match karte hain toh true, warna false.
 */
export async function verifyPassword(password: string, storedHash: string, storedSalt: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        const storedDerivedKey = Buffer.from(storedHash, 'hex');
        scrypt(password, storedSalt, KEY_LENGTH, (err, hash) => {
            if (err) reject(err);
            // Timing-safe comparison ke liye Buffer mein convert karein
            // TimingSafeEqual ka istemal karein taake timing attacks se bacha ja sake
            const passwordsMatch = timingSafeEqual(hash, storedDerivedKey);
            resolve(passwordsMatch);
        });
    });
}