import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://vinylfreak-backend.onrender.com/usuarios';

  // Cambiamos EventEmitter por BehaviorSubject para manejar el estado de forma reactiva
  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  loginEvent = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem('usuario_logeado');

      // Si el valor es nulo, vacío o literal "undefined", devolvemos FALSE
      if (!user || user === 'undefined' || user === 'null' || user === '{}' || user === '') {
        // Limpiamos el rastro corrupto para que no vuelva a molestar
        localStorage.removeItem('usuario_logeado');
        return false;
      }

      try {
        const parsed = JSON.parse(user);
        return !!parsed && Object.keys(parsed).length > 0;
      } catch (e) {
        return false; // Si el JSON está mal formado, no está logueado
      }
    }
    return false;
  }

  // Este método ahora actualiza el "cartel" (Subject) para que todos se enteren
  actualizarEstadoSesion(estado: boolean) {
    if (typeof window !== 'undefined') {
      if (!estado) {
        localStorage.removeItem('usuario_logeado');
      }
    }
    this.loggedIn.next(estado);
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  registro(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario);
  }

  // Método auxiliar para obtener el usuario guardado (útil para las gráficas después)
  getUsuarioLogeado(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('usuario_logeado');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}
