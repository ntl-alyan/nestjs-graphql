/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-const */
import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { loggerMiddleware } from 'src/middlewares/fieldMiddleware';
@InputType()
export class CompanyDto {
  @Field({nullable:true})
    COMPANY_ID: Number;

    @Field({ middleware: [loggerMiddleware] })
    COMPANY_NAME: string;

    @Field()
    COMPANY_CODE: string;
    
    @Field()
    ABBREVIATION: string;
    
    @Field({nullable:true})
    RECORD_STATUS: string;
  
    @Field()
    OPERATOR: string;
    
    @Field({nullable:true})
    DATETIME: Date;
    
    @Field({nullable:true})
    ROW_STATUS: string;
  }

  