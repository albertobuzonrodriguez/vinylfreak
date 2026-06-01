import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  standalone: false,
})
export class Perfil implements OnInit {
  usuario: any = {};
  editando: boolean = false;
  mensajes: any[] = [
    {
      remitente: 'Admin',
      contenido: '¡Bienvenido a tu perfil! Tus estadísticas se actualizan en tiempo real.',
      fecha: new Date(),
    },
  ];

  vinilosColeccion: any[] = [];
  chart: any = null;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      const userJson = localStorage.getItem('usuario_logeado');
      if (userJson) {
        this.usuario = JSON.parse(userJson);
        this.cargarEstadisticas();
      }
    }
  }

  cargarEstadisticas() {
    const url = `http://localhost:8080/api/coleccion/usuario/${this.usuario.id}`;
    this.http.get<any[]>(url).subscribe({
      next: (res) => {
        this.vinilosColeccion = res;
        this.cdr.detectChanges();
        if (this.vinilosColeccion.length > 0) {
          setTimeout(() => this.generarGrafica(), 150);
        }
      },
    });
  }

  generarGrafica() {
    const conteo = this.obtenerConteoGeneros();
    const etiquetas = Object.keys(conteo);
    const valores = Object.values(conteo);

    if (etiquetas.length === 0) return;

    const canvas = document.getElementById('canvasGeneros') as HTMLCanvasElement;
    if (!canvas) return;

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: etiquetas,
        datasets: [
          {
            data: valores,
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
              '#C9CBCF',
              '#05ffa1',
            ],
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 15,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // Bloqueamos clics para que sea estático
        onClick: () => null,
        plugins: {
          // ✅ ESTO QUITA LA LEYENDA GRIS DE ABAJO
          legend: {
            display: false,
          },
          tooltip: {
            displayColors: false,
            callbacks: {
              title: () => '',
              label: (context: any) => ` Género: ${context.label}`,
            },
          },
        },
      },
    });
  }

  private obtenerConteoGeneros() {
    const conteo: any = {};
    if (!this.vinilosColeccion || this.vinilosColeccion.length === 0) return conteo;

    this.vinilosColeccion.forEach((item) => {
      const viniloInfo = item.vinilo;
      if (!viniloInfo) return;

      const dataRaw = viniloInfo.genero || viniloInfo.estilo || '';
      let lista: string[] = [];

      if (typeof dataRaw === 'string' && dataRaw.length > 0) {
        lista = dataRaw.split(',').map((g) => g.trim());
      } else if (Array.isArray(dataRaw)) {
        lista = dataRaw;
      }

      lista.forEach((g) => {
        if (g && g.trim().length > 0) {
          const nombre = g.trim().charAt(0).toUpperCase() + g.trim().slice(1).toLowerCase();
          conteo[nombre] = (conteo[nombre] || 0) + 1;
        }
      });
    });
    return conteo;
  }

  toggleEdicion() {
    this.editando = !this.editando;
  }

  guardarCambios() {
    const url = `http://localhost:8080/api/usuarios/${this.usuario.id}/actualizar-perfil`;
    this.http.put(url, this.usuario).subscribe({
      next: (res: any) => {
        localStorage.setItem('usuario_logeado', JSON.stringify(res));
        this.usuario = res;
        this.editando = false;
        alert('✅ Perfil actualizado');
      },
    });
  }
}
