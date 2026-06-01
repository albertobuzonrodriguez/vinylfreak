import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { App } from './app';
import { ViniloLista } from './components/vinilo-lista/vinilo-lista';
import { Login } from './components/login/login';
import { routes } from './app.routes';
import { Registro } from './components/registro/registro';
import { Navbar } from './components/navbar/navbar';
import { Buscador } from './components/buscador/buscador';
import { BuscadorUsuarios } from './components/buscador-usuarios/buscador-usuarios';
import { Perfil } from './components/perfil/perfil';
import { ViniloDetalle } from './components/vinilo-detalle/vinilo-detalle';
import { Chat } from './components/chat/chat';
import { Inicio } from './components/inicio/inicio';
import { Admin } from './components/admin/admin';

@NgModule({
  declarations: [
    App,
    ViniloLista,
    Login,
    Registro,
    Navbar,
    Buscador,
    BuscadorUsuarios,
    Perfil,
    ViniloDetalle,
    Chat,
    Inicio,
    Admin
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  providers: [
    provideHttpClient(withFetch()),
    provideClientHydration()
  ],
  bootstrap: [App]
})
export class AppModule { }
