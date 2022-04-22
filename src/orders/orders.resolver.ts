import { Args, Query, Resolver } from '@nestjs/graphql'
import { RetailService } from '../retail_api/retail.service'
import { OrdersResponse } from '../graphql'

@Resolver('Orders')
export class OrdersResolver {
  constructor(private retailService: RetailService) {}

  @Query()
  async order(@Args('number') id: string): Promise<any> {
    const order = await this.retailService.findOrder(id)
    console.log(order)
    return order
  }

  @Query()
  async getOrders(@Args('page') page: number): Promise<OrdersResponse> {
    const [orders, pagination] = await this.retailService.orders({ page: page })
    return { orders: orders, pagination: pagination }
  }
}