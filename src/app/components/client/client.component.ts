import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { UserService } from '../../services/user.service';
import { UserLoginRequestWithToken } from '../../models/UserLoginRequestWithToken';
import { error } from 'console';
import { User } from '../../models/User';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrl: './client.component.scss'
})
export class ClientComponent implements OnInit{

  constructor(private cookieService: CookieService, private router: Router, private userService : UserService){}

  tokenRequest : UserLoginRequestWithToken = new UserLoginRequestWithToken();
  user: User = new User();

  ngOnInit(): void {
    this.getCookieValue();
  }

  getCookieValue(){
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
    }, (error) => {
      this.router.navigate(['/']);
    });
  }

  logout(){
    this.cookieService.delete('token');
    this.router.navigate(['/']);
  }

  openWhatsapp(){
    const phoneNumber = "05518877919"; // Replace with your phone number
    const message = 'En kısa zamanda sizlere dönüş yapacağız.'; // Replace with your message
    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappLink, '_blank');
  }

  goSite(){
    window.open('https://www.asdanismanlik.net/', "_blank");
  }

}
