import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { makeAutoObservable } from 'mobx';
import { User } from '../interfaces/user';


@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiUrl = 'http://localhost:3000/api/getData';
  users: User[] = [];
  filteredUsers: User[] = [];


  private fetchTimeout: any = null;

  constructor(private http: HttpClient) {
    makeAutoObservable(this);
  }

  fetchUsers(): void {
    this.http.get<User[]>(this.apiUrl).toPromise()
    .then(users => this.setUsers(users)) 
    .catch(error => console.error('Failed to fetch users', error));
  
  }

  setUsers(users: User[] | undefined): void {
    if (users) {
      this.users = users;
    } else {
      console.error('No users found');
      this.users = []; 
    }
  }
  debounceFetchFilteredUsers(term: string, startYear?: number, endYear?: number, sex?: string | null, minAge?: number, maxAge?: number): void {
    if (this.fetchTimeout) {
      clearTimeout(this.fetchTimeout);
    }
    this.fetchTimeout = setTimeout(() => {
      this.fetchFilteredUsers(term, startYear, endYear, sex, minAge, maxAge);
    }, 300); 
  }


  fetchFilteredUsers(
    term: string,
    startYear?: number,
    endYear?: number,
    sex?: string | null,
    minAge?: number,
    maxAge?: number
  ): void {
    let params = new HttpParams().set('search', term);

    if (startYear && endYear) {
      params = params.set('startYear', startYear.toString())
                     .set('endYear', endYear.toString());
    }
    if (sex) {
      params = params.set('sex', sex);
    }
    if (minAge && maxAge) {
      params = params.set('minAge', minAge.toString())
                     .set('maxAge', maxAge.toString());
    }

    this.http.get<User[]>(this.apiUrl, { params }).toPromise()
    .then(users => {
      if (users) {
        this.setFilteredUsers(users);
      } else {
        console.error('No filtered users data received');
        this.setFilteredUsers([]); 
      }
    })
    .catch(error => console.error('Failed to fetch filtered users', error));
    }

  setFilteredUsers(users: User[] | undefined): void {
    this.filteredUsers = users || []; 
  }}
