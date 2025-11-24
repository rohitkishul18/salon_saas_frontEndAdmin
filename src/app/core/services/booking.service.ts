import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';  // <-- Import environment

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  // Use environment API URL
  private baseUrl = `${environment.apiBaseUrl}/admin/booking`;

  constructor(private http: HttpClient) {}

  getBookings(page: number = 1, limit: number = 5): Observable<any> {
    return this.http.get(this.baseUrl, {
      params: {
        page: page.toString(),
        limit: limit.toString()
      }
    });
  }

  updateStatus(id: string, status: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}/status`, { status });
  }

  deleteBooking(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
