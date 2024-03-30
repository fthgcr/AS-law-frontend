import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-panel-edit',
  templateUrl: './panel-edit.component.html',
  styleUrl: './panel-edit.component.scss'
})
export class PanelEditComponent implements OnInit{

  constructor(private route: ActivatedRoute, private userService : UserService, private router: Router,private _snackBar: MatSnackBar,){}

  user : User = new User();
  clientMessage : String = "";

  textColor: string = 'white';
  textVisible: boolean = true;
  text: string = 'AS Hukuk & Danışmanlık - Müvekkil Bilgileri Ekle / Güncelle';

  clientInfoVisible : boolean = false;

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const clientId = params.get('id');
      const id : number = clientId ? +clientId : 0;
      if(id !== 0){
        this.findMuvekkil(id);
      }
    });
  }

  findMuvekkil(id: number){
    this.userService.getUser(id).subscribe((user) => {
      this.user = user;
      this.clientMessage = this.user.definition ?? "";
    });
  }

  onInput(event: any) {
    const inputText = event.target.value;
    if(inputText.length === 11 && (!this.user.password || this.user.password === "") && (this.user.firstName && this.user.firstName !== "")){
      this.user.password = this.user.firstName + inputText.substring(0, 5);
      this.callSnackBar("Şifre otomatik oluşturuldu. İsim ve T.C. Kimlik Numarasının 5 Harfi : " + this.user.password, 5000);
    }
  }

  save(){
    if(!this.validate()) {
      return;
    }

    if(this.user.uid && this.user.uid > 0){
      this.userService.updateUser(this.user).subscribe(user => {
        this.user = user;
        this.callSnackBar("Başarılı Bir Şekilde Kaydedildi.", 2500);
        this.clientSendInfo();
      });
    } else {
      this.userService.createUser(this.user).subscribe(user => {
        this.user = user;
        this.callSnackBar("Başarılı Bir Şekilde Kaydedildi.", 2500);
        this.clientSendInfo();
      });
    }

  }

  clientSendInfo(){
    if(this.user.phone && this.user.phone !== "" && this.user.phone.length === 11 && this.user.definition !== this.clientMessage){
      this.clientInfoVisible = true;
    }
  }

  clientSendInfoClick(){
    const phoneNumber = this.user.phone; // Replace with your phone number
    const message = 'Bilgileriniz Güncellendi. ' + "TODO" + " tıklayarak detaylarını öğrenebilirsiniz."; // Replace with your message
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
  }

  validate() : boolean{
    if(!this.user.firstName || this.user.firstName === ""){
      this.callSnackBar( "Lütfen Müvekkil İsmini Giriniz.", 3000);
      return false;
    } else if(!this.user.surname || this.user.surname === ""){
      this.callSnackBar( "Lütfen Müvekkil Soyismini Giriniz.", 3000);
      return false;
    } else if(!this.user.identify || this.user.identify === ""){
      this.callSnackBar( "Lütfen Müvekkil T.C. Kimlik No Giriniz.", 3000);
      return false;
    } else if(!this.user.surname || this.user.surname === ""){
      this.callSnackBar( "Lütfen Müvekkilin Şifresini Giriniz.", 3000);
      return false;
    } else if(this.user.identify && this.user.identify !== "" && this.user.identify.length !== 11){
      this.callSnackBar( "Lütfen Geçerli T.C. Kimlik No Giriniz.", 3000);
      return false;
    } else if(this.user.identify && this.user.identify !== "" && this.user.identify.length !== 11){
      this.callSnackBar( "Lütfen Geçerli T.C. Kimlik No Giriniz.", 3000);
      return false;
    } else if(this.user.phone && this.user.phone !== "" && this.user.phone.length !== 11){
      this.callSnackBar( "Lütfen Geçerli Telefon Numarası Giriniz.", 3000);
      return false;
    } else {
      return true;
    }
  }

  goList(){
    this.router.navigate(['/panel']);
  }

  callSnackBar(message: String, duration: number){
    const data = { message: message};
        this._snackBar.openFromComponent(SnackbarComponent, {
          duration: duration,
          data: data
    });
  }


}
