import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColeccionService {
  private apiUrl = 'https://vinylfreak-backend.onrender.com/coleccion';
  nuevaEntradaEvent = new EventEmitter<void>();

  constructor(private http: HttpClient) { }

  agregarDesdeDiscogs(vinilo: any, usuarioId: number): Observable<any> {

  // Función ultra-segura para convertir cualquier cosa a texto plano
  const forceString = (val: any): string => {
    if (Array.isArray(val)) {
      return val.map(v => typeof v === 'object' ? (v.name || JSON.stringify(v)) : v).join(', ');
    }
    if (typeof val === 'object' && val !== null) {
      return val.name || JSON.stringify(val);
    }
    return val ? String(val) : 'Desconocido';
  };

  // Extraemos el artista buscando en todos los sitios posibles de la respuesta de Discogs
  let artistaRaw = 'Desconocido';
  if (vinilo.title && vinilo.title.includes(' - ')) {
    artistaRaw = vinilo.title.split(' - ');
  } else if (vinilo.artists) {
    artistaRaw = vinilo.artists;
  } else if (vinilo.artist) {
    artistaRaw = vinilo.artist;
  }

  // CREAMOS UN OBJETO NUEVO DESDE CERO (Sin referencias al original)
  const body = {
    titulo: forceString(vinilo.title?.split(' - ').pop()),
    artista: forceString(artistaRaw), // <-- Aquí forzamos que sea STRING sí o sí
    urlPortada: forceString(vinilo.cover_image || vinilo.thumb),
    discogsId: Number(vinilo.id),
    anioLanzamiento: vinilo.year ? parseInt(vinilo.year) : null,
    genero: forceString(vinilo.genre),
    estilo: forceString(vinilo.style),
    sello: forceString(vinilo.label)
  };

  console.log('JSON FINAL QUE SALE HACIA JAVA:', JSON.stringify(body));

  return this.http.post(`${this.apiUrl}/add-from-discogs?usuarioId=${usuarioId}&estado=Mint`, body).pipe(
      tap(() => {
        // Al emitir aquí, cualquier componente que escuche se refrescará
        this.nuevaEntradaEvent.emit();
      })
    );
}
  obtenerBiblioteca(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  eliminarItem(id: number): Observable<any> {
    // Asegúrate de que en tu Java el DeleteMapping sea /api/coleccion/eliminar/{id}
    return this.http.delete(`${this.apiUrl}/eliminar/${id}`).pipe(
      tap(() => {
        // Notificamos que la colección ha cambiado para que se refresque
        this.nuevaEntradaEvent.emit();
      })
    );
  }
}
