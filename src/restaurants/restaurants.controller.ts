import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './DTO/create-restaurant.dto';
import { UpdateRestaurantDto } from './DTO/update-restaurant.dto';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Post()
  async createRestaurant(
    @Body()
    restaurant: // DTO (Data Transfer Object) -> defines how the data will be sent over the newtwork->  by using a class with Typescript
    CreateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant);
  }

  @Get(':id')
  async getRestaurantById(
    @Param('id')
    id: string,
  ): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }
  @Put(':id')
  async updateRestaurant(
    @Param('id')
    id: string,
    @Body()
    restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    await this.restaurantsService.findById(id);
    //a função findById() é chamada para verificar se o restaurante existe no database e retornar o 404 se nao houver
    return this.restaurantsService.updateById(id, restaurant);
  }
  @Delete(':id')
  async deleteRestaurant(
    @Param('id')
    id: string,
  ): Promise<{ deleted: boolean }> {
    const restaurant = this.restaurantsService.deleteById(id);

    if (restaurant) {
      return { deleted: true };
    }
  }
}
