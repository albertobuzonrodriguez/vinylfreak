import { Component, NgZone, ChangeDetectorRef, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DiscogsService } from '../../services/discogs';
import { ColeccionService } from '../../services/coleccion';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.html',
  styleUrls: ['./buscador.css'],
  standalone: false,
})
export class Buscador implements OnInit {
  terminoBusqueda: string = '';
  resultados: any[] = [];
  cargando: boolean = false;
  mensajeToast: string | null = null;

  constructor(
    private discogsService: DiscogsService,
    private coleccionService: ColeccionService,
    private router: Router,
    private route: ActivatedRoute,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const query = params['q'];
      if (query) {
        this.terminoBusqueda = query;
        this.buscar(); // Reutilizamos el método principal
      }
    });
  }

  buscar(): void {
    const t = this.terminoBusqueda.trim();
    if (t.length > 2) {
      this.cargando = true;
      this.resultados = [];

      this.discogsService.buscar(t).subscribe({
        next: (res: any) => {
          this.zone.run(() => {
            this.resultados = res.results || res;
            this.cargando = false;
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.zone.run(() => {
            console.error('Error:', err);
            this.cargando = false;
            this.cdr.detectChanges();
          });
        }
      });
    }
  }

  agregarAColeccion(disco: any): void {
    const userJson = localStorage.getItem('usuario_logeado');
    if (!userJson) return;
    const usuario = JSON.parse(userJson);

    this.coleccionService.agregarDesdeDiscogs(disco, usuario.id).subscribe({
      next: () => {
        this.zone.run(() => {
          // 0% alerts, 100% Toast
          this.mensajeToast = `¡${disco.title} añadido!`;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.mensajeToast = null;
            this.cdr.detectChanges();
          }, 3000);
        });
      }
    });
  }

  verDetalle(id: number, portadaUrl: string): void {
    this.router.navigate(['/vinilo', id], {
      queryParams: { portada: portadaUrl },
    });
  }
}
