import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  url="http://127.0.0.1:8000";
  constructor(private authService:AuthService,
              private http:HttpClient,) { }

  getUserData(email:string){
    // return this.authService.idtoken().then((token)=>{
    //   this.http.post<any>("/api/auth-user/",{token:token,email:email}).toPromise()
    // });
  }
  setUserData(email:string,userType:string){
    // return this.authService.idtoken().then((token)=>{
    //   this.http.post<any>("/api/new-user",{token:token,email:email,userType:userType}).toPromise()
    // });
  }
  getProducts(){}
  addProducts(){}
}
