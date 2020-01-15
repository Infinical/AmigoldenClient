import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { Identity } from 'src/app/services/identity/identity.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginUrl = environment.apiUrl + '/Account/ExternalLogin';
  constructor(private authManager: AuthenticationService, private identity: Identity, private router: Router) { }

  ngOnInit() {
    let qs = window.location.search;
    if (qs.indexOf('?') === 0) {
        qs = qs.substring(1);
    }
    const params = new URLSearchParams(qs);
    const accessTokenParamName = 'access_token';
    const accessToken = params.get(accessTokenParamName);

    if (accessToken) {
        params.delete(accessTokenParamName);
        this.authManager.setAccessToken(accessToken).then(v => {
           this.identity.getCurrentUser().then(u => {
            this.identity.userId = u.id;
            this.router.navigate(['users']);
          });
        });
    }
  }
}
