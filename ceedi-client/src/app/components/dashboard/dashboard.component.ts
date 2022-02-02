import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { NgModule } from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { finalize } from 'rxjs/operators'
import { AngularFireStorage } from '@angular/fire/storage';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public user:any;
  public token:any;
  public products:any=[];
  public riders:any=[];
  public orders:any=[];
  hideProducts:boolean=true;
  hideOrders:boolean=true;
  hideRiders:boolean=true;
  hideForm:boolean=false;
  public toedit:any={};
 // editForm:FormGroup;
  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    public afAuth: AngularFireAuth,
    private modalService: NgbModal,
    private storage:AngularFireStorage
  ) { 
  }
  // getImage(event:any){
  //   if(event.target.files && event.target.)
  // }
  imgSrc:any=""
  selectedImage:any=null
  test(event:any){
    if(event.target.files && event.target.files[0])
    {
      console.log(event.target.files[0])
    const reader=new FileReader();
    reader.onload=(e:any)=>{ this.imgSrc=e.target.result}
    reader.readAsDataURL(event.target.files[0])
    this.selectedImage=event.target.files[0]
  }
  }
  addNewProduct(title:any,desc:any,price:any,quantity:any){
   var filePath=`productImages/${this.selectedImage.name}_${new Date().getTime()}`
   const fileRef=this.storage.ref(filePath)
   this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
    finalize(()=>{
      fileRef.getDownloadURL().subscribe(url=>{
        this.authService.addnewproduct(url,title,desc,price,quantity).then(()=>{
          alert("New product added")
        })
      })
    })
   ).subscribe();
  }
  closeResult: string = '';
    async onSubmit(title:any,desc:any,price:any,quant:any){
      if(this.toedit.title!=title.trim())console.log(await this.authService.editProduct(this.toedit.name,"title",title))
      if(this.toedit.description!=desc.trim())console.log(await this.authService.editProduct(this.toedit.name,"description",desc))
      if(this.toedit.price!=Number(price))console.log(await this.authService.editProduct(this.toedit.name,"price",Number(price)))
      if(this.toedit.quantity!=Number(quant))console.log(await this.authService.editProduct(this.toedit.name,"quantity",Number(quant)))
      this.modalService.dismissAll('done')
      
      this.getAllProducts()
      alert("Product edited")
      // console.log(this.editForm)
    }
  open(e:any,content:any) {
    this.setdata(e)
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  ngOnInit(): void {
    this.user=JSON.parse(localStorage.getItem('user')||'')
    console.log(this.user)
  }
  getAllProducts(){
    this.hideProducts=false;
        this.hideOrders=true;
        this.hideRiders=true;
        this.hideForm=true;
    this.products=[]
  this.authService.getAllProducts().then(resp=>{
    console.log(resp);
    for(var i in resp)
    {
      resp[i]["name"]=i;
      this.products.push(resp[i]);
      console.log(resp[i].title)
    }
  })
  }
  getAllOrders(){
    this.hideProducts=true;
        this.hideOrders=false;
        this.hideRiders=true;
        this.hideForm=true;
    this.orders=[]
    this.authService.getAllOrders().then(resp=>{
      console.log(resp);
      for(var i in resp)
      { 
        
        this.orders.push(resp[i]);
        console.log(resp[i])
      }
    })
    }
    getAllRiders(){
      this.hideProducts=true;
        this.hideOrders=true;
        this.hideRiders=false;
        this.hideForm=true;
      this.riders=[]
      this.authService.getAllRiders().then(resp=>{
        console.log(resp);
        for(var i in resp)
        {
          resp[i]["distance"]="None"
          resp[i]["time"]="None"
          if(resp[i].riderStatus)this.riders.push({rider:i,prop:resp[i]});
          console.log(resp[i])
        }
        this.setdistances()
      })
      
      }
      async setdistances(){
        console.log("function")
        for(var i in this.riders){
          if(this.riders[i].prop.riderPosition){
            console.log("found")
            let resp =await this.authService.distance(this.riders[i].prop.riderPosition.latitude,this.riders[i].prop.riderPosition.longitude)
            
              console.log("distance",resp)
              // console.log(resp["distances"])
              // console.log(resp["distances"][0][1])
              this.riders[i].prop.distance=resp["distances"][0][1]
              this.riders[i].prop.time=Math.ceil(resp["durations"][0][1]/60)
            
          }
        }
      }
      productForm(){
        this.hideProducts=true;
        this.hideOrders=true;
        this.hideRiders=true;
        this.hideForm=false;
      }
  async idtoken(){
    var auth=firebase.auth();
    console.log("auth",auth)
    const user=auth.currentUser;
    console.log("user",user)
    this.token=await user?.getIdToken();
    console.log(this.token)
  }

  setdata(e:any){
   for(var i in this.products){
        if(this.products[i].title==e.target.id){
           this.toedit=this.products[i];
           break;
        }
   }

  }

}
