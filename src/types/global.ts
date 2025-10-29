export interface GenericSearchInstance {
  search(query: string): any[];
  addDocuments(docs: any[]): void;
  destroy(): void;
}

export interface GenericSearchOptions {
  containerSelector?: string;
  [key: string]: any;
}
