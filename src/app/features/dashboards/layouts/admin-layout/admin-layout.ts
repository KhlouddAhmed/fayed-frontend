import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.css']
})
export class AdminLayoutComponent implements OnInit {
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
}