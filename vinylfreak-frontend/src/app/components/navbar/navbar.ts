import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../services/auth';
import { Subscription, interval } from 'rxjs'; // 👈 Añadido interval
import { filter } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'; // 👈 Asegúrate de tenerlo

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: false,
})
export class Navbar implements OnInit, OnDestroy {
  username: string | null = null;
  usuarioLogueado: any = null;
  private routerSub: Subscription | undefined;
  private notifSub: Subscription | undefined;

  // Variables para notificaciones
  mostrarNotificaciones = false;
  notificaciones: any[] = [];
  notificacionesSinLeer = 0;

  constructor(
    private router: Router,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private http: HttpClient, // 👈 Inyectamos HttpClient
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.actualizarUsuario();

    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.actualizarUsuario();
        this.cdr.detectChanges();
      });

    // 🕒 CONFIGURACIÓN DE NOTIFICACIONES REALES (Polling cada 10 seg)
    if (isPlatformBrowser(this.platformId)) {
      this.cargarNotificaciones();
      this.notifSub = interval(10000).subscribe(() => {
        if (this.authService.isLoggedIn()) {
          this.cargarNotificaciones();
        }
      });
    }
  }

  cargarNotificaciones(): void {
    if (!this.usuarioLogueado) return;

    this.http
      .get<any[]>(`http://localhost:8080/api/notificaciones/${this.usuarioLogueado.username}`)
      .subscribe({
        next: (data) => {
          this.notificaciones = data;
          this.notificacionesSinLeer = data.filter((n) => !n.leida).length;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error cargando notificaciones', err),
      });
  }

  toggleNotificaciones(): void {
    this.mostrarNotificaciones = !this.mostrarNotificaciones;

    // Si abrimos y hay notificaciones sin leer, las marcamos como leídas
    if (this.mostrarNotificaciones && this.notificacionesSinLeer > 0) {
      this.http
        .post(
          `http://localhost:8080/api/notificaciones/marcar-leidas/${this.usuarioLogueado.username}`,
          {},
        )
        .subscribe(() => {
          this.notificacionesSinLeer = 0;
          this.notificaciones.forEach((n) => (n.leida = true));
          this.cdr.detectChanges();
        });
    }
  }

  sesionActiva(): boolean {
    return this.authService.isLoggedIn();
  }

  actualizarUsuario(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('usuario_logeado');
      if (userJson) {
        this.usuarioLogueado = JSON.parse(userJson);
        this.username = this.usuarioLogueado.username || this.usuarioLogueado.email || 'Usuario';
        this.cdr.detectChanges();
      }
    }
  }

  mostrarFlechaAtras(): boolean {
    return (
      this.router.url.includes('/vinilo/') ||
      (this.router.url.includes('/perfil/') && !this.router.url.includes('/perfil-ajustes'))
    );
  }

  irAtras(): void {
    if (isPlatformBrowser(this.platformId)) window.history.back();
  }

  cerrarSesion(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('usuario_logeado');
      this.usuarioLogueado = null;
      this.username = null;
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    if (this.routerSub) this.routerSub.unsubscribe();
    if (this.notifSub) this.notifSub.unsubscribe(); // 👈 Limpiamos el intervalo
  }

  esRutaAdmin(): boolean {
    return this.router.url === '/admin';
  }
}
