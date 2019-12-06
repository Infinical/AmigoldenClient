import { Injectable } from '@angular/core';
import { IHasId } from '../models/interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResourceBaseService } from '../services/api-resource-base/api-resource-base.service';

@Injectable({
    providedIn: 'root'
})
export class DetailPageBase<T extends IHasId> {

    entity: T;
    entityId: number;
    constructor(protected route: ActivatedRoute, protected router: Router, protected baseProvider: ApiResourceBaseService<T>) {
      this.route.queryParams.subscribe(params => {
        this.entityId = params.id;
      });

      if (this.router.getCurrentNavigation().extras.state) {
        this.entity = this.router.getCurrentNavigation().extras.state.entity;
      }
    }

    public onEntityLoadCallBack(entity: T) {

    }

    get(entityId: number): Observable<T> {
        const result = this.baseProvider.get(entityId);
        result.subscribe(this.suscribeEntity);

        return result;
    }

    update(): Observable<T> {
        const result = this.baseProvider.update(this.entity);
        result.subscribe(this.suscribeEntity);

        return result;
    }

    create(): Observable<T> {
        // TODO: Refactor suscribe to method
        const result = this.baseProvider.create(this.entity);
        result.subscribe(this.suscribeEntity);

        return result;
    }

    save(): Observable<T> {
        if (!this.entity) {
            return;
        }

        return this.entity.id ? this.update() : this.create();
    }

    delete(): Observable<boolean> {
        const result = this.baseProvider.delete(this.entity);
        result.subscribe(r => console.log(r));

        return result;
    }

    private suscribeEntity(entityData: T) {
        this.entity = entityData;
    }
}
