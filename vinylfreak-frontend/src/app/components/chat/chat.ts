import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
  standalone: false
})
export class Chat implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  nuevoMensaje: string = '';
  mensajes: any[] = [];
  listaContactos: string[] = [];
  usuarioLogueado: any = null;
  receptorUsername: string = '';
  private socketSub!: Subscription;

  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('usuario_logeado');
      if (userJson) {
        this.usuarioLogueado = JSON.parse(userJson);
      }
    }
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId) && this.usuarioLogueado) {
      this.cargarListaContactos();

      this.route.queryParams.subscribe(params => {
        const nuevoReceptor = params['receptor'];
        if (nuevoReceptor) {
          this.receptorUsername = nuevoReceptor;
          this.cargarHistorial();
        }
      });

      this.socketSub = this.chatService.mensajeRecibido$.subscribe((msg: any) => {
        if (msg) {
          if (this.esDeEstaConversacion(msg)) {
            // Evitamos duplicar si el mensaje es nuestro (ya lo añadimos en enviar())
            if (msg.remitente.username !== this.usuarioLogueado.username) {
              this.mensajes = [...this.mensajes, msg];
              this.cdr.detectChanges();
            }
          }
          this.cargarListaContactos();
        }
      });
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.myScrollContainer && this.myScrollContainer.nativeElement) {
      try {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      } catch (err) { }
    }
  }

  ngOnDestroy() {
    if (this.socketSub) this.socketSub.unsubscribe();
  }

  cargarListaContactos() {
    if (!this.usuarioLogueado) return;
    const url = `http://localhost:8080/api/mensajes/conversaciones/${this.usuarioLogueado.username}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        const nombres = data.map(m =>
          m.remitente.username === this.usuarioLogueado.username ? m.destinatario.username : m.remitente.username
        );
        this.listaContactos = [...new Set(nombres)].filter(n => n !== this.usuarioLogueado.username);
        this.cdr.detectChanges();
      }
    });
  }

  cargarHistorial() {
    if (!this.receptorUsername || !this.usuarioLogueado) return;
    const url = `http://localhost:8080/api/mensajes/historial?u1=${this.usuarioLogueado.username}&u2=${this.receptorUsername}`;
    this.http.get<any[]>(url).subscribe({
      next: (data) => {
        // CLAVE: Asignar una nueva referencia de array para que Angular reaccione
        this.mensajes = [...data];

        // Pequeño delay para asegurar que el DOM se ha creado antes de detectar cambios
        setTimeout(() => {
          this.cdr.detectChanges();
          this.scrollToBottom();
        }, 50);
      },
      error: (err) => console.error('Error historial:', err)
    });
  }

  seleccionarContacto(username: string) {
    this.router.navigate(['/mensajes'], { queryParams: { receptor: username } });
  }

  enviar() {
    if (!this.nuevoMensaje.trim() || !this.receptorUsername) return;
    const texto = this.nuevoMensaje.trim();
    this.nuevoMensaje = '';

    const mensajeAEnviar = {
      remitente: this.usuarioLogueado,
      destinatario: { username: this.receptorUsername },
      contenido: texto,
      fechaEnvio: new Date().toISOString(),
      tipo: 'CHAT'
    };

    this.mensajes = [...this.mensajes, mensajeAEnviar];
    this.chatService.enviarMensaje(mensajeAEnviar);
    this.cdr.detectChanges();
  }

  private esDeEstaConversacion(msg: any): boolean {
    const r = this.receptorUsername;
    const m = this.usuarioLogueado.username;
    return (msg.remitente.username === r && msg.destinatario.username === m) ||
           (msg.remitente.username === m && msg.destinatario.username === r);
  }
}
