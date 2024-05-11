/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Parent, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import { Company } from 'src/entities/company.entity';
import { CompanyService } from './company.service';
import { CompanyDto } from 'src/dto/company.input';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { Country } from 'src/entities/country.entity';
import { OperatorDTO } from 'src/dto/operator.input';
import { UpdateCompanyDto } from 'src/dto/updateCompany.input';
import { ReturnType } from './constants/returnType.input';
import { PubSub } from 'graphql-subscriptions';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { UseInterceptors } from '@nestjs/common';

@Resolver((of) => Company)
export class CompanyResolver {
    constructor(
      private readonly companyService: CompanyService,
      private readonly pubSub: PubSub
      ) {}

      /**
       * 
       * @returns 
       */
    @Query((type) => [Company])
    async getAllCompany() {
      const response=await this.companyService.getAll();
      return response['status']==='SUCCESS' ? response['data'] : null
    }

    @ResolveField(returns => [Company])
    async companies(@Parent() company: Company) {
    const { COMPANY_ID } = company;
    return this.companyService.findAllByID(COMPANY_ID);
  }
  
  @ResolveField(returns => [Country])
    async countryData(@Parent() company: Company) {
    const { COMPANY_ID } = company;
    return this.companyService.findAllCountryByID(COMPANY_ID);
    }
    /**
     * 
     * @returns 
     */

    @Query(() => [Company], {nullable:true})
     getAllCompanyCountries() {
      return this.companyService.getCompanyCountries();
    }

    /**
     * 
     * @param companyDto 
     * @returns 
     */
    @Mutation((returns) => ReturnType)
    async createCompany(@Args('companyDto') companyDto: CompanyDto) {
      const response=await  this.companyService.createCompany(companyDto);
      this.pubSub.publish('companyCreated', { companyCreated: response });
      return response
    }

    /**
     * 
     * @param id 
     * @param operatorDTO 
     * @returns 
     */
    @Mutation(returns => ReturnType)
    async disableCompany(
      @Args('id') id: number,
      @Args('operatorDTO') operatorDTO: OperatorDTO
    ) {
      return await this.companyService.disableCompany(id, operatorDTO);
    }

    /**
     * 
     * @param id 
     * @param operatorDTO 
     * @returns 
     */
    @Mutation(returns => ReturnType)
    async enableCompany(
      @Args('id') id: number,
      @Args('operatorDTO') operatorDTO: OperatorDTO
    ) {
      return await this.companyService.enableCompany(id, operatorDTO);
    }

    /**
     * 
     * @param id 
     * @param updateCompanyDto 
     * @returns 
     */
    @Mutation(returns => ReturnType)
    async updateCompany(
      @Args('id') id: number,
      @Args('updateCompanyDto') updateCompanyDto: UpdateCompanyDto
    ) {
      return await this.companyService.updateCompany(id, updateCompanyDto);
    }

    /**
     * 
     * @param id 
     * @param operatorDTO 
     * @returns 
     */
    @Mutation(returns => ReturnType)
    async deleteCompany(
      @Args('id') id: number,
      @Args('operatorDTO') operatorDTO: OperatorDTO
    ) {
      const deletedCompany = await this.companyService.deleteCompany(id, operatorDTO);
      this.pubSub.publish('companyDeleted', { companyDeleted: deletedCompany });
      return deletedCompany;
    }

    /**
     * 
     * @returns 
     */
    @Subscription(() => ReturnType, {
      filter: (payload, variables) => {
        // You can implement filtering logic here if needed
        return payload.companyDeleted.id === variables.id;
      },
    })
    companyDeleted() {
      return this.pubSub.asyncIterator('companyDeleted');
    }


    /**
     * 
     * @returns 
     */
    @Subscription(() => ReturnType, {
      filter: (payload, variables) => {
        // You can implement filtering logic here if needed
        return payload.companyCreated.id === variables.id;
      },
    })
    companyCreated() {
      return this.pubSub.asyncIterator('companyCreated');
    }

}
