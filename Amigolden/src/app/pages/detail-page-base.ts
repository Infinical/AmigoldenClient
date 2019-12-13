import { Injectable } from '@angular/core';
import { IHasId } from '../models/interfaces/interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResourceBaseService } from '../services/api-resource-base/api-resource-base.service';

@Injectable({
    providedIn: 'root'
})
export class PageBase {
    entityId: number;
    constructor(protected route: ActivatedRoute, protected router: Router) {
        this.entityId = +this.route.snapshot.paramMap.get('id');
    }
}

@Injectable({
    providedIn: 'root'
})
export class EntityPageBase<T extends IHasId> extends PageBase {
    entity: T;
    constructor(protected route: ActivatedRoute, protected router: Router, protected baseProvider: ApiResourceBaseService<T>) {
        super(route, router);

        if (this.router.getCurrentNavigation().extras.state) {
            this.entity = this.router.getCurrentNavigation().extras.state.entity;
        } else if (!this.entity) {
            baseProvider.get(this.entityId).subscribe(entity => this.entity = entity);
        }
    }
}

@Injectable({
    providedIn: 'root'
})
export class DetailPageBase<T extends IHasId> extends EntityPageBase<T> {
    constructor(protected route: ActivatedRoute, protected router: Router, protected baseProvider: ApiResourceBaseService<T>) {
        super(route, router, baseProvider);
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
