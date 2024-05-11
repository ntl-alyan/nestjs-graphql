/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Int, Resolver } from '@nestjs/graphql';
import { Company } from 'src/entities/company.entity';
import { CountryService } from './country.service';
import { CompanyDto } from 'src/dto/company.input';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Country } from 'src/entities/country.entity';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';

@Resolver()
export class CountryResolver {
    constructor(private countryService: CountryService) {}

    @Query(() => [Country])
    async getAllCountries() {
      return this.countryService.getAllCountries();
    }

    @UseInterceptors(CacheInterceptor)
    @CacheKey('getCountryById')
    @CacheTTL(30)
    @Query((returns) => Country, { nullable: true })
    getCountryById(@Args('id', { type: () => Int }) id: number) {
    return this.countryService.getCountryById(id);
  }

}
