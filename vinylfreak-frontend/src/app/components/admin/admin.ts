import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  private ADMIN_API = 'http://localhost:8080/api/admin';
  private AUTH_API = 'http://localhost:8080/api/auth'; 

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.cargarStats();
    this.cargarUsuarios();
  }

  cargarStats() {
    this.http.get(`${this.ADMIN_API}/stats`).subscribe(data => this.stats = data);
  }

  cargarUsuarios() {
    // Reutiliza tu endpoint genérico del backend que devuelve la lista de usuarios
    this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe(data => this.usuarios = data);
  }

  registrarUsuarioAdmin() {
    if (!this.nuevoUsuario.username || !this.nuevoUsuario.email || !this.nuevoUsuario.password) return;

    // Reutilizamos tu lógica de registro en el backend
    this.http.post(`${this.AUTH_API}/registro`, this.nuevoUsuario).subscribe({
      next: () => {
        alert('Usuario creado con éxito en la base de datos');
        this.nuevoUsuario = { username: '', email: '', password: '' }; // Limpiar formulario
        this.cargarUsuarios(); // Refrescar la tabla
        this.cargarStats();    // Refrescar los números
      },
      error: (err) => alert('Error al crear el usuario: ' + err.error?.mensaje || 'Datos duplicados')
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
