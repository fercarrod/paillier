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
  const { publicKey, privateKey } = await paillierBigint.generateRandomKeys(16);
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
      console.log(msgRecibido)
      const msgRecibidoBigint = BigInt(msgRecibido)
      console.log(msgRecibidoBigint)
      const desencriptado = llavePRIVServer.decrypt(msgRecibidoBigint)
      console.log('desencriptado:',desencriptado)
      const desencriptadoaText = bigintConversion.bigintToText(desencriptado)
      console.log(desencriptadoaText)
    })
    socket.on('enviarCombinadoSuma',(msgCombinadoRecibido)=>{
      //console.log(msgCombinadoRecibido)
      const msgRecibidoBigint = BigInt(msgCombinadoRecibido)
      console.log(msgRecibidoBigint)
      const desencriptado = llavePRIVServer.decrypt(msgRecibidoBigint)
      console.log('desencriptado:',desencriptado)
   
    })
    socket.on('enviarCombinadoMulti',(msgCombinadoRecibido)=>{
      //console.log(msgCombinadoRecibido)
      const msgRecibidoBigint = BigInt(msgCombinadoRecibido)
      console.log(msgRecibidoBigint)
      const desencriptado = llavePRIVServer.decrypt(msgRecibidoBigint)
      console.log('desencriptado:',desencriptado)
    })
    socket.on('disconnect', () => {
      console.log('Cliente desconectado');
    });
    socket.on('sendMessage',(msg)=>{
      console.log(msg)
    })
  });
  




