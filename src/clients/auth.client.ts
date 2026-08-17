import request, { Response } from 'supertest';
import { environment } from '../config/environment';

interface AuthResponse {
  token?: string;
  reason?: string;
}

export class AuthClient {
  private readonly baseUrl = environment.baseUrl;

  async authenticate(
    username: string,
    password: string
  ): Promise<Response> {
    return request(this.baseUrl)
      .post('/auth')
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/json')
      .send({
        username,
        password
      });
  }

  async createToken(): Promise<string> {
    const response = await this.authenticate(
      environment.username,
      environment.password
    );

    if (response.status !== 200) {
      throw new Error(
        `Authentication failed. Expected status 200, received ${response.status}.`
      );
    }

    const body = response.body as AuthResponse;

    if (!body.token) {
      throw new Error(
        'Authentication succeeded but no token was returned by the API.'
      );
    }

    return body.token;
  }
}
