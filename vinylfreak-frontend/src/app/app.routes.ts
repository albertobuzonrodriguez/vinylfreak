import { Routes } from '@angular/router';
import { Buscador } from './components/buscador/buscador';
import { ViniloLista } from './components/vinilo-lista/vinilo-lista';
import { Login } from './components/login/login';
import { Registro } from './components/registro/registro';
import { BuscadorUsuarios } from './components/buscador-usuarios/buscador-usuarios';
import { authGuard } from './guards/auth-guard';
import { Perfil } from './components/perfil/perfil';
import { ViniloDetalle } from './components/vinilo-detalle/vinilo-detalle';
import { Chat } from './components/chat/chat';
import { Inicio } from './components/inicio/inicio';
import { Admin } from './components/admin/admin'; 

export const routes: Routes = [
  // 1. Al entrar a la raíz, si el guard lo permite, iremos a INICIO
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'registro', component: Registro },

  // Rutas protegidas
  { path: 'inicio', component: Inicio, canActivate: [authGuard] },
  { path: 'buscar', component: Buscador, canActivate: [authGuard] },
  { path: 'biblioteca', component: ViniloLista, canActivate: [authGuard] },
  { path: 'usuarios', component: BuscadorUsuarios, canActivate: [authGuard] },
  { path: 'mensajes', component: Chat, canActivate: [authGuard] },

  // Si 'perfil/:id' es para ver la colección de otro, ViniloLista debe estar preparado para recibir ese ID
  { path: 'perfil/:id', component: ViniloLista, canActivate: [authGuard] },

  { path: 'perfil-ajustes', component: Perfil, canActivate: [authGuard] },
  { path: 'vinilo/:id', component: ViniloDetalle, canActivate: [authGuard] },

  // Panel de Administración
  { path: 'admin', component: Admin, canActivate: [authGuard] }, // 👈 2. Añadimos la ruta protegida con el Guard

  // Comodín: cualquier ruta desconocida vuelve al inicio (el guard decidirá si login o feed)
  { path: '**', redirectTo: 'inicio' }
];
