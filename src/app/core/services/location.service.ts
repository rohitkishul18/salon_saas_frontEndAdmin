import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // <-- Import environment

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  // Use environment API URL
  private API = `${environment.apiBaseUrl}/admin/location`;

  constructor(private http: HttpClient) {}

  getLocations(page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (page !== undefined) {
      params = params.set('page', page.toString());
    }
    if (limit !== undefined) {
      params = params.set('limit', limit.toString());
    }
    return this.http.get(this.API, { params });
  }

  createLocation(data: any): Observable<any> {
    return this.http.post(this.API, data);
  }

  updateLocation(id: string, data: any): Observable<any> {
    return this.http.put(`${this.API}/${id}`, data);
  }

  deleteLocation(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }
}