import { Injectable, NgZone } from '@angular/core';
import { User } from "../services/user";
import  auth  from 'firebase/app';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any; // Save logged in user data

  constructor(
    public afs: AngularFirestore,   // Inject Firestore service
    public afAuth: AngularFireAuth, // Inject Firebase auth service
    public router: Router,  
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {    
    this.afAuth.authState.subscribe((user:any) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')||'');
      } else {
        localStorage.setItem('user', '');
        JSON.parse(localStorage.getItem('user')||'');
      }
    })
  }

  // Sign in with email/password
  SignIn(email:string, password:string) {
    console.log("sign-in function")
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        console.log(result)
        this.ngZone.run(() => {
          this.router.navigate(['']);
        });
       // this.SetUserData(result.user);
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // Sign up with email/password
  SignUp(email:string, password:string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
        this.SendVerificationMail();
       // this.SetUserData(result.user);
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

  // Reset Forggot password
  ForgotPassword(passwordResetEmail:string) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
    .then(() => {
      window.alert('Password reset email sent, check your inbox.');
    }).catch((error) => {
      window.alert(error)
    })
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = localStorage.getItem('user');
    return (user !== null && user!=='' ) ? true : false;
  }

  // Auth logic to run auth providers
  AuthLogin(provider:any) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {
       this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        })
      //this.SetUserData(result.user);
    }).catch((error) => {
      window.alert(error)
    })
  }

  // SetUserData(user:any) {
  //   const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
  //   const userData: User = {
  //     userType:'CLIENT'
  //   }
  //   console.log("prev",userData)
  //   const dat=userRef.set(userData, {
  //     merge: true
  //   })
  //   console.log("data",dat)
  //   return dat
  // }

  // Sign out 
  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['sign-in']);
    })
  }

}