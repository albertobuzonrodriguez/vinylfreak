import { Component, OnInit, Inject, PLATFORM_ID, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ViniloService } from '../../services/vinilo';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  styleUrls: ['./inicio.css'],
  standalone: false
})
export class Inicio implements OnInit {
  feed: any[] = [];
  usuarioLogueado: any = null;
  cargando: boolean = true;

  constructor(
    private viniloService: ViniloService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('usuario_logeado');
      if (userJson) {
        this.usuarioLogueado = JSON.parse(userJson);
        this.cargarFeed();
      }
    }
  }

  cargarFeed(): void {
    this.viniloService.getFeed(this.usuarioLogueado.username).subscribe({
      next: (data) => {
        // Inicializamos la propiedad local para mostrar/ocultar comentarios
        this.feed = data.map(item => ({ ...item, mostrarComentarios: false }));
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  darLike(item: any): void {
    // Lógica optimista: actualizamos en la UI antes de que responda el servidor
    if (this.yaTieneLike(item)) {
      item.likesUsuarios = item.likesUsuarios.filter((id: number) => id !== this.usuarioLogueado.id);
    } else {
      if (!item.likesUsuarios) item.likesUsuarios = [];
      item.likesUsuarios.push(this.usuarioLogueado.id);
    }

    // Llamada al servicio (debes crear este método en tu ViniloService)
    this.viniloService.toggleLike(item.id, this.usuarioLogueado.id).subscribe();
  }

  yaTieneLike(item: any): boolean {
    return item.likesUsuarios?.includes(this.usuarioLogueado.id);
  }

  toggleComentarios(item: any): void {
    item.mostrarComentarios = !item.mostrarComentarios;
  }

  enviarComentario(item: any, texto: string): void {
    if (!texto.trim()) return;

    const nuevo = { username: this.usuarioLogueado.username, texto: texto };
    if (!item.comentarios) item.comentarios = [];
    item.comentarios.push(nuevo);

    // Llamada al servicio (debes crear este método en tu ViniloService)
    this.viniloService.comentar(item.id, nuevo).subscribe();
  }
}
