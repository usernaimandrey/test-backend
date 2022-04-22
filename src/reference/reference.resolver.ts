import { Query, Resolver } from '@nestjs/graphql'
import { RetailService } from '../retail_api/retail.service'
import { DeliveryType, OrderStatus, ProductStatus } from '../graphql'

@Resolver('Reference')
export class ReferenceResolver {
  constructor(private retailService: RetailService) {}

  @Query()
  async deliveryTypes(): Promise<DeliveryType[]> {
    return await this.retailService.deliveryTypes()
  }

  @Query()
  async productStatuses(): Promise<ProductStatus[]> {
    return await this.retailService.productStatuses()
  }

  @Query()
  async orderStatuses(): Promise<OrderStatus[]> {
    return await this.retailService.orderStatuses()
  }
}
