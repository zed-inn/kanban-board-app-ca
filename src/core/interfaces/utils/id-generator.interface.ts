export interface IdGenerator {
  generateUnique(): Promise<string>;
}
