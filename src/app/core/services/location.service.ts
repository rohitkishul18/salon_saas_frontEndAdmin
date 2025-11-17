import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  private API = 'http://localhost:5000/api/admin/location';

  constructor(private http: HttpClient) {}

  getLocations(): Observable<any> {
    return this.http.get(this.API);
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
