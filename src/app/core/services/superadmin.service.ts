import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SuperadminService {
  private BASE_URL = 'http://localhost:5000/api/superadmin';
  constructor(private http: HttpClient) { }

  getDashboardStats() {
    return this.http.get(`${this.BASE_URL}/dashboard`);
  }

  getAllSalons() {
    return this.http.get(`${this.BASE_URL}/salons`);
  }


  updateOwnerStatus(salonId: string, isActive: boolean) {
    return this.http.put(`${this.BASE_URL}/salon-owner/status/${salonId}`, { isActive });
  }

}
