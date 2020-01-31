export class SearchSettings {
    constructor(
        public applyODataFilter: (searchTerm: string) => string,
        public searchDelayMS = 1000) {
    }
}
