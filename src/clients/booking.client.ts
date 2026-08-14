import request from 'supertest';
import { environment } from '../config/environment';
import type { Booking, CreatedBooking } from '../types/booking';

export class BookingClient {
  async list() {
    return request(environment.baseUrl).get('/booking');
  }

  async getById(id: number) {
    return request(environment.baseUrl).get(`/booking/${id}`);
  }

  async create(payload: Booking) {
    return request(environment.baseUrl)
      .post('/booking')
      .set('Accept', 'application/json')
      .send(payload);
  }

  async update(id: number, payload: Booking, token: string) {
    return request(environment.baseUrl)
      .put(`/booking/${id}`)
      .set('Accept', 'application/json')
      .set('Cookie', `token=${token}`)
      .send(payload);
  }

  async partialUpdate(
    id: number,
    payload: Partial<Booking>,
    token: string
  ) {
    return request(environment.baseUrl)
      .patch(`/booking/${id}`)
      .set('Accept', 'application/json')
      .set('Cookie', `token=${token}`)
      .send(payload);
  }

  async delete(id: number, token: string) {
    return request(environment.baseUrl)
      .delete(`/booking/${id}`)
      .set('Cookie', `token=${token}`);
  }

  async createAndReturn(payload: Booking): Promise<CreatedBooking> {
    const response = await this.create(payload);

    if (response.status !== 200) {
      throw new Error(`Booking creation failed with status ${response.status}.`);
    }

    return response.body as CreatedBooking;
  }
}
