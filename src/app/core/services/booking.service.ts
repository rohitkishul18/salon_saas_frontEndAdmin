import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private baseUrl = 'http://localhost:5000/api/admin/booking';

  constructor(private http: HttpClient) {}

  getBookings(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, { status });
  }

  deleteBooking(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  } 
}
