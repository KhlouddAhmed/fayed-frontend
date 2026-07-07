import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService, ApiAdminUser } from './users.service';

// الواجهة اللي الـ HTML بيقرا منها عشان منغيرش تصميمه
export interface UserUI {
  dbId: number;
  id: string;
  adminName: string;
  company: string;
  email: string;
  status: 'active' | 'suspended';
  registrationDate: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UsersComponent implements OnInit {
  private usersService = inject(UsersService);

  activeTab = signal<'all' | 'suspended'>('all');
  searchQuery = signal<string>('');
  
  // الإشارات الأساسية
  rawUsers = signal<ApiAdminUser[]>([]);
  isLoading = signal<boolean>(true);
  isTogglingId = signal<number | null>(null);

  // 1. ترجمة الداتا من الـ API لشكل الواجهة (Mapping)
  mappedUsers = computed<UserUI[]>(() => {
    return this.rawUsers().map(u => ({
      dbId: u.userId,
      id: u.userIdentifier,
      adminName: u.userName,
      company: u.factoryName,
      email: u.email,
      status: u.isSuspended ? 'suspended' : 'active',
      registrationDate: u.registrationDate
    }));
  });

  // إحصائيات التابات ديناميكياً (هتتربط بالبادجات في الـ HTML)
  allCount = computed(() => this.mappedUsers().length);
  suspendedCount = computed(() => this.mappedUsers().filter(u => u.status === 'suspended').length);

  // 2. فلترة المستخدمين بناءً على التابة والبحث
  filteredUsers = computed(() => {
    let result = this.mappedUsers();

    if (this.activeTab() === 'suspended') {
      result = result.filter(user => user.status === 'suspended');
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query && this.activeTab() === 'all') { 
      result = result.filter(user => 
        (user.adminName && user.adminName.toLowerCase().includes(query)) ||
        (user.company && user.company.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.id && user.id.toLowerCase().includes(query))
      );
    }

    return result;
  });

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.isLoading.set(true);
    this.usersService.getUsers().subscribe({
      next: (res: any) => {
        const isSuccess = res.IsSuccess ?? res.isSuccess;
        const data = res.Data ?? res.data;
        if (isSuccess && data) {
          this.rawUsers.set(data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('خطأ في جلب المستخدمين:', err);
        this.isLoading.set(false);
      }
    });
  }

  setTab(tab: 'all' | 'suspended') {
    this.activeTab.set(tab);
    this.searchQuery.set('');
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // 3. تغيير حالة المستخدم (حظر / فك حظر)
  toggleUserStatus(dbId: number) {
    this.isTogglingId.set(dbId);

    this.usersService.toggleSuspension(dbId).subscribe({
      next: () => {
        // تحديث الداتا محلياً بدون ريفريش، وهتنعكس فوراً في الجدول والبادجات
        this.rawUsers.update(users => 
          users.map(u => u.userId === dbId ? { ...u, isSuspended: !u.isSuspended } : u)
        );
        this.isTogglingId.set(null);
      },
      error: (err) => {
        console.error('خطأ في تغيير حالة المستخدم:', err);
        this.isTogglingId.set(null);
      }
    });
  }
}