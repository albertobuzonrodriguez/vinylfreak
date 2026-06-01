import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';


@Component({
  selector: 'app-admin',
  templateUrl: './admin.html',
  styleUrls: ['./admin.css'],
  standalone: false
})
export class Admin implements OnInit {
  stats: any = null;
  usuarios: any[] = [];

  // Objeto enlazado al formulario de creación
  nuevoUsuario = {
    username: '',
    email: '',
    password: ''
  };

  // Construimos las URLs dinámicamente usando la variable de Render
  private ADMIN_API = `${environment.apiUrl}/api/admin`;
  private AUTH_API = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarStats();
    this.cargarUsuarios();
  }

  cargarStats() {
    this.http.get(`${this.ADMIN_API}/stats`).subscribe(data => this.stats = data);
  }

  cargarUsuarios() {
    // Corregido también este endpoint para que apunte al backend en producción
    this.http.get<any[]>(`${environment.apiUrl}/api/usuarios`).subscribe(data => this.usuarios = data);
  }

  registrarUsuarioAdmin() {
    if (!this.nuevoUsuario.username || !this.nuevoUsuario.email || !this.nuevoUsuario.password) return;

    this.http.post(`${this.AUTH_API}/registro`, this.nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario creado con éxito en la base de datos');
        this.nuevoUsuario = { username: '', email: '', password: '' }; // Limpiar formulario
        this.cargarUsuarios(); // Refrescar la tabla
        this.cargarStats();    // Refrescar los números
      },
      error: (err) => alert('Error al crear el usuario: ' + (err.error?.mensaje || 'Datos duplicados'))
    });
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Estás completamente seguro de que deseas eliminar a este usuario? Esta acción es irreversible y borrará sus colecciones.')) {
      this.http.delete(`${this.ADMIN_API}/usuarios/${id}`).subscribe(() => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.cargarStats();
      });
    }
  }
}
