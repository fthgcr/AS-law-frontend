import { Input, Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { UserLoginRequestWithIdentity } from '../../models/UserLoginRequestWithIdentity';
import { UserService } from '../../services/user.service';
import { User } from '../../models/User';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserLoginRequestWithToken } from '../../models/UserLoginRequestWithToken';
import { SnackbarComponent } from '../snackbar/snackbar.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit{
  constructor(private userService: UserService, private router: Router, private cookieService: CookieService, private _snackBar: MatSnackBar) {}

  identify: String;
  password: String;

  loginInfo: UserLoginRequestWithIdentity = new UserLoginRequestWithIdentity();
  loginData: User = new User();

  tokenRequest : UserLoginRequestWithToken = new UserLoginRequestWithToken();
  user: User = new User();

  ngOnInit(): void {
    this.getCookie();
  }

  getCookie(){
    const cookieToken = this.cookieService.get('token');
    if(cookieToken && cookieToken !== ""){
      this.tokenRequest.token = cookieToken;
      this.getUserData();
    } else {
      this.router.navigate(['/']);
    }
  }

  getUserData(){
    this.userService.loginWithToken(this.tokenRequest).subscribe(result => {
      this.user = result;
      if (this.user.identify) {
        this.cookieService.set('token', this.user.token ?? "", 210);
        if(this.user.identify === "admin"){
          this.router.navigate(['/panel']);
        } else {
          this.router.navigate(['/client']);
        }
      } else {
        this.callSnackBar("Beklenmedik bir hata oluştu. Lütfen tekrar deneyiniz.", 3000);
      }
    }, (error) => {
      this.router.navigate(['/']);
    });
  }
  
  login() {
    this.userService.loginWithIdentify(this.loginInfo).subscribe((login) => {
      this.loginData = login;
      this.cookieService.set('token', this.loginData.token ?? "", 30);
      if (this.loginData.identify) {
        if(this.loginData.identify === "admin"){
          this.router.navigate(['/panel']);
        } else {
          this.router.navigate(['/client']);
        }
      } else {
        this.callSnackBar("Şifreniz Yanlış! Lütfen Tekrar Deneyiniz.", 3000);
        this.user = new User();
      }
    });
  }

  callSnackBar(message: String, duration: number){
    const data = { message: message};
        this._snackBar.openFromComponent(SnackbarComponent, {
          duration: duration,
          data: data
    });
  }
}
