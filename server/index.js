const paillierBigint = require('paillier-bigint')
const bigintConversion = require('bigint-conversion')
const app = require('express')()
const http = require('http').Server(app)
const io = require('socket.io')(http,{
    cors: {
        origin: true,
        credentials: true,
        methods: ["GET","POST"]
    }
})
let llavePUBServer;
let llavePRIVServer;

paillierTest();

async function paillierTest() {
  const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(1024);
  llavePUBServer = publicKey;
  llavePRIVServer = privateKey
  console.log('Clave pública generada:', publicKey);
  console.log('Clave privada generada:', privateKey);
  console.log('llavePUBServer:', llavePUBServer);
  console.log('llavePRIVServer:', llavePUBServer);
 
  
}
console.log('llavePUBServer:',llavePUBServer)

http.listen(3000,()=>{
    console.log('escuchando puerto 3000')
})
io.on('connection', (socket) => {
  console.log('-----------------------')
  console.log('Nuevo cliente conectado');
  
    if (llavePUBServer) {//solo se emite la llave si existe
      const publicKeyObject = {
        n: llavePUBServer.n.toString(),
        _n2: llavePUBServer._n2.toString(),
        g: llavePUBServer.g.toString()
      };
      const publicKeyString = JSON.stringify(publicKeyObject);
      socket.emit('publicKey', publicKeyString);
    } else {
      console.log('Clave pública no generada');
    }
    socket.on('enviarMsgEncriptado',(msgRecibido)=>{
      console.log('-----------------------')
      console.log(msgRecibido)
      const msgRecibidoBigint = BigInt(msgRecibido)
      console.log(msgRecibidoBigint)
      const desencriptado = llavePRIVServer.decrypt(msgRecibidoBigint)
      console.log('desencriptado:',desencriptado)
      const desencriptadoaText = bigintConversion.bigintToText(desencriptado)
      console.log(desencriptadoaText)
    })
    socket.on('enviarCombinadoSuma',(msgCombinadoRecibido)=>{//arreglar en lugar de enviar los mensajes encriptados, enviar el resultado 
      console.log('-----------------------')
      //añado esto test
      const ResultadoSuma = BigInt(msgCombinadoRecibido.SumaEncriptados);//bigint del numero encriptado
      const msgCombinados = BigInt(msgCombinadoRecibido.msgCombinados);//resultado de la suma
    
      console.log('ResultadoSuma:', ResultadoSuma);
  
      console.log('msgCombinados:', msgCombinados);

      const decryptCombinado = llavePRIVServer.decrypt(msgCombinados)
      console.log('ResultadoSuma',ResultadoSuma)
      console.log('decryptCombinado',decryptCombinado)
      if (decryptCombinado === ResultadoSuma) {
        console.log('La suma homomórfica es correcta.');
      } else {
        console.log('La suma homomórfica es incorrecta.');
      }
    })
    socket.on('enviarCombinadoMulti',(msgCombinadoRecibido)=>{
      console.log('-----------------------')
      const valork =BigInt(msgCombinadoRecibido.k)
      const ResultadoMultiplicacion = BigInt(msgCombinadoRecibido.multiplicacionBigints);//resultado multiplicacion directa de los bigint numero*valork
      const msgMulti = BigInt(msgCombinadoRecibido.Multiplicado);// multiply
      const msgRecibidoBigint = BigInt(msgMulti)
      const desencriptado = llavePRIVServer.decrypt(msgRecibidoBigint)
  
    
      // Comparar la multiplicación directa con el resultado de la multiplicación homomórfica recibida
      if (ResultadoMultiplicacion === desencriptado) {
        console.log('La multiplicación homomórfica es correcta.');
      } else {
        console.log('La multiplicación homomórfica es incorrecta.');
      }
    })
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
    socket.on('sendMessage',(msg)=>{
      console.log(msg)
    })
  });
 



/**Para hacer pruebas de la suma homomorfica y la multiplicacion
 *  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

  // Valores de prueba
  const m0 = bigintConversion.textToBigint('12')
  console.log('m0:', m0)
  
  const k = 12592n
  
  // Encriptar m0
  const c1 = llavePUBServer.encrypt(m0)
  console.log('c1:', c1)
  
  // Multiplicación homomórfica de c1 por k
  const encryptedMul = llavePUBServer.multiply(c1, k)
  console.log('encryptedMul:', encryptedMul)
  
  // Desencriptar el resultado de la multiplicación homomórfica
  const decryptedMul = llavePRIVServer.decrypt(encryptedMul)
  console.log('Decrypted multiplication:', decryptedMul)
  
  // Comprobación de la multiplicación homomórfica
  const multiplicationDirect = m0 * k
  console.log('multiplicationDirect',multiplicationDirect)
  if (decryptedMul === multiplicationDirect) {
    console.log('La multiplicación homomórfica es correcta.')
  } else {
    console.log('La multiplicación homomórfica es incorrecta.')
  }
  
  console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
 * 
 */