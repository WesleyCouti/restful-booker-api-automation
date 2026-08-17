import request, { Response } from 'supertest';
import { environment } from '../config/environment';
import type { Booking, CreatedBooking } from '../types/booking';

export class BookingClient {
  private readonly baseUrl = environment.baseUrl;

  async list(): Promise<Response> {
    return request(this.baseUrl)
      .get('/booking')
      .set('Accept', 'application/json');
  }

  async getById(id: number): Promise<Response> {
    return request(this.baseUrl)
      .get(`/booking/${id}`)
      .set('Accept', 'application/json');
  }

  async create(payload: Booking): Promise<Response> {
    return request(this.baseUrl)
      .post('/booking')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send(payload);
  }

  async update(
    id: number,
    payload: Booking,
    token: string
  ): Promise<Response> {
    return request(this.baseUrl)
      .put(`/booking/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Cookie', `token=${token}`)
      .send(payload);
  }

  async partialUpdate(
    id: number,
    payload: Partial<Booking>,
    token: string
  ): Promise<Response> {
    return request(this.baseUrl)
      .patch(`/booking/${id}`)
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .set('Cookie', `token=${token}`)
      .send(payload);
  }

  async delete(id: number, token: string): Promise<Response> {
    return request(this.baseUrl)
      .delete(`/booking/${id}`)
      .set('Accept', 'application/json')
      .set('Cookie', `token=${token}`);
  }

  async createAndReturn(payload: Booking): Promise<CreatedBooking> {
    const response = await this.create(payload);

    if (response.status !== 200) {
      throw new Error(
        `Unable to create booking. Expected status 200, received ${response.status}.`
      );
    }

    return response.body as CreatedBooking;
  }
}
