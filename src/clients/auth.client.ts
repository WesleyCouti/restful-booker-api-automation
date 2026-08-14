import request from 'supertest';
import { environment } from '../config/environment';

export class AuthClient {
  async createToken(): Promise<string> {
    const response = await request(environment.baseUrl)
      .post('/auth')
      .send({
        username: environment.username,
        password: environment.password
      })
      .expect(200);

    if (!response.body.token) {
      throw new Error('Authentication token was not returned by the API.');
    }

    return response.body.token as string;
  }
}
