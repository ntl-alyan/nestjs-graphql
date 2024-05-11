/* eslint-disable prettier/prettier */
import { HttpStatus } from '@nestjs/common';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class ReturnType {
  @Field()
  status: string;

  @Field()
  httpStatus: HttpStatus;

  @Field()
  message: string;

  @Field(() => [String], { nullable: true })
  data: string[];
}
