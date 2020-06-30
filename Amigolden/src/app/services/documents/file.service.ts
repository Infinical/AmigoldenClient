import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AMGDocument } from 'src/app/models/document';
import { map } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class FileService {

    apiUrl = environment.apiUrl;
    route = 'upload';
    uploadRoute = `${this.apiUrl}/${this.route}`;
    constructor(public http: HttpClient) {
    }

    uploadProfilePicture(formData: FormData, headers: HttpHeaders): Observable<AMGDocument[]> {
        return this.http.post<AMGDocument[]>(this.uploadRoute, formData, { headers });
    }

    download(documentId: number): Observable<Blob> {
        return this.http.get(`${this.uploadRoute}/${documentId}`, { responseType: 'blob' });
    }

    protected blobToFile = (theBlob: Blob, fileName: string): File => {
        const b: any = theBlob;
        // A Blob() is almost a File() - it's just missing the two properties below which we will add
        b.lastModifiedDate = new Date();
        b.name = fileName;

        // Cast to a File() type
        return theBlob as File;
    }

    protected getFileNameFromHttpResponse(httpResponse: Response): string {
        const contentDispositionHeader = httpResponse.headers.get('Content-Disposition');

        if (contentDispositionHeader == null) {
            return '';
        }

        const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        return result.replace(/"/g, '');
    }
}
