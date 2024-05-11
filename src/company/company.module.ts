/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from 'src/entities/company.entity';
import { Country } from 'src/entities/country.entity';
import { DBSequenceService } from 'src/DbSequenceService';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports:[
    TypeOrmModule.forFeature([
      Company,
      Country
    ]),
  ],
  providers: [CompanyService, CompanyResolver,DBSequenceService,PubSub]
})
export class CompanyModule {}
