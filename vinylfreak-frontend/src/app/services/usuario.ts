import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private API_URL = 'https://vinylfreak-backend.onrender.com/usuarios';

  constructor(private http: HttpClient) { }

  // GET: Traer la lista de usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API_URL);
  }

  // POST: Registrar un usuario nuevo
  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(this.API_URL, usuario);
  }

  // --- FUNCIÓN PARA EL LOGIN ---
  login(email: string, password: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API_URL}/login?email=${email}&password=${password}`);
  }

  // --- NUEVAS FUNCIONES DE RED SOCIAL ---

  /**
   * Realiza la acción de seguir o dejar de seguir a un usuario.
   * @param usernameASeguir El nombre del usuario al que queremos seguir.
   * @param miUsername Nuestro nombre de usuario (el que realiza la acción).
   */
  toggleSeguir(usernameASeguir: string, miUsername: string): Observable<any> {
    return this.http.post(`${this.API_URL}/${usernameASeguir}/seguir`, {
      seguidorUsername: miUsername
    });
  }

  /**
   * Comprueba si un usuario ya sigue a otro para gestionar el estado del botón.
   */
  comprobarSiSigue(miUsername: string, otroUsername: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.API_URL}/${miUsername}/sigue-a/${otroUsername}`);
  }

  /**
   * Busca usuarios por coincidencia de nombre para el buscador de comunidad.
   */
  buscarUsuarios(nombre: string): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.API_URL}/buscar?nombre=${nombre}`);
  }

  /**
   * Actualiza los datos del perfil (foto y biografía).
   */
  actualizarPerfil(id: number, datos: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API_URL}/${id}/actualizar-perfil`, datos);
  }
}
