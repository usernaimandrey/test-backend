import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { RetailService } from './retail_api/retail.service'
import { GraphQLModule } from '@nestjs/graphql'
import { OrdersModule } from './orders/orders.module'
import { ReferenceModule } from './reference/reference.module'
const { join } = require('path')

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    OrdersModule,
    ReferenceModule,
  ],
  controllers: [AppController],
  providers: [AppService, RetailService],
})
export class AppModule {}
