import { Component, OnInit, OnDestroy,ChangeDetectorRef  } from '@angular/core';
import { DataServiceService } from './services/data-service.service';
import { autorun, IReactionDisposer } from 'mobx';
import { SelectItem } from 'primeng/api';
import { User } from './interfaces/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'angular';
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

  private disposer: IReactionDisposer | null = null;

  constructor(private dataService: DataServiceService,
    private cdr: ChangeDetectorRef 

  ) {}
  ngOnInit() {
    this.disposer = autorun(() => {
      if (this.dataService.filteredUsers.length) {
        this.users = this.dataService.filteredUsers; 
      } else {
        this.users = this.dataService.users;
      }
    });
  
    this.dataService.fetchUsers(); 
  }
  

  ngOnDestroy() {
    if (this.disposer){
      this.disposer();
    }
  }

  onGlobalFilterChange(term: string): void {
    this.dataService.debounceFetchFilteredUsers(term, this.getStartYear(), this.getEndYear(), this.selectedSex);
  }

  filterBySex(sex: string | null): void {
    this.selectedSex = sex;
    this.dataService.debounceFetchFilteredUsers('', this.getStartYear(), this.getEndYear(), sex);
  }

  clearYears(): void {
    this.rangeDates = undefined;
    this.dataService.debounceFetchFilteredUsers('', undefined, undefined, this.selectedSex);
  }

  filterUsersByBirthyear(): void {
    if (this.rangeDates) {
      const startYear = this.rangeDates[0]?.getFullYear();
      const endYear = this.rangeDates[1]?.getFullYear();
      this.dataService.debounceFetchFilteredUsers('', startYear, endYear, this.selectedSex);
    } else {
      this.dataService.debounceFetchFilteredUsers('', undefined, undefined, this.selectedSex);
    }
  }

  private getStartYear(): number | undefined {
    return this.rangeDates?.[0]?.getFullYear();
  }

  private getEndYear(): number | undefined {
    return this.rangeDates?.[1]?.getFullYear();
  }
}
