// app.component.ts

import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';

import {  DataServiceService, User } from './services/data-service.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { combineLatest, Subject } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'angular';

  @Output() columnToggled = new EventEmitter<string>();
  users: User[] = [];
  filteredUsers: User[] = []; 

  rangeValues: number[] = [0, 150];
  columnVisibility: { [key: string]: boolean } = {
    id: true,
    name: true,
    age: true,
    sex: true,
    address: true,
  };
  sexOptions: SelectItem[] = [
    { label: 'All', value: null },
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' }
  ];
  selectedSex: string | null = null;
  
  
  
  rangeDates: Date[] | undefined;
  rangeDatesSubject = new Subject<Date[] | undefined>();
  toggledColumn: string | null = null;
  
  
  private sexFilter = new Subject<string | null>();
  private searchTerms = new Subject<string>();

  constructor(private dataService: DataServiceService) {}

  onGlobalFilterChange(term: string): void {
    this.searchTerms.next(term);
  }

  filterBySex(sex: string | null) {
    this.selectedSex = sex;
    this.sexFilter.next(sex);
  }

 
  clearYears(){
    this.rangeDates = undefined;
    this.rangeDatesSubject.next(this.rangeDates);
  }

  ngOnInit() {
    combineLatest([
      this.searchTerms.pipe(startWith('')),
      this.rangeDatesSubject.pipe(startWith(undefined)),
      this.sexFilter.pipe(startWith(null))
    ]).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(([term, rangeDates, selectedSex]) => {
        const startYear = rangeDates?.[0]?.getFullYear();
        const endYear = rangeDates?.[1]?.getFullYear();
        return this.dataService.getFilteredUsers(term, startYear, endYear, selectedSex);
      })
    ).subscribe(data => {
      this.users = data;
    });
  }
  onAgeFilter(){
     
  }

  filterUsersByBirthyear() {
    if (this.rangeDates) {
      this.rangeDatesSubject.next(this.rangeDates);
    } else {
      this.rangeDatesSubject.next(undefined);
    }
  }
  
  }
