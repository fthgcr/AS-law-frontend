import { Component, OnInit } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { CookieService } from 'ngx-cookie-service';
import { UserLoginRequestWithToken } from '../../models/UserLoginRequestWithToken';
import { User } from '../../models/User';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}


@Component({
  selector: 'app-panel-list',
  templateUrl: './panel-list.component.html',
  styleUrl: './panel-list.component.scss',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatIconModule, CommonModule, MatButtonModule],
})
export class PanelListComponent implements OnInit{

  constructor(private router: Router, private userService : UserService, private cookieService: CookieService){}

  displayedColumns: string[] = ['firstName', 'surname', 'identify', 'phone', 'actions'];
  dataSource = new MatTableDataSource();
  clientList: any[] = [];
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
      if(this.user.identify === "admin"){
        this.getList();
      } else {
        this.router.navigate(['/']);
      }
    }, (error) => {
      this.router.navigate(['/']);
    });
  }

  getList(){
    this.userService.getAll().subscribe((result) => {
      this.clientList = result;
      this.dataSource = new MatTableDataSource(this.clientList);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  openEditPage(id: number){
    console.log(id);
    this.router.navigate(['/panel', id]);
  }

  logout(){
    this.cookieService.delete('token');
    this.router.navigate(['/']);
  }

}
