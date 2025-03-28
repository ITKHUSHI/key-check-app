import { Component } from '@angular/core';
import { UserService } from '../user/service';
import { CanActivate, Router} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Injectable } from '@angular/core';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
@Injectable({
  providedIn: 'root'
})
export class LoginComponent {
  credentials = { userId: '', password: '' };
  isAuthenticate=false;
  constructor(private userService: UserService, private router: Router ,) {}

  login() {
    if (!this.credentials.userId || !this.credentials.password) {
      alert('Please enter both User ID and Password');
      return;
    }

    this.userService.login(this.credentials).subscribe({
      next: (user) => {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.router.navigate(['/logged-in']);
          this.isAuthenticate=true;
        } else {
          alert('Invalid credentials');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        alert('Invalid credentials or server error');
      },
    });
   
  }
  logout(){
    localStorage.removeItem('user');
    this.isAuthenticate=false;
    this.router.navigate(['/login']);
      
  }
}
