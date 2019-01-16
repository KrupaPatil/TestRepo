export interface SearchableResourceInterface {
  search(term: string, skip: number, take: number, list?: string);
}
