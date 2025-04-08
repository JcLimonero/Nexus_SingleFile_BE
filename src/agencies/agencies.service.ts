import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agency } from './entities/agency.entity';

@Injectable()
export class AgenciesService {
  constructor(
    @InjectRepository(Agency)
    private agenciesRepository: Repository<Agency>,
  ) {}

  async findAll(): Promise<Agency[]> {
    return this.agenciesRepository.find({
      order: {
        description: 'ASC'
      }
    });
  }
} 