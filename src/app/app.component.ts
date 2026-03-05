import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from './@service2/auth.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router'
import { FillComponent } from './@page/fill/fill.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FormsModule,CommonModule,RouterLink,FillComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  showModal = false;
  loginUser = '';
  loginPwd = '';

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.authService.checkStatus();
  }

  onLogin() {
    if (this.loginUser) {
      this.authService.login(this.loginUser);
      this.showModal = false;
      this.loginUser = '';
      this.loginPwd = '';
    }
  }

  logout() {
    this.authService.logout();
  }
}
