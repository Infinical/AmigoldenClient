export class SearchSettings {
    constructor(
        public searchDelayMS = 1000,
        public filterModifier: (searchTerm: string) => any = (searchTerm: string) => searchTerm
    ) {}
}
