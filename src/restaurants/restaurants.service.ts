import { Injectable, NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  //Get all restaurants => GET  /restaurants

  async findAll(query: Query): Promise<Restaurant[]> {
    const resPerPage = 10; // results per page
    const currentPage = Number(query.page) || 1; // Page
    const skip = resPerPage * (currentPage - 1); // Skip

    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i', //case insensitive
          },
        }
      : {};
    const restaurants = await this.restaurantModel
      .find({ ...keyword });
      .limit(resPerPage);
      .skip(skip);

    return restaurants;
    // agora todos os restaurants foram armazenados no database
  }

  //Create new restaurant => POST /restaurants
  async create(restaurant: Restaurant): Promise<Restaurant> {
    const res = await this.restaurantModel.create(restaurant);
    return res;
  }
  //Get restaurant by id => GET /restaurants/:id
  async findById(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantModel.findById(id);

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }
    return restaurant;
  }
  //Update restaurant by id => PUT /restaurants/:id
  async updateById(id: string, restaurant: Restaurant): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
      new: true,
      runValidators: true,
    });
  }
  //Delete restaurant by id => DELETE /restaurants/:id
  async deleteById(id: string): Promise<Restaurant> {
    return await this.restaurantModel.findByIdAndDelete(id);
  }
}
