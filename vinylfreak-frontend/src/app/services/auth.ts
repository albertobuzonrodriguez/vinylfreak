import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/usuarios`;

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  loginEvent = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const user = localStorage.getItem('usuario_logeado');

      if (!user || user === 'undefined' || user === 'null' || user === '{}' || user === '') {
        localStorage.removeItem('usuario_logeado');
        return false;
      }

      try {
        const parsed = JSON.parse(user);
        return !!parsed && Object.keys(parsed).length > 0;
      } catch (e) {
        return false;
      }
    }
    return false;
  }

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

  getUsuarioLogeado(): any {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('usuario_logeado');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
}
