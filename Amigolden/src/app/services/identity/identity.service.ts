import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
import { Events } from '@ionic/angular';
import { UsersEndpointService } from '../endpoints/users-endpoint.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';

@Injectable({
    providedIn: 'root'
})
export class Identity {

    constructor(public usersProvider: UsersEndpointService, public events: Events, protected storage: Storage) {
    }

    initializeUser(): Promise<User> {
        // TODO: Refactor this, if anything we probably should call this before initialize user
        return this.getLoggedInUser().toPromise().then(u => {
            return this.setUserInfo(u);
        });
    }

    setUserInfo(user: User): Promise<User> {
        return this.storage.ready().then(s => {
            return this.storage.set(environment.data.currentUser, user).then(() => user);
        });
    }

    getCurrentUser(): Promise<User> {
        return this.storage.ready().then(s => {
            return this.storage.get(environment.data.currentUser).then(u => {
                if (u) {
                    return u;
                }

                return this.initializeUser();
            });
        });
    }

    private getLoggedInUser(): Observable<User> {
        return this.usersProvider.getByRoute('Current');
    }
}
