/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Company } from "./company.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";
import { State } from "./state.entity";

// @Index("country_pkey", ["COUNTRY_ID"], { unique: true })
@Entity("country", { schema: "public" })
@ObjectType()
export class Country {
  @Column("bigint", { primary: true, name: "country_id" })
  @Field((type) => Int)
  COUNTRY_ID: string;

  @Column("bigint", { name: "company_id", nullable: true })
  @Field({nullable:true})
  COMPANY_ID: string | null;

  @Column("character varying", {
    name: "country_name",
    nullable: true,
    length: 50,
  })
  @Field({ nullable: true })
  COUNTRY_NAME: string | null;

  @Column("character varying", {
    name: "country_code",
    nullable: true,
    length: 20,
  })
  @Field({ nullable: true })
  COUNTRY_CODE: string | null;

  @Column("character varying", {
    name: "abbreviation",
    nullable: true,
    length: 30,
  })
  @Field({ nullable: true })
  ABBREVIATION: string | null;

  @Column("character varying", {
    name: "record_status",
    nullable: true,
    length: 30,
  })
  @Field()
  RECORD_STATUS: string | null;

  @Column("character varying", { name: "operator", nullable: true, length: 30 })
  @Field({ nullable: true })
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

  @ManyToOne((type) => Company) // no inverse in many to one
  @JoinColumn([{ name: 'company_id', referencedColumnName: 'COMPANY_ID' }])
  companies: Company;

  @OneToMany(() => State, (State) => State.countries)//inverse relationin a entity
  @JoinColumn([{ name: 'country_id', referencedColumnName: 'COUNTRY_ID' }])
  @Field(type => [State])
  /*current relation name*/
  states: State[]; //
}
