import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

import { User } from '../../services/data-service.service';
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input() users: User[] = []; // This property will receive data from the parent component
  @Input() toggledColumn: string | null = null;
  @Input() columnVisibility: { [key: string]: boolean } = {
    id: true,
    name: true,
    age: true,
    sex: true,
    address: true
  };
  getUserImageUrl(userName: string): string {
    return `https://robohash.org/${encodeURIComponent(userName)}`;
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (changes['toggledColumn'] && changes['toggledColumn'].currentValue) {
  //     this.toggleColumnVisibility(changes['toggledColumn'].currentValue);
  //   }
  // }
  // toggleColumnVisibility(colName: string): void {
  //   if (this.columnVisibility.hasOwnProperty(colName)) {
  //     this.columnVisibility[colName] = !this.columnVisibility[colName];
  //   }
  // }


  // handleColumnToggle(colName: string) {
  //   if (colName === 'id') {
  //     this.idColToggle = !this.idColToggle;
  //   } else if (colName === 'name') {
  //     this.nameColToggle = !this.nameColToggle;
  //   } else if (colName === 'age') {
  //     this.ageColToggle = !this.ageColToggle;
  //   } else if (colName === 'sex') {
  //     this.sexColToggle = !this.sexColToggle;
  //   } else if (colName === 'address') {
  //     this.adressColToggle = !this.adressColToggle;
  //   }
  // }
}

