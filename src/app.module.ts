/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'; // Import ApolloDriver and ApolloDriverConfig
import { CompanyModule } from './company/company.module';
import { Company } from './entities/company.entity';
import { Country } from './entities/country.entity';
import { CountryModule } from './country/country.module';
import { State } from './entities/state.entity';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>(
      { 
        autoSchemaFile: 'schema.gql',
        driver: ApolloDriver, 
        installSubscriptionHandlers: true,
      }
    ),

    CacheModule.register({isGlobal: true}),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PG_NCRM_DB_IP,
      port: parseInt(process.env.PG_NCRM_DB_PORT),
      username: process.env.PG_NCRM_DB_USER_ID,
      password: process.env.PG_NCRM_DB_PASSWORD,
      database: process.env.PG_NCRM_DB_DB_NAME,
      synchronize: false,
      autoLoadEntities: true,
    }),

    TypeOrmModule.forFeature([
      Company,
      Country,
      State
    ]),

    CompanyModule,
    CountryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
