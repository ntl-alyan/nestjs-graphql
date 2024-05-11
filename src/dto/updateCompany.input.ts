/* eslint-disable prettier/prettier */

import { Field, InputType } from "@nestjs/graphql";
import {
    IsDate,
    IsOptional,
  } from "class-validator";

@InputType()
export class UpdateCompanyDto {
    @Field()
    COMPANY_NAME: string;
  
    @Field()
    COMPANY_CODE: string;
  
    @Field()
    ABBREVIATION: string;
  
    @Field()
    MODIFIED_BY: string;
  
    @IsOptional()
    @IsDate()
    MODIFIED_DATETIME: Date;
  }
  