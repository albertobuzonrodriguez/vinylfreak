import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DiscogsService {
  private token = 'HDBGzzEyAScMwtMDoRKrKMdbTJCFWSFpdZXWGsCB';
  private baseUrl = 'https://api.discogs.com/database/search';

  constructor(private http: HttpClient) {}

  buscar(termino: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Discogs token=${this.token}`,
      'User-Agent': 'VinylFreakApp/1.0', // Es buena práctica incluirlo siempre
    });

    // Cambiado per_page a 100 para obtener muchos más resultados
    const url = `${this.baseUrl}?q=${termino}&type=release&format=vinyl&per_page=100`;

    return this.http.get<any>(url, { headers }).pipe(
      map((response) => response.results)
    );
  }

  obtenerDetalle(id: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Discogs token=${this.token}`,
      'User-Agent': 'VinylFreakApp/1.0',
    });

    const url = `https://api.discogs.com/releases/${id}`;
    console.log('Solicitando detalles a:', url);

    return this.http.get<any>(url, { headers });
  }
}
