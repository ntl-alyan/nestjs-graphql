/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable prefer-const */
import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource } from "typeorm";

@Injectable()
export class DBSequenceService {
  constructor(
    private dataSource: DataSource,
    // @InjectDataSource("radiusDbConnection")
    // private radiusDbDataSourceLive: DataSource
  ) {}


  /**
   * This function returns sequence
   * @param sequenceName
   * @returns
   */
  async getTableSequence(sequenceName) {
    const sequence = await this.dataSource.manager.query(
      `select nextval('${sequenceName}') as id`
    );
    return sequence[0].id;
  } // end of GET_SEQUENCE_FUNCTION



}
