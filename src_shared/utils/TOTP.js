import CryptoJS from 'crypto-js';

// Helper to convert Base32 to Hex
function base32ToHex(base32) {
    const base32chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let bits = '';
    let hex = '';

    base32 = base32.replace(/=+$/, '');

    for (let i = 0; i < base32.length; i++) {
        const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += ('00000' + val.toString(2)).slice(-5);
    }

    for (let i = 0; i + 4 <= bits.length; i += 4) {
        const chunk = bits.substring(i, i + 4);
        hex += parseInt(chunk, 2).toString(16);
    }

    return hex;
}

// Generate HMAC with specified algorithm
function generateHmac(algorithm, key, message) {
    switch (algorithm.toUpperCase()) {
        case 'SHA1':
        case 'SHA-1':
            return CryptoJS.HmacSHA1(message, key);
        case 'SHA256':
        case 'SHA-256':
            return CryptoJS.HmacSHA256(message, key);
        case 'SHA512':
        case 'SHA-512':
            return CryptoJS.HmacSHA512(message, key);
        default:
            throw new Error('Unsupported algorithm: ' + algorithm);
    }
}

// Generate TOTP
function generateTOTP(secret, timeout = 30, algorithm = 'SHA1') {
    const epoch = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epoch / timeout)
        .toString(16)
        .padStart(16, '0');
    const key = base32ToHex(secret);

    const hmac = generateHmac(algorithm, CryptoJS.enc.Hex.parse(key), CryptoJS.enc.Hex.parse(counter));
    const hmacHex = hmac.toString(CryptoJS.enc.Hex);

    const offset = parseInt(hmacHex.substring(hmacHex.length - 1), 16) * 2;
    const otp = (parseInt(hmacHex.substring(offset, offset + 8), 16) & 0x7fffffff) % 1000000;

    return otp.toString().padStart(6, '0');
}

export default generateTOTP;
