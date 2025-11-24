import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';  
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private API_URL = `${environment.apiBaseUrl}/admin/service`;

  constructor(private http: HttpClient) {}

  getServices(page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get(this.API_URL, { params });
  }

  addService(data: any) {
    return this.http.post(this.API_URL, data);
  }

  updateService(id: string, data: any) {
    return this.http.put(`${this.API_URL}/${id}`, data);
  }

  deleteService(id: string) {
    return this.http.delete(`${this.API_URL}/${id}`);
  }
}