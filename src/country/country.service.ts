/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cache } from 'cache-manager';
import { CompanyDto } from 'src/dto/company.input';
import { Company } from 'src/entities/company.entity';
import { Country } from 'src/entities/country.entity';
import { Repository } from 'typeorm';


@Injectable()
export class CountryService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository<typeof Company>,
        @InjectRepository(Country)
        private countryRepository: Repository<typeof Country>,
        @Inject(CACHE_MANAGER) private cacheService: Cache,
    ) {}

    async getAllCountries(){
        return await this.countryRepository.find();
    }

     async getCountryCompanies(){
        return  this.countryRepository.find(
            {
                relations:['companies']
            }
        );
    }

   async getCountryById(id: number) {
    const cachedData = await this.cacheService.get(
        id.toString(),
      );

      if (cachedData) {
        return cachedData;
      }


      const res= await this.countryRepository.findOne({
        where: { COUNTRY_ID:id } as unknown,
        relations: ['companies'],
      });

      await this.cacheService.set(id.toString(), res);

      return res;
    }

}
