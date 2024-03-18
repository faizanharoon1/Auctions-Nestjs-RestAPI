import { ConflictException, Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';

@Injectable()
export abstract class DatabaseService<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(createDto: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(createDto);
    return this.repository.save(entity);
  }

  async findAll(relations: string[] = []): Promise<T[]> {
    return this.repository.find({ relations });
  }
  
  

    async upsert(entities: QueryDeepPartialEntity<T>[], conflictPathsOrOptions: string[] | UpsertOptions<T>): Promise<void> {
      try {
      await this.repository.upsert(entities, conflictPathsOrOptions);
    } catch (error) {
      throw new ConflictException('Could not upsert the entities due to a conflict or error.', error.message);
    }
    }


}
