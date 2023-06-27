import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';
import * as paillierBigint from 'paillier-bigint'
import * as bigintConversion from 'bigint-conversion'
import * as bigintCryptoUtils from 'bigint-crypto-utils'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nombre-del-proyecto';
  message= ''//aqui se guarda el mensaje para encriptarlo en solitario
  //3 mensajes que se combinan para encriptar
  textbox1=''
  textbox2=''
  textbox3=''
  textbox4=''
  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.socketService.io.on('mensaje', (data: string) => {
      // Maneja la recepción del mensaje del servidor aquí
      console.log('Mensaje recibido del servidor:', data);
    });
    this.socketService.io.on('publicKey', (llave) => {
      // Guardar la llave en el localStorage
      localStorage.setItem('llavePUBServer', llave);
      console.log('el obj Json que contiene la llave se a guardado en el local storage con nombre llavePUBServer:',llave)
      /*
      //TEST generar la llave en el cliente
      //parse del obj json que envia el servidor
      const parsedLlave = JSON.parse(llave);
      //generamos la llavePUBServer que a enviado el servidor
      const n = BigInt(parsedLlave.n);
      const _n2 = BigInt(parsedLlave._n2);
      const g = BigInt(parsedLlave.g);
      console.log('Valor de n:', n);
      console.log('Valor de _n2:', _n2);
      console.log('Valor de g:', g);
      const llavePUBServer = new paillierBigint.PublicKey(n, g)//la generamos usando los valores n y g
      console.log('llave: ',llavePUBServer)
      */

    });
  }
  sendEncriptado(){
    console.log(this.message)
    const msgparaEncriptar = bigintConversion.textToBigint(this.message)
    console.log('bg:',msgparaEncriptar)
    //recuperamos llavePUBServer
    const llavePUBServerJSON = localStorage.getItem('llavePUBServer');
    if(llavePUBServerJSON){
    const llaveParse = JSON.parse(llavePUBServerJSON)
    const n = BigInt(llaveParse.n);
    const _n2 = BigInt(llaveParse._n2);
    const g = BigInt(llaveParse.g);
    const llavePUBServer = new paillierBigint.PublicKey(n,g)//generamos las llaves
    const msgEncriptado = llavePUBServer.encrypt(msgparaEncriptar)//encriptamos el msg
    console.log('encriptao',msgEncriptado)
    //evento socket para enviar el msg
    const msgaEnviarEncriptado = msgEncriptado.toString()
    console.log('a string:',msgaEnviarEncriptado)
    this.socketService.io.emit('enviarMsgEncriptado',msgaEnviarEncriptado)
    } else{console.log('error al recuperar llave')}
  }
  enviarSuma(){
    console.log(this.textbox1);
    console.log(this.textbox2);
    const msgparaEncriptar1 = bigintConversion.textToBigint(this.textbox1)
    const msgparaEncriptar2 = bigintConversion.textToBigint(this.textbox2)
    const SumaEncriptados =msgparaEncriptar1 + msgparaEncriptar2 //sumamos el valor de los numeros en bigint
    console.log('texto1abg',msgparaEncriptar1)
    console.log('texto2abg',msgparaEncriptar2)
    console.log('suma de los textos en bigint',SumaEncriptados)
    const llavePUBServerJSON = localStorage.getItem('llavePUBServer');
    if(llavePUBServerJSON){
    const llaveParse = JSON.parse(llavePUBServerJSON)
    const n = BigInt(llaveParse.n);
    const _n2 = BigInt(llaveParse._n2);
    const g = BigInt(llaveParse.g);
    const llavePUBServer = new paillierBigint.PublicKey(n,g)//generamos las llaves
    const msgEncriptado1 = llavePUBServer.encrypt(msgparaEncriptar1)//encriptamos el msg1
    const msgEncriptado2 = llavePUBServer.encrypt(msgparaEncriptar2)//encriptamos el msg1
    console.log('encriptao1',msgEncriptado1)
    console.log('encriptao2',msgEncriptado2)
    const msgCombinados =llavePUBServer.addition(msgEncriptado1,msgEncriptado2)//sumamos los msg encriptados 1 y 2
    console.log('msgCombinados',msgCombinados)
    //evento socket para enviar el msg
    const msgaEnviarCombinado = msgCombinados.toString()
    //prueba
    const mensajesEncriptadosSumados = {
      SumaEncriptados: SumaEncriptados.toString(),
      msgCombinados: msgCombinados.toString()
    }
    console.log('a string:',msgaEnviarCombinado)
    this.socketService.io.emit('enviarCombinadoSuma',mensajesEncriptadosSumados)
  }else{console.log('error al recuperar llave')}
  }
  enviarMulti(){
    console.log(this.textbox3);

    const msgparaEncriptar1 = bigintConversion.textToBigint(this.textbox3)
    const k = bigintConversion.textToBigint(this.textbox4)
    const multiplicacionBigints =msgparaEncriptar1*k
    console.log('texto a bg',bigintConversion.textToBigint(this.textbox3))
    console.log('numero a bg',bigintConversion.textToBigint(this.textbox4))
    console.log('multi directa',multiplicacionBigints)
    const llavePUBServerJSON = localStorage.getItem('llavePUBServer');
    if(llavePUBServerJSON){
    const llaveParse = JSON.parse(llavePUBServerJSON)
    const n = BigInt(llaveParse.n);
    const _n2 = BigInt(llaveParse._n2);
    const g = BigInt(llaveParse.g);
    const llavePUBServer = new paillierBigint.PublicKey(n,g)//generamos las llaves
    const msgEncriptado1 = llavePUBServer.encrypt(msgparaEncriptar1)//encriptamos el msg1

    console.log('encriptao1',msgEncriptado1)

    const Multiplicado =llavePUBServer.multiply(msgEncriptado1,k)
    console.log('Multiplicado',Multiplicado)
    //evento socket para enviar el msg
    const mensajesEncriptadoMulti = {
      k: k.toString(),
      multiplicacionBigints: multiplicacionBigints.toString(),
      Multiplicado: Multiplicado.toString()
    }
    this.socketService.io.emit('enviarCombinadoMulti',mensajesEncriptadoMulti)
  }else{console.log('error al recuperar llave')}
  }

  sendMessage() {//función para mandar Hola server al server, comprobación del socket io
    // Envia un mensaje al servidor utilizando el servicio
    this.socketService.io.emit('sendMessage','hola server')
  }

}
