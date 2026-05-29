const CryptoJS = require('crypto-js');
const env = require('../config/env');

const SECRET = env.AES_SECRET_KEY;

/**
 * Encrypt a string using AES-256
 * @param {string} text
 * @returns {string} encrypted ciphertext
 */
const encrypt = (text) => {
  return CryptoJS.AES.encrypt(String(text), SECRET).toString();
};

/**
 * Decrypt an AES-256 ciphertext
 * @param {string} cipherText
 * @returns {string} decrypted plaintext
 */
const decrypt = (cipherText) => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

module.exports = { encrypt, decrypt };
