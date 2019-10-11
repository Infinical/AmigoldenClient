import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { isString } from 'util';


@Injectable()
export class ModelBinderInterceptor implements HttpInterceptor {

    // regex of ISO 8601 Date.
    // it only catches full dates
    // (Year, Date and Time, optional ms, Timezone offset
    DATE_TIME_TIMEZONE_REGEXP =
    /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;

    constructor() {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(req).pipe(tap((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                event = event.clone({body: this.modifyBody(event.body)});
            }
            return event;
        }));

    }

    private modifyBody(body: any) {
        return this.deserializeDates(body);
    }

    private deserializeDates(obj) {
        if ((!(obj instanceof Object)) || (isString(obj))) {
            return obj;
        }

        for (const key of Object.keys(obj)) {
            const value = obj[key];
            let date;

            if (isString(value) &&  (this.DATE_TIME_TIMEZONE_REGEXP.test(value))) {
                date = new Date(value);
                // the parsing above may fail, in which case we use isNaN to check if the date is valid, otherwise leave the data as is.
                if (isNaN(date.getTime())) {
                    return;
                }
                obj[key] = date;
            }
            this.deserializeDates(value);
        }

        return obj;
    }
}


