import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { PanelListComponent } from './components/panel-list/panel-list.component';
import { PanelEditComponent } from './components/panel-edit/panel-edit.component';
import { ClientComponent } from './components/client/client.component';

const routes: Routes = [
  
  {
    path: 'panel',
    component: PanelListComponent,
  },
  {
    path: 'panel/:id',
    component: PanelEditComponent,
  },
  {
    path: 'client',
    component: ClientComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    redirectTo: '/login', pathMatch: 'full'
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
