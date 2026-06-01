import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from './services/auth'; // Asegúrate de que la ruta sea correcta

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css',
})
export class App implements OnInit {
  mostrarNavbar: boolean = false;

  constructor(private authService: AuthService) {
    // Comprobación inmediata antes de que se pinte nada
    this.mostrarNavbar = this.authService.isLoggedIn();
  }

  ngOnInit(): void {
    this.authService.loginEvent.subscribe((estado: boolean) => {
      console.log('Cambio de estado Navbar:', estado); // Pon este log para debuguear
      this.mostrarNavbar = estado;
    });
  }
  actualizarVisibilidadNavbar(): void {
    this.mostrarNavbar = this.authService.isLoggedIn();
  }
}
