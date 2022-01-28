import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public user:any;
  public token:any;
  public products:any=[];
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    public afAuth: AngularFireAuth,
  ) { 

  }

  ngOnInit(): void {
    this.user=JSON.parse(localStorage.getItem('user')||'')
    console.log(this.user)
  }
  // ngDoCheck(){
  //   this.getAllProducts()
  // }
  getAllProducts(){
  this.authService.getAllProducts().then(resp=>{
    console.log(resp);
    for(var i in resp)
    {
      this.products.push(resp[i]);
      console.log(resp[i].title)
    }
  })
  
  }
  async idtoken(){
    var auth=firebase.auth();
    console.log("auth",auth)
    const user=auth.currentUser;
    console.log("user",user)
    this.token=await user?.getIdToken();
  }
  setdata(e:any){
   
  }

}
