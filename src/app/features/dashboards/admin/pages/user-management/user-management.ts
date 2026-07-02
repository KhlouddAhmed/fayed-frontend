import { Component, signal, computed } from '@angular/core';

interface User {
  id: string;
  adminName: string;
  company: string;
  email: string;
  status: 'active' | 'suspended';
  registrationDate?: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css']
})
export class UsersComponent {
  activeTab = signal<'all' | 'suspended'>('suspended'); // خلينها تفتح على الموقوفة مؤقتاً عشان تشوفها
  searchQuery = signal<string>('');

  // الداتا مطابقة للصورة الجديدة
  users = signal<User[]>([
    { id: 'USR-201', adminName: 'محمد النجار', company: 'السويدي للكابلات', email: 'a.sewedy@sewedy.com', status: 'active', registrationDate: '2026-01-15' },
    { id: 'USR-202', adminName: 'أحمد محمود', company: 'العالمية للحديد', email: 'ahmed@global-iron.com', status: 'active', registrationDate: '2026-02-20' },
    { id: 'USR-204', adminName: 'ياسر جلال', company: 'الوطنية للمحولات', email: 'info@watania.com', status: 'suspended', registrationDate: '2026-04-12' },
    { id: 'USR-204', adminName: 'ياسر جلال', company: 'الوطنية للمحولات', email: 'info@watania.com', status: 'suspended', registrationDate: '2026-04-12' },
    { id: 'USR-204', adminName: 'ياسر جلال', company: 'الوطنية للمحولات', email: 'info@watania.com', status: 'suspended', registrationDate: '2026-04-12' }
  ]);

  filteredUsers = computed(() => {
    let result = this.users();

    if (this.activeTab() === 'suspended') {
      result = result.filter(user => user.status === 'suspended');
    }

    const query = this.searchQuery().trim().toLowerCase();
    if (query && this.activeTab() === 'all') { 
      result = result.filter(user => 
        user.adminName.toLowerCase().includes(query) ||
        user.company.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
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

  toggleUserStatus(userId: string) {
    this.users.update(users => 
      users.map(user => user.id === userId ? { ...user, status: user.status === 'active' ? 'suspended' : 'active' } : user)
    );
  }
}