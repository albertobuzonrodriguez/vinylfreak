import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vinilo } from '../models/vinilo';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class ViniloService {
  private API_URL = `${environment.apiUrl}/api/vinilos`;

  constructor(private http: HttpClient) {}

  getVinilos(): Observable<Vinilo[]> {
    return this.http.get<Vinilo[]>(this.API_URL);
  }

  crearVinilo(vinilo: any): Observable<Vinilo> {
    return this.http.post<Vinilo>(`${this.API_URL}/guardar`, vinilo);
  }

  getFeed(username: string): Observable<Vinilo[]> {
    return this.http.get<Vinilo[]>(`${this.API_URL}/feed/${username}`);
  }

  toggleLike(itemId: number, usuarioId: number): Observable<any> {
    return this.http.post(`${this.API_URL}/${itemId}/like?usuarioId=${usuarioId}`, {});
  }

  comentar(itemId: number, comentario: any): Observable<any> {
    return this.http.post(`${this.API_URL}/${itemId}/comentar`, comentario);
  }
}
