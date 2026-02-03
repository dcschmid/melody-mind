export interface GenericSearchInstance {
  search(_query: string): any[];
  addDocuments(_docs: any[]): void;
  destroy(): void;
}

export interface GenericSearchOptions {
  containerSelector?: string;
  [key: string]: any;
}
