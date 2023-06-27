const { PaillierPublicKey, PaillierPrivateKey, PaillierKeyPair, generateKeys } = require('./paillier');

// Función para cifrar y descifrar mensajes
const testEncryptionDecryption = (publicKey, privateKey, message) => {
  console.log('Mensaje original:', message);

  // Cifrar el mensaje
  const encryptedMessage = publicKey.encrypt(message);
  console.log('Mensaje cifrado:', encryptedMessage.toString());

  // Descifrar el mensaje
  const decryptedMessage = privateKey.decrypt(encryptedMessage);
  console.log('Mensaje descifrado:', decryptedMessage.toString());
  console.log();
};

// Generar las claves
const bitLength = 512; // Longitud en bits de los primos p y q
generateKeys(bitLength)
  .then((keyPair) => {
    const publicKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;

    console.log('Clave pública (n, g):', publicKey.n.toString(), publicKey.g.toString());
    console.log('Clave privada (lambda, mu):', privateKey.lambda.toString(), privateKey.mu.toString());
    console.log();

    // Probar cifrado y descifrado con diferentes mensajes
    const message1 = 123456n;
    testEncryptionDecryption(publicKey, privateKey, message1);

    const message2 = 987654n;
    testEncryptionDecryption(publicKey, privateKey, message2);

    const message3 = 42n;
    testEncryptionDecryption(publicKey, privateKey, message3);
  })
  .catch((error) => {
    console.error('Error al generar las claves:', error);
  });
