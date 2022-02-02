import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,
    public ngZone: NgZone,
    public http:HttpClient// NgZone service to remove outside scope warning
  ) {
    this.afAuth.authState.subscribe(user => {
     try{ 
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')||"");
      } else {
        localStorage.setItem('user','');
        JSON.parse(localStorage.getItem('user')||"");
      }
    }
    catch{
    }}
    )
  }

   distance(latitude:any,longitude:any){
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'5b3ce3597851110001cf624880d3b58c2b084f43b62d26afb09918a4' });
      let options = { headers: headers };
     return this.http.post<any>("https://api.openrouteservice.org/v2/matrix/driving-car",
     {"locations":[[9.70093,48.477473],[latitude,longitude]],"metrics":["distance","duration"],"units":"km"},
              options
              )
              .toPromise()
   }
  url="http://127.0.0.1:8000";
  getcurrentuser(){
    this.afAuth.currentUser.then(resp=>{
      console.log("afauth",resp)
      return resp;
    })
  }
  getUserType(email:string){
    this.afAuth.currentUser.then(u=>{
      u?.getIdToken().then(token=>{
        this.http.post<any>(this.url+"/api/auth-user/",{token:token,email:email}).toPromise().then(resp=>{
          localStorage.setItem('userType',resp);
          console.log(localStorage.getItem('userType'))
          this.ngZone.run(() => {
            if(resp=="MANAGER")this.router.navigate(['']);
            else this.router.navigate(['admin'])
          });
        })
      })
    })
  }
  setUserData(email:string,userType:string){
    this.afAuth.currentUser.then(u=>{
      u?.getIdToken().then(token=>{
        this.http.post<any>(this.url+"/api/new-user",{token:token,email:email,userType:userType}).toPromise().then(resp=>{
          localStorage.setItem('userType',userType);
          console.log(localStorage.getItem('userType'));
          this.ngZone.run(() => {
            if(userType=="MANAGER")this.router.navigate(['']);
            else this.router.navigate(['admin'])
          });
        })
      })
    })
  }
 async addnewproduct(image:any,name:string,description:string,price:any,quantity:any){
   console.log(image)
    var u=await this.afAuth.currentUser
    var token= await u?.getIdToken()
    var list=await this.http.post<any>(this.url+`/api/products/list/${token}`,{name:{
      image:image,
      title:name,
      description:description,
      price:Number(price),
      quantity:Number(quantity)
    }}).toPromise()
    console.log(list)
  }
  async getAllProducts(){
    // this.afAuth.currentUser.then(u=>{
    //   u?.getIdToken().then(token=>{
    //     return this.http.get<any>(this.url+`/api/products/list/${token}`).toPromise()
    //   })
    // })
    var u=await this.afAuth.currentUser
    var token= await u?.getIdToken()
    var list=await this.http.get<any>(this.url+`/api/products/list/${token}`).toPromise()
    return list
  }
  async getAllRiders(){
    // this.afAuth.currentUser.then(u=>{
    //   u?.getIdToken().then(token=>{
    //     return this.http.get<any>(this.url+`/api/products/list/${token}`).toPromise()
    //   })
    // })
    var u=await this.afAuth.currentUser
    var token= await u?.getIdToken()
    var list=await this.http.get<any>(this.url+`/api/riders/list/${token}`).toPromise()
    return list
  }
  async getRiderHistory(rider:string){
    // this.afAuth.currentUser.then(u=>{
    //   u?.getIdToken().then(token=>{
    //     return this.http.get<any>(this.url+`/api/products/list/${token}`).toPromise()
    //   })
    // })
    console.log(rider)
    var u=await this.afAuth.currentUser
    var token= await u?.getIdToken()
    var list=await this.http.post<any>(this.url+`/api/riders/history/${token}`,{rid:rider}).toPromise()
    return list
  }
  async getAllOrders(){
    // this.afAuth.currentUser.then(u=>{
    //   u?.getIdToken().then(token=>{
    //     return this.http.get<any>(this.url+`/api/products/list/${token}`).toPromise()
    //   })
    // })
    var u=await this.afAuth.currentUser
    var token= await u?.getIdToken()
    var list=await this.http.get<any>(this.url+`/api/orders/list/${token}`).toPromise()
    return list
  }
  async editProduct(name:any,field:any,value:any){
    // this.afAuth.currentUser.then(u=>{
    //   u?.getIdToken().then(token=>{
    //     return this.http.get<any>(this.url+`/api/products/list/${token}`).toPromise()
    //   })
    // })
    var u=await this.afAuth.currentUser
    var token= await u?.getIdToken()
    var list=await this.http.put<any>(this.url+`/api/products/${name}/${token}`,{fieldname:field,fieldvalue:value}).toPromise()
    return list
  }
  // Sign in with email/password
  SignIn(email:any, password:any) {
    console.log("sign in start")
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {

        this.getUserType(email)

      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email:any, password:any,userType:any) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.setUserData(email,userType)
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.afAuth.currentUser.then(u=>{
     if(u)u.sendEmailVerification()
     .then(() => {
       this.router.navigate(['verify-email-address']);
     })
    })
  }
  idtoken(){
    this.afAuth.currentUser.then(u=>{
      if(u){
        u.getIdToken().then((re)=>{
          console.log(re)
          return re;
        })
      }
    })
  }
  // Reset Forggot password
  ForgotPassword(passwordResetEmail:any) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')||"");
    return (user !== null && user.emailVerified !== false) ? true : false;
  }

  // Sign out
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('userType');
      this.router.navigate(['sign-in']);
    })
  }
}