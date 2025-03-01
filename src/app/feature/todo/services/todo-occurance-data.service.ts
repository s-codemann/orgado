import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { TTodoOccuranceFilters } from '../model/todoOccurace';
import { TTodoOccurance } from '../model/todo.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoOccuranceDataService {
  constructor() {}
  private httpClient = inject(HttpClient);
  getOccurancesInTimeframe(filters: TTodoOccuranceFilters) {
    return this.httpClient.post<TTodoOccurance[]>(
      environment.backendUrl + '/todo-occurances',
      filters
    );
  }
}
