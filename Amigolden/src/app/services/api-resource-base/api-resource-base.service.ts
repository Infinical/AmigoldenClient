import { Injectable } from '@angular/core';
import { IHasId } from 'src/app/models/interfaces/interfaces';
import { Observable } from 'rxjs';
import { Page } from '../../models/page';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiResourceBaseService<T extends IHasId> {

  apiUrl = environment.apiUrl;
  route: string;

  constructor(private http: HttpClient, routeName: string) {
      this.route = routeName;
  }

  // TODO: remove this and make this a method where its needed
  getIdByRoute(subRoute: string): Observable<number> {
      return this.http.get<number>(`${this.apiUrl}/${this.route}/${subRoute}`);
  }

  // TODO: remove this and make this a method where its needed
  getByRoute(subRoute: string): Observable<T> {
      return this.http.get<T>(`${this.apiUrl}/${this.route}/${subRoute}`);
  }

  get(id: number): Observable<T> {
      return this.http.get<T>(`${this.apiUrl}/${this.route}/${id}`);
  }

  getDynamicList(filter: string, pageSize?: number, pageNumber?: number): Observable<T[]> {
      const params = new HttpParams();
      if (filter) {
          params.set('$filter', filter);
      }
      if (pageNumber) {
          const skip = pageSize == null ? 0 : (pageNumber - 1) * pageSize;
          params.set('$orderby', 'Id desc');
          params.set('$skip', skip.toString());
      }
      if (pageSize) {
          params.append('$top', pageSize.toString());
      }

      return this.http.get(`${this.apiUrl}/${this.route}/OData`, { params })
              .map(res => {
                  const entities = res.json() as T[];
                  return entities.map(e => this.mapEntity(e));
              });
  }

  getList(pageSize?: number, pageNumber?: number): Observable<Page<T>> {
      const params = new HttpParams();
      if (pageSize) {
        params.set('pageSize', pageSize.toString());
      }
      if (pageNumber) {
        params.set('pageNumber', pageNumber.toString());
      }

      return this.http.get(`${this.apiUrl}/${this.route}`, { params }).map(res => {

          const pageSizeHeader: number = +res.headers.get('Page-Size');
          const pageNumberHeader = +res.headers.get('Page-Number');
          const totalNumberOfResults = +res.headers.get('Total-Number-Of-Result');
          const items = res.json() as T[];
          const mappedItems = items.map(e => this.mapEntity(e));

          const page: Page<T> = new Page<T>(pageSizeHeader, pageNumberHeader, totalNumberOfResults, mappedItems);
          return page;

      });
  }

  // virtual
  mapEntity(entity: T): T {
      return entity;
  }

  create(resource: T): Observable<T> {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');
      return this.http.post<T>(`${this.apiUrl}/${this.route}`, resource, { headers});
  }

  update(resource: T): Observable<T> {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      return this.http.post<T>(`${this.apiUrl}/${this.route}/${resource.id}`, resource, { headers });
  }

  delete(resource: T): Observable<boolean> {
      return this.deleteById(resource.id);
  }

  deleteById(id: number): Observable<boolean> {
      const headers = new HttpHeaders();

      return this.http.delete<boolean>(`${this.apiUrl}/${this.route}/${id}`, { headers });
  }
}
