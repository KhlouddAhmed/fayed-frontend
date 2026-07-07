import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { ApiResponseWithData } from '../../../../../core/models/api-response.model';

// الهيكل الفعلي للداتا بناءً على الـ JSON من السيرفر
export interface AdminUser {
  userId: number; // المعرف الرقمي اللي هنبعته في الـ POST
  userIdentifier: string; // المعرف النصي (مثال: USR-201)
  userName: string;
  factoryName: string;
  email: string;
  isSuspended: boolean;
  statusText: string;
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
  private http = inject(HttpClient);

  activeTab = signal<'all' | 'suspended'>('all');
  searchQuery = signal<string>('');
  
  // الإشارات الأساسية
  users = signal<AdminUser[]>([]);
  isLoading = signal<boolean>(true);
  isTogglingId = signal<number | null>(null); // عشان نشغل Spinner على الزرار اللي بيتداس بس

  // إحصائيات التابات ديناميكياً
  allUsersCount = computed(() => this.users().length);
  suspendedUsersCount = computed(() => this.users().filter(u => u.isSuspended).length);

  ngOnInit(): void {
    this.fetchUsers();
  }

  // 1. جلب كل المستخدمين
  fetchUsers(): void {
    this.isLoading.set(true);
    this.http.get<ApiResponseWithData<AdminUser[]>>(`${environment.apiUrl}/Admin/users`)
      .subscribe({
        next: (res) => {
          if (res.IsSuccess && res.Data) {
            this.users.set(res.Data);
          }
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('خطأ في جلب المستخدمين:', err);
          this.isLoading.set(false);
        }
      });
  }

  // 2. فلترة المستخدمين بناءً على التابة والبحث
  filteredUsers = computed(() => {
    let result = this.users();

    if (this.activeTab() === 'suspended') {
      result = result.filter(user => user.isSuspended);
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query && this.activeTab() === 'all') { 
      result = result.filter(user => 
        (user.userName && user.userName.toLowerCase().includes(query)) ||
        (user.factoryName && user.factoryName.toLowerCase().includes(query)) ||
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.userIdentifier && user.userIdentifier.toLowerCase().includes(query))
      );
    }

    return result;
  });

  setTab(tab: 'all' | 'suspended') {
    this.activeTab.set(tab);
    this.searchQuery.set('');
  }

  updateSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  // 3. تغيير حالة المستخدم (حظر / فك حظر)
  toggleUserStatus(userId: number, currentSuspensionStatus: boolean) {
    this.isTogglingId.set(userId); // تشغيل حالة التحميل للزرار

    this.http.post(`${environment.apiUrl}/Admin/toggle-suspension/${userId}`, {})
      .subscribe({
        next: () => {
          // تحديث الجدول محلياً بدون ما نعمل ريفريش كامل عشان الأداء يكون سريع
          this.users.update(currentUsers => 
            currentUsers.map(user => 
              user.userId === userId 
                ? { ...user, isSuspended: !currentSuspensionStatus } 
                : user
            )
          );
          this.isTogglingId.set(null); // إيقاف التحميل
        },
        error: (err) => {
          console.error('خطأ في تغيير حالة المستخدم:', err);
          this.isTogglingId.set(null);
        }
      });
  }
}