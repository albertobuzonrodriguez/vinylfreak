import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false,
})
export class Login {
  // Variables vinculadas al HTML
  email = '';
  password = '';
  showPassword = false;
  errorMsg = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLogin() {
    this.errorMsg = '';

    // 🛠️ 1. INTERCEPCIÓN MAESTRA: Control de acceso directo para el Administrador
    if (this.email === 'admin' && this.password === 'admin') {
      console.log('Acceso maestro detectado: Inicializando Panel de Administración');

      const adminSession = {
        id: 0,
        username: 'admin',
        email: 'admin@vinylfreak.com',
        rol: 'ADMIN'
      };

      // Persistimos la sesión simulada para los Guards y el Navbar
      localStorage.setItem('usuario_logeado', JSON.stringify(adminSession));

      // Activamos el estado de sesión y redirigimos al entorno aislado de Admin
      this.authService.actualizarEstadoSesion(true);
      this.router.navigate(['/admin']);
      return;
    }

    // Lógica estándar para usuarios convencionales contra la base de datos
    const credentials = {
      username: this.email,
      password: this.password,
    };

    this.authService.login(credentials).subscribe({
      next: (usuarioRecibido) => {
        console.log('Login exitoso', usuarioRecibido);
        localStorage.setItem('usuario_logeado', JSON.stringify(usuarioRecibido));

        // Avisamos al servicio que hay sesión (esto activa el *ngIf en app.html)
        this.authService.actualizarEstadoSesion(true);

        // Navegamos sin recargar la página hacia el feed principal
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.errorMsg = 'Usuario o contraseña incorrectos';
        console.error(err);
      },
    });
  }
}
