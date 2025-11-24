import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {

  // Use environment API URL
  private BASE_URL = `${environment.apiBaseUrl}/superadmin`;

  constructor(private http: HttpClient) {}

  getDashboardStats() {
    return this.http.get(`${this.BASE_URL}/dashboard`);
  }

  getAllSalons() {
    return this.http.get(`${this.BASE_URL}/salons`);
  }

  updateOwnerStatus(salonId: string, isActive: boolean) {
    return this.http.put(
      `${this.BASE_URL}/salon-owner/status/${salonId}`, 
      { isActive }
    );
  }

}
