// data-service.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

export interface User {
  id: number;
  name: string;
  age: number;
  sex: string;
  address: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private apiUrl = 'http://localhost:3000/api/getData'; // URL to web api

  constructor(private http: HttpClient) { }

  // Function to return the HTTP request observable for the search entries
  getFilteredUsers(
    term: string,
    startYear?: number,
    endYear?: number,
    sex?: string | null,
    minAge?: number,
    maxAge?: number

  ): Observable<User[]> {
    let params = new HttpParams()
      .set('search', term);

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
    return this.http.get<User[]>(this.apiUrl, { params });
  }
  
  // Fetch the unfiltered list of users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
}
