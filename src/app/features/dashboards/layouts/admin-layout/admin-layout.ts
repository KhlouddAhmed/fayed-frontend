import { Component, signal, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent implements OnInit {

  private router = inject(Router);

  isSidebarOpen = signal(false);

  currentUser = signal({
    name: 'أحمد ممدوح',
    role: 'مسؤول',
    avatarUrl: 'assets/icons/logo-icon.png' 
  });

  ngOnInit(): void {}


  toggleSidebar() {
    this.isSidebarOpen.update(val => !val);
  }

  
  logout() {
  
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    sessionStorage.clear();


    this.router.navigate(['/home']);
  }
}