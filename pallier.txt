const bcu = require('bigint-crypto-utils');
const bigintConversion = require('bigint-conversion');

class PaillierPublicKey {
  constructor(n, g) {
    this.n = n; // módulo
    this.g = g; // generador
  }

  encrypt(m) {
    const r = bcu.primeSync(bcu.bitLength(this.n)); // generar un número primo aleatorio r
    const c1 = bcu.modPow(this.g, m, this.n.pow(2)); // g^m mod n^2
    const c2 = bcu.modPow(r, this.n, this.n.pow(2)); // r^n mod n^2
    return (c1 * c2) % this.n.pow(2); // c = (c1 * c2) mod n^2
  }

  multiply(m, k) {
    return (m * bcu.modPow(this.n, k, this.n.pow(2))) % this.n.pow(2);
  }
}

class PaillierPrivateKey {
  constructor(lambda, mu, publicKey) {
    this.lambda = lambda;
    this.mu = mu;
    this.publicKey = publicKey;
  }

  decrypt(c) {
    const u = bcu.modPow(c, this.lambda, this.publicKey.n.pow(2)) - 1n;
    const m = (u * this.mu) % this.publicKey.n;
    return (m * bcu.modInv(this.publicKey.g, this.publicKey.n)) % this.publicKey.n;
  }
}

class PaillierKeyPair {
  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}

const generateKeys = async function (bitLength) {
  const p = await bcu.prime(bitLength / 2);
  const q = await bcu.prime(bitLength / 2);
  const n = p * q;
  const lambda = bcu.lcm(p - 1n, q - 1n);
  const g = n + 1n;
  const mu = bcu.modInv(bcu.modPow(g, lambda, n.pow(2)), n);

  const publicKey = new PaillierPublicKey(n, g);
  const privateKey = new PaillierPrivateKey(lambda, mu, publicKey);

  return new PaillierKeyPair(publicKey, privateKey);
};

module.exports = {
  PaillierPublicKey,
  PaillierPrivateKey,
  PaillierKeyPair,
  generateKeys,
};
