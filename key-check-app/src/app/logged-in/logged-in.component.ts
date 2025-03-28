import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logged-in',
  templateUrl: './logged-in.component.html',
  standalone: true,
  imports: [FormsModule, CommonModule],
  styleUrl: './logged-in.component.css'
})
export class LoggedInComponent implements OnInit {
  user: any = {};
  records: any[] = [];
  users: any[] = [];
  newUser = { userId: '', password: '', role: 'General User' ,  email:''};
  editUserObj: any = {};
  showAddUser = false;
  showEditUser = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    if (typeof window !== 'undefined') {
      this.user = JSON.parse(localStorage.getItem('user') || '{}');
    } else {
      this.user = {};
    }
    this.loadData();
  }

  /** Load records & users based on role */
  private loadData() {
    this.fetchRecords();
    if (this.user.role === 'Admin') {
      this.fetchUsers();
    }
  }

  /** Fetch all users (Admin only) */
  private fetchUsers() {
    this.userService.getUsers().subscribe((users) => (this.users = users));
  }

 
  /** Fetch logged-in user's records */
private fetchRecords() {
  this.records = []; // Clear old data before fetching
  this.userService.getRecords(this.user.userId, this.user.role, 300).subscribe({
    next: (records) => {
      this.records = records;
      console.log("Records fetched:", this.records);
    },
    error: (err) => {
      console.error("Error fetching records:", err);
    }
  });
}


  /** Delete user (Admins can delete any, General Users can delete only themselves) */
  deleteUser(id: number) {
    if (this.user.role === 'General User' && this.user.id !== id) {
      alert("You can only delete your own account.");
      return;
    }

    this.userService.deleteUser(id).subscribe(() => {
      this.users = this.users.filter(user => user.id !== id);
      this.records = this.records.filter(record => record.id !== id);
      if (this.user.id === id) {
        localStorage.removeItem('user');
        location.reload();
      }
    });
  }

  /** Add a new user (Admins only) */
  addUser() {
    if (this.user.role !== 'Admin') {
      alert("You don't have permission to add users.");
      return;
    }

    this.userService.createUser(this.newUser).subscribe((createdUser) => {
      this.users.push(createdUser);
      this.resetAddUserForm();
    });
  }

  /** Prepare user for editing (Users can edit themselves, Admins can edit anyone) */
  editUser(user: any) {
    if (this.user.role === 'General User' && this.user.id !== user.id) {
      alert("You can only edit your own details.");
      return;
    }

    this.editUserObj = { ...user };
    this.showEditUser = true;
  }

  /** Update user details */
  updateUser() {
    if (this.user.role === 'General User' && this.user.id !== this.editUserObj.id) {
      alert("You can only update your own details.");
      return;
    }

    this.userService.updateUser(this.editUserObj.id, this.editUserObj).subscribe((updatedUser) => {
      if (this.user.role === 'Admin') {
        this.users = this.users.map(user => user.id === updatedUser.id ? updatedUser : user);
      }
      this.records = this.records.map(record => record.id === updatedUser.id ? updatedUser : record);
      this.showEditUser = false;
    });
  }

  /** Reset add-user form */
  private resetAddUserForm() {
    this.newUser = { userId: '', password: '', role: 'General User', email:'' };
    this.showAddUser = false;
  }
  
}


