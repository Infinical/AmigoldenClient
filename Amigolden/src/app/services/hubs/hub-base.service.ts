declare var require: any;
import { EventEmitter, Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { environment } from 'src/environments/environment';
const { HubConnection, HubConnectionBuilder } =  require('@aspnet/signalr');

@Injectable({
  providedIn: 'root'
})
export class HubBase {

    connectionEstablished = new EventEmitter<boolean>();
    connectionExists = false;

    onNotify = new EventEmitter<any>();

    // tslint:disable-next-line:variable-name
    protected _hubConnection: any;

    constructor(public authManager: AuthenticationService) {
    }

    // TODO: figure out a better way to handle initialization
    initialize(hubSubRoute: string): Promise<any> {
        return this.authManager.getRawAccessToken().then((accessToken) => {
            const hubUrl = environment.baseUrl + hubSubRoute;
            this._hubConnection = new HubConnectionBuilder()
                                        .withUrl(hubUrl, { accessTokenFactory: () => accessToken })
                                        .build();
            return this.startConnection();
        });
    }

    invoke(dto: any) {
        this._hubConnection.invoke('Push', dto).catch(err => console.error(err.toString()));
    }

    registerOnNotify() {
        this._hubConnection.on('Push', (data: any) => {
            this.onNotify.emit(data);
        });
    }

    startConnection(): Promise<any> {

        return this._hubConnection.start()
            .then(() => {
                console.log('Hub connection started');
                this.connectionEstablished.emit(true);
            })
            .catch(err => {
                console.log('Error while establishing connection');
            });
    }

    endConnection(): void {
    }
}


@Injectable({
  providedIn: 'root'
})
export class HubServiceBase extends HubBase {
  private readonly createApiEventName = 'Create';
  private readonly updateApiEventName = 'Update';

  onCreate = new EventEmitter<any>();
  onUpdate = new EventEmitter<any>();
  connectionEstablished = new EventEmitter<boolean>();
  connectionExists = false;

  constructor(public authManager: AuthenticationService) {
      super(authManager);
  }

  registerOnServerEvents(): void {
      this._hubConnection.on(this.createApiEventName, (data: any) => {
          this.onCreate.emit(data);
      });

      this._hubConnection.on(this.updateApiEventName, (data: any) => {
          this.onUpdate.emit(data);
      });
  }
}
