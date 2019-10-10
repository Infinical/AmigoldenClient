import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DestinationTransactionOptions, TransactionOptions, CardInfo } from 'src/app/models/transactions-info';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StripePaymentsService  {
  apiUrl = environment.apiUrl;
  route: string;

  constructor(public http: HttpClient) {
      this.route = 'StripePayments';
  }

  getTransaction(meetingId: number): Observable<DestinationTransactionOptions> {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      return this.http.get<DestinationTransactionOptions>(
        `${this.apiUrl}/${this.route}/get-transaction-status-by-meeting/${meetingId}`, { headers });
  }

  authorizeTransaction(transactionOptions: TransactionOptions): Observable<TransactionOptions> {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      return this.http.post<TransactionOptions>(
        `${this.apiUrl}/${this.route}/authorize-transaction`, transactionOptions, { headers });
  }

  authorizeDestinationTransaction(transactionOptions: DestinationTransactionOptions): Observable<DestinationTransactionOptions> {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      return this.http.post<DestinationTransactionOptions>(
        `${this.apiUrl}/${this.route}/authorize-destination`, transactionOptions, { headers });
  }

  createCustomer(cardInfo: CardInfo): Observable<boolean> {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      return this.http.post<boolean>(`${this.apiUrl}/${this.route}/create-customer`, cardInfo, { headers });
  }

  hasCustomer(): Observable<boolean> {
      const headers = new HttpHeaders();
      headers.append('Content-Type', 'application/json');

      return this.http.get<boolean>(`${this.apiUrl}/${this.route}/has-customer`, { headers });
  }
}
