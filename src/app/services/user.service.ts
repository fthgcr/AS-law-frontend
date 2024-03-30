import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../consts/environment';
import { UserLoginRequestWithIdentity } from '../models/UserLoginRequestWithIdentity';
import { UserLoginRequestWithToken } from '../models/UserLoginRequestWithToken';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any[]>{
    return this.http.get<any[]>(`${environment.apiURL}/user/getUserList`);
  }

  getUserData(identity : String): Observable<any>{
    return this.http.get<any>(`${environment.apiURL}/user/getUserData/${identity}`);
  }

  getUser(id : number): Observable<any>{
    return this.http.get<any>(`${environment.apiURL}/user/getUser/${id}`);
  }

  loginWithIdentify(data: UserLoginRequestWithIdentity): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/user/loginWithIdentity`, data);
  }

  loginWithToken(data: UserLoginRequestWithToken): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/user/loginWithToken`, data);
  }

  updateUser(data: User): Observable<any> {
    return this.http.put<any>(`${environment.apiURL}/user/updateUser`, data);
  }

  createUser(data: User): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/user/createUser`, data);
  }
  

}
