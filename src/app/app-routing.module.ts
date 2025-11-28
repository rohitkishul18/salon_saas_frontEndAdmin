import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/owner/dashboard/dashboard.component';
import { DashboardComponentSuperAdmin } from './pages/superadmin/dashboard/dashboard.component';
import { SalonsComponent } from './pages/superadmin/salons/salons.component';
import { SalonInfoComponent } from './pages/owner/salon-info/salon-info.component';
import { LocationsComponent } from './pages/owner/locations/locations.component';
import { ServicesComponent } from './pages/owner/services/services.component';
import { GalleryComponent } from './pages/owner/gallery/gallery.component';
import { authGuard } from './core/guards/auth.guard';
import { BookingComponent } from './pages/owner/booking/booking.component';
import { LayoutdashbordComponent } from './pages/superadmin/layoutdashbord/layoutdashbord.component';
import { ForgetPasswordComponent } from './pages/auth/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { UserComponent } from './pages/owner/user/user.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, 
  {path:'forgot-password',component:ForgetPasswordComponent},
  {path :'reset-password', component:ResetPasswordComponent},

  // Superadmin Routes
{
  path: 'superadmin',
  component: LayoutdashbordComponent,
  canActivate: [authGuard],
  data: { roles: ['superadmin'] },
  children: [
    { path: '', redirectTo: 'layoutdashbord', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponentSuperAdmin }, 
    { path: 'salons', component: SalonsComponent }
  ]
},
// Salon Owner Routes
 {
  path: 'salon-owner',
  component: SalonInfoComponent,
  canActivate: [authGuard],
  data: { roles: ['salon-owner'] },
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'locations', component: LocationsComponent },
    { path: 'services', component: ServicesComponent },
     {path:'booking',component:BookingComponent},
     {path:'user', component:UserComponent},
  ]
},
  // Wildcard redirect
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
