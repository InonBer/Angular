import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';

import { User } from '../../services/data-service.service';
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrl: './data-table.component.scss'
})
export class DataTableComponent {
  @Input() users: User[] = []; 
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


}

