import { Injectable } from '@angular/core';
import { IHasId } from '../models/interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class DetailPageBase<T extends IHasId> {

    entity: T;
    entityId: number;
    constructor(protected route: ActivatedRoute, protected router: Router) {
      this.route.queryParams.subscribe(params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.entity = this.router.getCurrentNavigation().extras.state.entity;
        }
      });
    }
}
