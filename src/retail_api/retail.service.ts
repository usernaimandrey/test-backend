import { Injectable } from '@nestjs/common'
import { CrmType, Order, OrdersFilter, RetailPagination } from './types'
import axios, { AxiosInstance } from 'axios'
// import { ConcurrencyManager } from 'axios-concurrency'
import { serialize } from '../tools'
import { plainToClass } from 'class-transformer'

@Injectable()
export class RetailService {
  private readonly axios: AxiosInstance

  constructor() {
    this.axios = axios.create({
      baseURL: `${process.env.RETAIL_URL}/api/v5`,
      timeout: 10000,
      headers: {
        'x-api-key': process.env.API_KEY,
      },
    })

    this.axios.interceptors.request.use((config) => {
      // console.log(config.url)
      return config
    })
    this.axios.interceptors.response.use(
      (r) => {
        // console.log("Result:", r.data)
        return r
      },
      (r) => {
        console.log("Error:", r.response.data)
        return r
      },
    )
  }

  async orders(filter?: OrdersFilter): Promise<[Order[], RetailPagination]> {
    const params = serialize(filter, '')
    const resp = await this.axios.get('/orders?' + params)
    
    if (!resp.data) throw new Error('RETAIL CRM ERROR')

    const orders = plainToClass(Order, resp.data.orders as Array<any>)
    const pagination: RetailPagination = resp.data.pagination

    return [orders, pagination]
  }

  async findOrder(id: string): Promise<Order | null>  { 
    const [orders,] = await this.orders()
    
    const order = orders.find((el) => String(el.id) === id)
    return order
  }

  async orderStatuses():  Promise<CrmType[]>{
    const [orders] = await this.orders()
    const data = orders.map((order) =>  {
      const code: string = order.number
      const name: string = order.status
      return plainToClass(CrmType, { code, name })
    })
    return data
  }

  async productStatuses():  Promise<CrmType[]> {
    const [orders] = await this.orders()
    const statuses = orders.reduce((acc, el) => {
      const products = el.items.map((product) => {
        const code = String(product.id)
        const name: string = product.status
        return plainToClass(CrmType, { code, name })
      })
      return [...acc, ...products]
    }, []) 
    return statuses
  }

  async deliveryTypes(): Promise<CrmType[]> { 
    const [orders] = await this.orders()
    const types = orders.map((order) => {
      const code = String(order.id)
      const name: string = order.delivery.code
      return plainToClass(CrmType, { code, name })
    })
    return types
  }
}
