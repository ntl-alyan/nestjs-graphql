/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CountryService } from './country.service';
import { CountryResolver } from './country.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Country } from 'src/entities/country.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Company,
      Country
    ]),
  ],
  providers: [CountryService, CountryResolver]
})
export class CountryModule {}
