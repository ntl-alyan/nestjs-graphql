/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Country } from "./country.entity";
import { Field, Int, ObjectType } from "@nestjs/graphql";

@Index("state_pkey", ["STATE_ID"], { unique: true })
@Entity("state", { schema: "public" })
@ObjectType()
export class State {
  @Column("bigint", { primary: true, name: "state_id" })
  @Field((type) => Int)
  STATE_ID: string;

  @Column("bigint", { name: "country_id", nullable: true })
  @Field()
  COUNTRY_ID: string | null;

  @Column("character varying", {
    name: "state_name",
    nullable: true,
    length: 50,
  })
  @Field()
  STATE_NAME: string | null;

  @Column("character varying", {
    name: "state_code",
    nullable: true,
    length: 20,
  })
  @Field()
  STATE_CODE: string | null;

  @Column("character varying", {
    name: "abbreviation",
    nullable: true,
    length: 30,
  })
  @Field()
  ABBREVIATION: string | null;

  @Column("character varying", {
    name: "record_status",
    nullable: true,
    length: 30,
  })
  @Field()
  RECORD_STATUS: string | null;

  @Column("character varying", { name: "operator", nullable: true, length: 30 })
  @Field()
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
  @Field({nullable:true})
  MODIFIED_BY: string | null;

  @Column("timestamp without time zone", {
    name: "modified_datetime",
    nullable: true,
  })
  @Field({nullable:true})
  MODIFIED_DATETIME: Date | null;

  @ManyToOne((type) => Country) // no inverse in many to one
  @JoinColumn([{ name: 'country_id', referencedColumnName: 'COUNTRY_ID' }])
  countries: Country;



}
