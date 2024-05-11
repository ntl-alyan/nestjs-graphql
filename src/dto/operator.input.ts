/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-const */
import { Field, InputType } from '@nestjs/graphql';
@InputType()
export class OperatorDTO {
    @Field()
    MODIFIED_BY: string;

  }

  