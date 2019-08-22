import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private storage: Storage) {
  }

  // TODO: create a data service to handle storage
  setAccessToken(accessToken: string): Promise<string> {
      return this.storage.ready().then(s => {
          return this.storage.set(environment.authentication.userTokenName, accessToken);
      });
  }

  getRawAccessToken(): Promise<string> {
      return this.storage.ready().then(s => {
          return this.storage.get(environment.authentication.userTokenName);
      });
  }

  IsLoggedIn(): Promise<boolean> {
    return this.getRawAccessToken().then(t => {
      console.log(t);
      return t != null;
    });
  }
}
