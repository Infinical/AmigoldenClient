import { Injectable } from '@angular/core';
import { Meeting } from 'src/app/models/meetings';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ApiResourceBaseService } from '../api-resource-base/api-resource-base.service';
import { Location } from 'src/app/models/location';

@Injectable({
  providedIn: 'root'
})
export class EventsService extends ApiResourceBaseService<Meeting>  {
    constructor(public http: HttpClient) {
        super(http, 'meetings');
    }

    enroll(meetingId: number): Observable<boolean> {

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        return  this.http.post<boolean>(`${this.apiUrl}/${this.route}/enroll/${meetingId}`, null, { headers});
    }

    isEnrolled(meetingId: number): Observable<boolean> {

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        return  this.http.post<boolean>(`${this.apiUrl}/${this.route}/is-enrolled/${meetingId}`, null, { headers});
    }

    getDefaultEventCost(meetingId: number): Observable<number> {

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        return  this.http.post<number>(`${this.apiUrl}/${this.route}/default-event-amount/${meetingId}`, null, { headers});
    }

    getDirectChargeEventCost(meetingId: number): Observable<number> {

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        return  this.http.post<number>(`${this.apiUrl}/${this.route}/direct-event-amount/${meetingId}`, null, { headers});
    }

    meetingsBetween(locationId: number, startDate?: Date, endDate?: Date): Observable<Meeting[]> {

        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        let url = `${this.apiUrl}/${this.route}/MeetingsBetween/${locationId}?`;

        if (startDate) {
            url = url + 'startDate=' + startDate.toISOString();
        }
        if (endDate) {
            url = url + '&endDate=' + endDate.toISOString();
        }

        return this.http.get<Meeting[]>(url, { headers});
    }

    getUserMeetings() {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        const url = `${this.apiUrl}/${this.route}/user-meetings/`;

        return this.http.get<Meeting[]>(url, { headers});
    }

    getMeetingWithinRange(lat: number, lon: number, withinMiles: number) {
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'application/json');

        const url = `${this.apiUrl}/${this.route}/within-range?lat=${lat}&lon=${lon}&withinMiles=${withinMiles}`;
        return this.http.get<Meeting[]>(url, { headers});
    }
}
