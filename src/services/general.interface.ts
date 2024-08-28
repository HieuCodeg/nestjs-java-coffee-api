export interface IGeneralService<T> {
  findAll(): Promise<T[]>;

  getById(id: number): Promise<T>;

  findById(id: number): Promise<T | null>;

  save(t: T): Promise<T>;

  remove(id: number): Promise<void>;
}
