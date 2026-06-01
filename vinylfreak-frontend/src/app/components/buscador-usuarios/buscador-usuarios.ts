import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { UsuarioService } from '../../services/usuario';

@Component({
  selector: 'app-buscador-usuarios',
  templateUrl: './buscador-usuarios.html',
  standalone: false,
})
export class BuscadorUsuarios implements OnInit {
  filtro: string = '';
  usuarios: any[] = [];
  usuarioLogueado: any = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef, // 👈 Inyectado para forzar el repintado inmediato
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    // 🛡️ Seguridad SSR: Solo ejecutamos localStorage en el navegador
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('usuario_logeado');
      if (userJson) {
        this.usuarioLogueado = JSON.parse(userJson);
      }
    }
  }

  buscar() {
    if (this.filtro.length > 1) {
      this.http
        .get<any[]>(`http://localhost:8080/api/usuarios/buscar?nombre=${this.filtro}`)
        .subscribe((res) => {
          this.usuarios = res;

          // Sincronizamos el estado de seguimiento inicial para cada usuario encontrado
          if (this.usuarioLogueado) {
            this.usuarios.forEach(u => {
              this.usuarioService.comprobarSiSigue(this.usuarioLogueado.username, u.username)
                .subscribe(sigue => {
                  u.siguiendo = sigue;
                  this.cdr.detectChanges(); // Forzamos a Angular a mostrar el estado real
                });
            });
          }
        });
    } else {
      this.usuarios = [];
    }
  }

  verPerfil(id: number) {
    this.router.navigate(['/perfil', id]);
  }

  irAlChat(event: Event, username: string) {
    event.stopPropagation();
    this.router.navigate(['/mensajes'], { queryParams: { receptor: username } });
  }

  /**
   * Gestiona el seguimiento con Actualización Optimista y Detección Forzada
   */
  seguirUsuario(event: any, usuarioDestino: any) {
    event.stopPropagation(); // Evita que el clic dispare la navegación al perfil

    if (!this.usuarioLogueado) {
      alert("Debes iniciar sesión para realizar esta acción.");
      return;
    }

    // 🚀 ACTUALIZACIÓN OPTIMISTA: Cambiamos el valor local antes de la respuesta del servidor
    const estadoPrevio = usuarioDestino.siguiendo;
    usuarioDestino.siguiendo = !usuarioDestino.siguiendo;

    // 👈 CLAVE: Obligamos a Angular a repintar el botón en este preciso instante
    this.cdr.detectChanges();

    const miUsername = this.usuarioLogueado.username;

    this.usuarioService.toggleSeguir(usuarioDestino.username, miUsername).subscribe({
      next: () => {
        // La operación fue exitosa, el estado ya está cambiado
        console.log(`Estado de seguimiento actualizado para: ${usuarioDestino.username}`);
      },
      error: (err) => {
        // 🔄 ROLLBACK: Si el servidor falla, revertimos al estado original
        console.error('Error en el servidor, revirtiendo estado visual:', err);
        usuarioDestino.siguiendo = estadoPrevio;
        this.cdr.detectChanges(); // Repintamos para volver al estado anterior
        alert("Hubo un error al procesar la solicitud.");
      },
    });
  }
}
