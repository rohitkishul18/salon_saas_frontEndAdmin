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

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }, // optional if needed

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
  ]
},
  // Wildcard redirect
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
