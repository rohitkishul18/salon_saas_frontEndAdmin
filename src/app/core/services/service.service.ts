import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private API_URL = 'http://localhost:5000/api/admin/service';

  constructor(private http: HttpClient) {}

  getServices() {
    return this.http.get(this.API_URL);
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
