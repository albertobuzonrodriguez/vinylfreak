import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client;
  private messageSource = new BehaviorSubject<any>(null);
  public mensajeRecibido$ = this.messageSource.asObservable();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('https://vinylfreak-backend.onrender.com/ws-vinyl'),
      onConnect: () => {
        console.log('Conectado al WebSocket');
        this.stompClient.subscribe('/topic/mensajes', (mensaje) => {
          this.messageSource.next(JSON.parse(mensaje.body));
        });
      }
    });
    this.stompClient.activate();
  }

  enviarMensaje(mensaje: any) {
    this.stompClient.publish({
      destination: '/app/chat',
      body: JSON.stringify(mensaje)
    });
  }
}
