import { Component } from '@angular/core';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'nombre-del-proyecto';
  constructor(private socketService: SocketService) {}

  sendMessage() {
    // Envia un mensaje al servidor utilizando el servicio
    this.socketService.io.emit('sendMessage','hola server')
  }
}
