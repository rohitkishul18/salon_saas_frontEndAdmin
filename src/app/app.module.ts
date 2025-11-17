import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { TableComponent } from './shared/table/table.component';
import { ModalComponent } from './shared/modal/modal.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponentSuperAdmin } from './pages/superadmin/dashboard/dashboard.component';
import { DashboardComponent } from './pages/owner/dashboard/dashboard.component';
import { SalonsComponent } from './pages/superadmin/salons/salons.component';
import { SalonInfoComponent } from './pages/owner/salon-info/salon-info.component';
import { LocationsComponent } from './pages/owner/locations/locations.component';
import { ServicesComponent } from './pages/owner/services/services.component';
import { GalleryComponent } from './pages/owner/gallery/gallery.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { TokenInterceptor } from './core/interceptors/token.interceptor';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BookingComponent } from './pages/owner/booking/booking.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    TableComponent,
    ModalComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponentSuperAdmin,
    DashboardComponent,
    SalonsComponent,
    SalonInfoComponent,
    LocationsComponent,
    ServicesComponent,
    GalleryComponent,
    BookingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule 
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
