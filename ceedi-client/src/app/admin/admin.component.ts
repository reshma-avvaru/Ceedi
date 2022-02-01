import { Component, OnInit } from '@angular/core';
import { NgbModal ,ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  hideWelcome:boolean=false;
  hideTable:boolean=true;
public riders:any=[]
public riderHistory:any;
  constructor( public authService: AuthService,
    private modalService: NgbModal,) {
      
     }

  ngOnInit(): void {
    
  }
  ngAfterViewInit(){
    console.log("current user",this.authService.getcurrentuser())
  }
  closeResult: string = '';

  open(e:any,content:any) {
    this.getRiderHistory(e)
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
  getAllRiders(){
    this.hideWelcome=true;
    this.hideTable=false
    this.riders=[]
    this.authService.getAllRiders().then((resp:any)=>{
      console.log(resp);
      for(var i in resp)
      { 
        this.riders.push({rider:i,prop:resp[i]});
        console.log(resp[i])
      }
    })
    }
    nodelivery=true;
    getRiderHistory(event:any){
      console.log(event)
      this.riderHistory=[]
      this.authService.getRiderHistory(event.target.id).then(resp=>{
        for(var i in resp){
          this.riderHistory.push(resp[i])
        }
        if(this.riderHistory==[])this.nodelivery=true;
        else this.nodelivery=false;
        //this.riderHistory=resp;
      })
    }
}
