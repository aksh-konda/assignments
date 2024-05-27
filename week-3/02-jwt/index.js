const z = require('zod');
const jwt = require('jsonwebtoken');
const jwtPassword = 'secret';

function validate(username, password) {
    const usernameSchema = z.string().email();
    const passwordShema = z.string().min(6);

    const userOp = usernameSchema.safeParse(username);
    const passwordOp = passwordShema.safeParse(password);

    return userOp.success && passwordOp.success;
}

/**
 * Generates a JWT for a given username and password.
 *
 * @param {string} username - The username to be included in the JWT payload.
 *                            Must be a valid email address.
 * @param {string} password - The password to be included in the JWT payload.
 *                            Should meet the defined length requirement (e.g., 6 characters).
 * @returns {string|null} A JWT string if the username and password are valid.
 *                        Returns null if the username is not a valid email or
 *                        the password does not meet the length requirement.
 */
function signJwt(username, password) {
    if(!validate(username, password)) return null;
    return jwt.sign(JSON.stringify({username, password}), jwtPassword);
    // Your code here
}

/**
 * Verifies a JWT using a secret key.
 *
 * @param {string} token - The JWT string to verify.
 * @returns {boolean} Returns true if the token is valid and verified using the secret key.
 *                    Returns false if the token is invalid, expired, or not verified
 *                    using the secret key.
 */
function verifyJwt(token) {
    // Your code here

    try {
        const decoded = jwt.verify(token, jwtPassword);
        if(!decoded) return false;
    } catch(err) {
        return false;
    }

    return true;
}

/**
 * Decodes a JWT to reveal its payload without verifying its authenticity.
 *
 * @param {string} token - The JWT string to decode.
 * @returns {object|false} The decoded payload of the JWT if the token is a valid JWT format.
 *                         Returns false if the token is not a valid JWT format.
 */
function decodeJwt(token) {
    // true, false
    const decoded = jwt.decode(token);
    if (decoded) {
        console.log("=================================");
        console.log(decoded);
        console.log("=================================");
        return true;
    } else {
        return false;
    }
}


module.exports = {
  signJwt,
  verifyJwt,
  decodeJwt,
  jwtPassword,
};
