import { AgenciesService } from './agencies.service';
export declare class AgenciesController {
    private readonly agenciesService;
    constructor(agenciesService: AgenciesService);
    findAll(): Promise<import("./entities/agency.entity").Agency[]>;
}
