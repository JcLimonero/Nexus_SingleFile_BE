import { Repository } from 'typeorm';
import { Agency } from './entities/agency.entity';
export declare class AgenciesService {
    private agenciesRepository;
    constructor(agenciesRepository: Repository<Agency>);
    findAll(): Promise<Agency[]>;
}
