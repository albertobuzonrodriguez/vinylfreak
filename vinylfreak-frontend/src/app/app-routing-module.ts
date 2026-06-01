import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { ViniloLista } from './components/vinilo-lista/vinilo-lista';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Ponle la barra delante a login
  { path: 'login', component: Login },
  { path: 'vinilos', component: ViniloLista }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  { useHash: true })], // <-- AÑADE ESTO
  exports: [RouterModule]
})
export class AppRoutingModule { }
