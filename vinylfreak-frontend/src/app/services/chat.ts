import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private stompClient: Client;
  private messageSource = new BehaviorSubject<any>(null);
  public mensajeRecibido$ = this.messageSource.asObservable();

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/api/ws-vinyl`),
      onConnect: () => {
        console.log('Conectado al WebSocket de VinylFreak');
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
