import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private API_URL = `${environment.apiUrl}/api/usuarios`;

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, usuario);
  }

  login(email: string, password: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/login?email=${email}&password=${password}`);
  }

  toggleSeguir(usernameASeguir: string, miUsername: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${usernameASeguir}/seguir`, {
      seguidorUsername: miUsername
    });
  }

  comprobarSiSigue(miUsername: string, otroUsername: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/${miUsername}/sigue-a/${otroUsername}`);
  }

  buscarUsuarios(nombre: string): Observable<Usuario[]> {
    // Corregida la concatenación del query string para el buscador de comunidad
    return this.http.get<Usuario[]>(`${this.API_URL}/buscar?nombre=${nombre}`);
  }

  actualizarPerfil(id: number, datos: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}/actualizar-perfil`, datos);
  }

  // NUEVO: Añadido servicio para resolver las notificaciones dinámicas del usuario de la captura
  getNotificaciones(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/notificaciones/${username}`);
  }
}
