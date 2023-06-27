const bcu = require('bigint-crypto-utils');
const bigintConversion = require('bigint-conversion');

class PaillierPublicKey {
  constructor(n, g) {
    this.n = n; 
    this.g = g; 
  }

  encrypt(m) {
    const r = bcu.primeSync(bcu.bitLength(this.n)); // generar un número primo aleatorio r
    const c1 = bcu.modPow(this.g, m, bcu.modPow(this.n, 2)); // g^m mod n^2
    const c2 = bcu.modPow(r, this.n, bcu.modPow(this.n, 2)); // r^n mod n^2
    return bcu.mod(c1 * c2, bcu.modPow(this.n, 2)); // c = (c1 * c2) mod n^2
  }

  multiply(m, k) {
    return bcu.mod(m * bcu.modPow(this.n, k, bcu.modPow(this.n, 2)), bcu.modPow(this.n, 2));
  }
}

class PaillierPrivateKey {
  constructor(lambda, mu, publicKey) {
    this.lambda = lambda;
    this.mu = mu;
    this.publicKey = publicKey;
  }

  decrypt(c) {
    const u = bcu.modPow(c, this.lambda, bcu.modPow(this.publicKey.n, 2)) - 1n;
    const m = bcu.mod(u * this.mu, this.publicKey.n);
    return bcu.mod(m * bcu.modInv(this.publicKey.g, this.publicKey.n), this.publicKey.n);
  }
}

class PaillierKeyPair {
  constructor(publicKey, privateKey) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }
}

const generateKeys = async function (bitLength) {
  const p = await bcu.prime(bitLength / 2 + 1  );
  const q = await bcu.prime(bitLength / 2);
  const n = p * q;
  const lambda = bcu.lcm(p - 1n, q - 1n);
  const g = n + 1n;
  const mu = bcu.modInv(bcu.modPow(g, lambda, bcu.modPow(n, 2)), n);

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
