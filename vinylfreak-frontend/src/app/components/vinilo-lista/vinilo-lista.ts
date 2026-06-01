import {
  Component,
  OnInit,
  Inject,
  PLATFORM_ID,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ColeccionService } from '../../services/coleccion';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-vinilo-lista',
  templateUrl: './vinilo-lista.html',
  styleUrls: ['./vinilo-lista.css'],
  standalone: false,
})
export class ViniloLista implements OnInit, OnDestroy {
  coleccion: any[] = [];
  cargando: boolean = true;
  esPerfilAjeno: boolean = false;
  mensajeToast: string | null = null; // Para notificar el borrado
  private suscripciones: Subscription = new Subscription();

  constructor(
    private coleccionService: ColeccionService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.intentarCargar();
    }
    this.suscripciones.add(
      this.coleccionService.nuevaEntradaEvent.subscribe(() => this.intentarCargar()),
    );
  }

  intentarCargar() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.esPerfilAjeno = true;
      this.ejecutarCarga(Number(idParam));
    } else {
      this.esPerfilAjeno = false;
      const userJson = localStorage.getItem('usuario_logeado');
      if (userJson) {
        const usuario = JSON.parse(userJson);
        this.ejecutarCarga(usuario.id);
      } else {
        this.cargando = false;
        this.cdr.detectChanges();
      }
    }
  }

  ejecutarCarga(userId: number) {
    this.cargando = true;
    this.cdr.detectChanges(); // Forzamos que se vea el spinner al empezar

    this.coleccionService.obtenerBiblioteca(userId).subscribe({
      next: (res) => {
        // Usamos zone.run para que Angular "despierte" al recibir los datos
        this.zone.run(() => {
          this.coleccion = res;
          this.cargando = false;
          this.cdr.detectChanges(); // Forzamos el repintado de los vinilos
        });
      },
      error: (err) => {
        this.zone.run(() => {
          console.error('❌ Error al cargar biblioteca:', err);
          this.cargando = false;
          this.cdr.detectChanges();
        });
      },
    });
  }

  // Borrado sin confirm() nativo, usando Toast
  eliminar(itemId: number, titulo: string) {
    this.coleccionService.eliminarItem(itemId).subscribe({
      next: () => {
        this.zone.run(() => {
          this.mensajeToast = `Eliminado: ${titulo}`;
          this.coleccion = this.coleccion.filter((item) => item.id !== itemId);
          this.cdr.detectChanges();
          setTimeout(() => {
            this.mensajeToast = null;
            this.cdr.detectChanges();
          }, 3000);
        });
      },
    });
  }

  buscarRapido(artista: string) {
    this.router.navigate(['/buscar'], { queryParams: { q: artista } });
  }

  ngOnDestroy(): void {
    this.suscripciones.unsubscribe();
  }
}
