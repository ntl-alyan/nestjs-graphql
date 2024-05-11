/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Column, Entity, Index, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Country } from "./country.entity";


// @Index("company_pkey", ["COMPANY_ID"], { unique: true })
@Entity("company", { schema: "public" })
@ObjectType()
export class Company {
    @Column("bigint", { primary: true, name: "company_id" })
    @Field((type) => Int)
    COMPANY_ID: string;

    @Column("character varying", {
        name: "company_name",
        nullable: true,
        length: 100,
    })
  @Field({nullable:true})
  COMPANY_NAME: string | null;

  @Column("character varying", {
    name: "company_code",
    nullable: true,
    length: 50,
  })
  @Field({nullable:true})
  COMPANY_CODE:string | null;

  @Column("character varying", {
    name: "abbreviation",
    nullable: true,
    length: 30,
  })
  @Field({nullable:true})
  ABBREVIATION: string | null;

  @Column("character varying", {
    name: "record_status",
    nullable: true,
    length: 30,
  })
  @Field({nullable:true})
  RECORD_STATUS: string | null;

  @Column("character varying", { name: "operator", nullable: true, length: 30 })
  @Field({nullable:true})
  OPERATOR: string | null;

 @Column("timestamp without time zone", { name: "datetime", nullable: true })
  @Field()
  DATETIME: Date | null;

  @Column("character varying", {
    name: "row_status",
    nullable: true,
    length: 30,
  })
  @Field()
  ROW_STATUS: string | null;

  @Column("character varying", {
    name: "modified_by",
    nullable: true,
    length: 30,
  })
  @Field({ nullable: true })
  MODIFIED_BY: string | null;

  @Column("timestamp without time zone", {
    name: "modified_datetime",
    nullable: true,
  })
  @Field({ nullable: true })
  MODIFIED_DATETIME: Date | null;

  @OneToMany(() => Country, (Country) => Country.companies)//inverse relationin a entity
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'COMPANY_ID' }])
  @Field(type => [Country])
  /*current relation name*/
  countries: Country[]; //if one to many add array brackets else not

}
