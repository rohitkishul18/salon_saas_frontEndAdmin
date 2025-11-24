import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';  // <-- Import environment

@Injectable({
  providedIn: 'root'
})
export class SalonService {

  // Use environment API URL
  private baseUrl = `${environment.apiBaseUrl}/admin/dashboard`;

  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get(`${this.baseUrl}`);
  }
}
