import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ColeccionService {
  private apiUrl = `${environment.apiUrl}/api/coleccion`;
  nuevaEntradaEvent = new EventEmitter<void>();

  constructor(private http: HttpClient) { }

  agregarDesdeDiscogs(vinilo: any, usuarioId: number): Observable<any> {
    const forceString = (val: any): string => {
      if (Array.isArray(val)) {
        return val.map(v => typeof v === 'object' ? (v.name || JSON.stringify(v)) : v).join(', ');
      }
      if (typeof val === 'object' && val !== null) {
        return val.name || JSON.stringify(val);
      }
      return val ? String(val) : 'Desconocido';
    };

    let artistaRaw = 'Desconocido';
    if (vinilo.title && vinilo.title.includes(' - ')) {
      artistaRaw = vinilo.title.split(' - ')[0];
    } else if (vinilo.artists) {
      artistaRaw = vinilo.artists;
    } else if (vinilo.artist) {
      artistaRaw = vinilo.artist;
    }

    const body = {
      titulo: forceString(vinilo.title?.split(' - ').pop()),
      artista: forceString(artistaRaw),
      urlPortada: forceString(vinilo.cover_image || vinilo.thumb),
      discogsId: Number(vinilo.id),
      anioLanzamiento: vinilo.year ? parseInt(vinilo.year) : null,
      genero: forceString(vinilo.genre),
      estilo: forceString(vinilo.style),
      sello: forceString(vinilo.label)
    };

    return this.http.post(`${this.apiUrl}/add-from-discogs?usuarioId=${usuarioId}&estado=Mint`, body).pipe(
      tap(() => {
        this.nuevaEntradaEvent.emit();
      })
    );
  }

  obtenerBiblioteca(usuarioId: number): Observable<any[]> {
    // Corregido: Enrutamiento directo al endpoint relacional de Java
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  eliminarItem(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`).pipe(
      tap(() => {
        this.nuevaEntradaEvent.emit();
      })
    );
  }
}
