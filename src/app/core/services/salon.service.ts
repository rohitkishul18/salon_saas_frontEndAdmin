import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SalonService {

  private baseUrl = 'http://localhost:5000/api/admin/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard() {
    return this.http.get(`${this.baseUrl}`);
  }
}
