/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DBSequenceService } from 'src/DbSequenceService';
import { CompanyDto } from 'src/dto/company.input';
import { OperatorDTO } from 'src/dto/operator.input';
import { Company } from 'src/entities/company.entity';
import { Country } from 'src/entities/country.entity';
import { In, Not, Raw, Repository } from 'typeorm';
import { shallowEqual } from './constants/updateCheck';
import { UpdateCompanyDto } from 'src/dto/updateCompany.input';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(Company)
        private companyRepository: Repository< Company>,
        @InjectRepository(Country)
        private countryRepository: Repository<typeof Country>,

        @Inject(CACHE_MANAGER) 
        private cacheService: Cache,
        private readonly dbSequenceService:DBSequenceService
    ) {}

    async getAll(){
      try{
        const res= await this.companyRepository.find({
          where:{
            ROW_STATUS:'active'
          }as unknown
        });

        console.log("alyantest-jenkins")

        if(res.length>0)
        {
          return {
            status: 'SUCCESS',
            httpStatus: HttpStatus.FOUND,
            message: 'Found Successfully',
            data: res,
          };
        }
        else{
          return {
            status: 'FAILURE',
            httpStatus: HttpStatus.NOT_FOUND,
            message: 'Data Not Found',
            data: [],
          };
        }
      }
      catch(err)
      {
        return {
          status: 'FAILURE',
          message: 'Exception Occured',
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          data: [],
        };
      }
       
    }

    async findAllByID(companyID)
    {
      //try{
      
        const res= await this.companyRepository.find({
          where:{
            COMPANY_ID:companyID,
            ROW_STATUS:'active'
          }as unknown
        });

        return res
       
      // }
      // catch(err)
      // {
      //   console.log(err)
      //   return {
      //     status: 'FAILURE',
      //     message: 'Exception Occured',
      //     httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      //     data: [],
      //   };
      // }
    }

    async findAllCountryByID(companyID)
    {
      //try{
      
        const res= await this.countryRepository.find({
          where:{
            COMPANY_ID:companyID,
            ROW_STATUS:'active'
          }as unknown
        });

        return res
       
      // }
      // catch(err)
      // {
      //   console.log(err)
      //   return {
      //     status: 'FAILURE',
      //     message: 'Exception Occured',
      //     httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
      //     data: [],
      //   };
      // }
    }

     async getCompanyCountries(){
        const res=await this.companyRepository.find(
            {
                relations:['countries.states'],
            }
        );


        return res;

  
    }

    async createCompany(companyDto: CompanyDto) {

      try{
        let companyNameExists = await this.companyRepository.find({
          where: {
            COMPANY_NAME: Raw((alias) => `LOWER(${alias}) Like LOWER(:value)`, {
              value: `%${companyDto.COMPANY_NAME}%`,
            }),
            // COMPANY_NAME: companyDto.COMPANY_NAME,
            ROW_STATUS: 'active',
          } as unknown,
        });
  
        if (companyNameExists.length > 0) {
          return {
            status: 'FAILURE',
            httpStatus: HttpStatus.FOUND,
            message: 'Company Name Already Exists',
            data: [],
          };
          // return "COMPANY_NAME ALREADY EXISTS";
        } else {
          let companyCodeExists = await this.companyRepository.find({
            where: {
              COMPANY_CODE: companyDto.COMPANY_CODE,
              ROW_STATUS: 'active',
            } as unknown,
          });
          if (companyCodeExists.length > 0) {
            return {
              status: 'FAILURE',
              httpStatus: HttpStatus.FOUND,
              message: 'Company Code Already Exists',
              data: [],
            };
            // return "COMPANY_CODE ALREADY EXISTS";
          } else {
            let companyAbbreviationExists = await this.companyRepository.find({
              where: {
                ABBREVIATION: companyDto.ABBREVIATION,
                ROW_STATUS: 'active',
              } as unknown,
            });
            if (companyAbbreviationExists.length > 0) {
              return {
                status: 'FAILURE',
                httpStatus: HttpStatus.FOUND,
                message: 'Abbreviation Already Exists',
                data: [],
              };
              // return "ABBREVIATION ALREADY EXISTS";
            }
            else
            {
              const companyId =
              await this.dbSequenceService.getTableSequence(`COMPANY_ID_SEQ`);
              companyDto.DATETIME = new Date();

              companyDto.COMPANY_ID = companyId;
              companyDto.RECORD_STATUS = 'active';
              companyDto.ROW_STATUS = 'active';
              let res = await this.companyRepository.save(companyDto as unknown);

              return {
                status: 'SUCCESS',
                httpStatus: HttpStatus.CREATED,
                message: 'Created Successfully',
                data: [],
              };
            }
          }

        }
      }
      catch(error)
      {
        console.log(error)
        return {
          status: 'FAILURE',
          message: 'Exception Occured',
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          data: [],
        };
      }
    }

    async disableCompany (id:number,operatorDTO:OperatorDTO)
    {
        try{
            const date=new Date();

            let idExists = await this.companyRepository.find({
                relations: ['countries'],
                where: {
                  COMPANY_ID: id,
                  ROW_STATUS: In(['active', 'ACTIVE']),
                  RECORD_STATUS: In(['active', 'ACTIVE']),
                } as unknown,
              });

              if (idExists.length == 0) {
                return {
                  status: 'FAILURE',
                  httpStatus: HttpStatus.PRECONDITION_FAILED,
                  message: 'Company Is Already Disabled',
                  data: [],
                };
              }
              else {
                if (idExists[0]['countries'].length > 0) {
                  let idChildExists = await this.companyRepository.find({
                    relations: ['countries'],
                    where: {
                      COMPANY_ID: id,
                      ROW_STATUS: In(['active', 'ACTIVE']),
                      RECORD_STATUS: In(['active', 'ACTIVE']),
                      countries: {
                        ROW_STATUS: In(['active', 'ACTIVE']),
                        RECORD_STATUS: In(['active', 'ACTIVE']),
                      },
                    } as unknown,
                  });

                  if (idChildExists.length > 0) {
                    return  {
                      status: 'FAILURE',
                      httpStatus: HttpStatus.FOUND,
                      message: 'Mapping Exists In Country Management',
                      data: [],
                    };
                  } else {
                  }
                }
            }

            const response= await this.companyRepository.update(
                id as unknown,
                {
                  RECORD_STATUS: 'disabled',
                  MODIFIED_BY: operatorDTO.MODIFIED_BY,
                  MODIFIED_DATETIME: date,
                } as unknown,
              );
              
            
              if (response.affected === 1) {
                return  {
                  status: 'SUCCESS',
                  httpStatus: HttpStatus.OK,
                  message: 'Disabled Successfully',
                  data: [],
                };
              } else {
                return {
                  status: 'FAILURE',
                  httpStatus: HttpStatus.BAD_REQUEST,
                  message: 'Company Not Disabled',
                  data: [],
                };
              }
        }
        catch(err)
        {
            console.log(err);
            return {
                status: 'FAILURE',
                message: 'Exception Occured',
                httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
                data: [],
            };
        }
    }

    async enableCompany(id: number, operatorDto: OperatorDTO) {
      try {
        let returnResponse = {};
        const date = new Date();
        let idExists = await this.companyRepository.find({
          where: {
            COMPANY_ID: id,
            ROW_STATUS: In(['active', 'ACTIVE']),
            RECORD_STATUS: In(['disabled', 'DISABLED']),
          } as unknown,
        });
  
        if (idExists.length == 0) {
          return (returnResponse = {
            status: 'FAILURE',
            httpStatus: HttpStatus.PRECONDITION_FAILED,
            message: 'Company Is Already Enabled',
            data: [],
          });
        } else {
          let response = await this.companyRepository.update(
            id as unknown,
            {
              RECORD_STATUS: 'active',
              MODIFIED_BY: operatorDto.MODIFIED_BY,
              MODIFIED_DATETIME: date,
            } as unknown,
          );
          if (response.affected == 1) {
            return (returnResponse = {
              status: 'SUCCESS',
              httpStatus: HttpStatus.OK,
              message: 'Enabled Successfully',
              data: [],
            });
          } else {
            return (returnResponse = {
              status: 'FAILURE',
              httpStatus: HttpStatus.BAD_REQUEST,
              message: 'Company Not Enabled',
              data: [],
            });
          }
        }
      } catch (error) {
        console.log(error);
        return {
          status: 'FAILURE',
          message: 'Exception Occured',
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          data: [],
        };
      }
    }

    async deleteCompany(id: number, operatorDto: OperatorDTO) {
      try {
        let returnResponse = {};
        const date = new Date();
        let idExists = await this.companyRepository.find({
          relations: ['countries'],
          where: {
            COMPANY_ID: id,
            ROW_STATUS: In(['active', 'ACTIVE']),
          } as unknown,
        });
        // return idExists;
     
        if (idExists.length == 0) {
          return (returnResponse = {
            status: 'FAILURE',
            httpStatus: HttpStatus.NOT_FOUND,
            message: 'Company ID Does Not Exist/Already Deleted',
            data: [],
          });
        } else {
          if (idExists[0]['countries'].length > 0) {
            let idChildExists = await this.companyRepository.find({
              relations: ['countries'],
              where: {
                COMPANY_ID: id,
                ROW_STATUS: In(['active', 'ACTIVE']),
                countries: {
                  ROW_STATUS: In(['active', 'ACTIVE']),
                },
              } as unknown,
            });
            if (idChildExists.length > 0) {
              return (returnResponse = {
                status: 'FAILURE',
                httpStatus: HttpStatus.FOUND,
                message: 'Mapping Exists In Country Management',
                data: [],
              });
            } else {
            }
          }
          let response = await this.companyRepository.update(
            id as unknown,
            {
              ROW_STATUS: 'deleted',
              MODIFIED_BY: operatorDto.MODIFIED_BY,
              MODIFIED_DATETIME: date,
            } as unknown,
          );
          if (response.affected == 1) {
            return (returnResponse = {
              status: 'SUCCESS',
              httpStatus: HttpStatus.OK,
              message: 'Deleted Successfully',
              data: [],
            });
          } else {
            return (returnResponse = {
              status: 'FAILURE',
              httpStatus: HttpStatus.BAD_REQUEST,
              message: 'Company Not Deleted',
              data: [],
            });
          }
        }
      } catch (error) {
        console.log(error);
        return {
          status: 'FAILURE',
          message: 'Exception Occured',
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          data: [],
        };
      }
    }

    async updateCompany(id: number, updateCompanyDto: UpdateCompanyDto) {
      try {
        let returnResponse = {};
        const date = new Date();
  
        let companyIDExists = await this.companyRepository.find({
          where: {
            COMPANY_ID: id,
            ROW_STATUS: 'active',
          } as unknown,
        });
  
        if (companyIDExists.length > 0) {
          let companyNameExists = await this.companyRepository.find({
            where: {
              COMPANY_ID: Not(id),
              COMPANY_NAME: Raw((alias) => `LOWER(${alias}) = LOWER(:value)`, {
                value: updateCompanyDto.COMPANY_NAME,
              }),
              ROW_STATUS: 'active',
            } as unknown,
          });
  
          if (companyNameExists.length > 0) {
            returnResponse = {
              status: 'FAILURE',
              httpStatus: HttpStatus.FOUND,
              message: 'Company Name Already Exists',
              data: [],
            };
          } else {
            const check = await shallowEqual(
              updateCompanyDto,
              companyIDExists[0],
            );
  
            if (check === false) {
              return {
                status: 'FAILURE',
                httpStatus: HttpStatus.NOT_FOUND,
                message: 'No Changes Made In Data',
                data: [],
              };
            }
            let companyCodeExists = await this.companyRepository.find({
              where: {
                COMPANY_ID: Not(id),
                COMPANY_CODE: updateCompanyDto.COMPANY_CODE,
                ROW_STATUS: 'active',
              } as unknown,
            });
  
            if (companyCodeExists.length > 0) {
              returnResponse = {
                status: 'FAILURE',
                httpStatus: HttpStatus.FOUND,
                message: 'Company Code Already Exists',
                data: [],
              };
            } else {
              let companyAbbreviationExists = await this.companyRepository.find({
                where: {
                  COMPANY_ID: Not(id),
                  ABBREVIATION: updateCompanyDto.ABBREVIATION,
                  ROW_STATUS: 'active',
                } as unknown,
              });
  
              if (companyAbbreviationExists.length > 0) {
                returnResponse = {
                  status: 'FAILURE',
                  httpStatus: HttpStatus.FOUND,
                  message: 'Company Abbreviation Already Exists',
                  data: [],
                };
              } else {
                updateCompanyDto.MODIFIED_DATETIME = date;
  
                let response = await this.companyRepository.update(
                  id as unknown,
                  updateCompanyDto as unknown,
                );
  
                if (response.affected == 1) {
                  returnResponse = {
                    status: 'SUCCESS',
                    httpStatus: HttpStatus.OK,
                    message: 'Updated Successfully',
                    data: [],
                  };
                } else {
                  returnResponse = {
                    status: 'FAILURE',
                    httpStatus: HttpStatus.BAD_REQUEST,
                    message: 'Company Not Updated',
                    data: [],
                  };
                }
              }
            }
          }
        } else {
          returnResponse = {
            status: 'FAILURE',
            httpStatus: HttpStatus.NOT_FOUND,
            message: 'Company Id Does Not Exist',
            data: [],
          };
        }
        return returnResponse;
      } catch (error) {
        console.log(error);
        return {
          status: 'FAILURE',
          message: 'Exception Occured',
          httpStatus: HttpStatus.INTERNAL_SERVER_ERROR,
          data: [],
        };
      }
    }
}
