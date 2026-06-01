import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.html',
  standalone: false
})
export class Registro {
  // Inicializamos un objeto usuario vacío
  nuevoUsuario: Usuario = {
    username: '',
    email: '',
    password: ''
  };

  errorMsg = '';
  showPassword = false;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  onRegistro(): void {
    // Validación simple
    if (!this.nuevoUsuario.username || !this.nuevoUsuario.email || !this.nuevoUsuario.password) {
      this.errorMsg = 'Por favor, rellena todos los campos';
      return;
    }

    this.usuarioService.registrar(this.nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Usuario registrado con éxito', res);
        alert('Cuenta creada correctamente. ¡Ya puedes identificarte!');
        this.router.navigate(['/login']); // Redirigimos al login tras el éxito
      },
      error: (err) => {
        console.error('Error al registrar', err);
        this.errorMsg = 'No se pudo crear la cuenta. Puede que el email ya esté en uso.';
      }
    });
  }
}
