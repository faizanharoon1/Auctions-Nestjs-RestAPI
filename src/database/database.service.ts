import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';

@Injectable()
export abstract class DatabaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

}
