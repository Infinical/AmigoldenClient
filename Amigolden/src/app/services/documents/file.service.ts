import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    apiUrl = environment.apiUrl;
    route = 'upload';
    uploadRoute = `${this.apiUrl}/${this.route}/`;
    constructor(public http: HttpClient) {
    }

    // uploadProfilePicture(formData: FormData, options: any): Observable<Document[]> {
    //     return this.http.post<Document[]>(this.uploadRoute, formData, options);
    // }

    // upload(formData: FormData, options: RequestOptions): Observable<Document[]> {
    //     return this.http.post<Document[]>(this.uploadRoute, formData, options);
    // }

    // TODO: refactor this use: https://brianflove.com/2017/11/02/angular-http-client-blob/
    download(documentId: number): Observable<File> {
        return this.http.get<File>(`${this.uploadRoute}/${documentId}`,
        { observe: 'response', responseType: ResponseContentType.Blob })
            .map((res: Response) => {
                const filename = this.getFileNameFromHttpResponse(res);
                return from(this.blobToFile(res.blob(), filename));
            });
    }

    protected getFileNameFromHttpResponse(httpResponse: Response): string {
        const contentDispositionHeader = httpResponse.headers.get('Content-Disposition');

        if (contentDispositionHeader == null) {
            return '';
        }

        const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
        return result.replace(/"/g, '');
    }

    protected blobToFile = (theBlob: Promise<Blob>, fileName: string): Promise<File> => {
        return theBlob.then((b: any) => {
            b.lastModifiedDate = new Date();
            b.name = fileName;
            return b;
        });
    }
}
