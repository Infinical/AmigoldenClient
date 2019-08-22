export class Page<T> {
    constructor(public pageSize: number, public pageNumber: number,
                public totalNumberOfResult: number, public items: Array<T>) {
    }
}
