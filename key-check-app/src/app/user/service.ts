import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:3000/api'; // Backend URL

  constructor(private http: HttpClient) {}

  // API Call for Login
  login(credentials: { userId: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // API Call to Get User Records
  getRecords(userId: string, role: string, delay: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/records`, {
      params: { userId, role, delay },
    });
  }

  // API Call to Get All Users (Only for Admins)
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  // API Call to Delete a User
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/${id}`);
  }

  // API Call to Create a New User
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/users`, user);
  }

  // API Call to Update a User
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/users/${id}`, user);
  }
}
