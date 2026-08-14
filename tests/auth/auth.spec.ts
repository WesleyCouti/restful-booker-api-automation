import request from 'supertest';
import { environment } from '../../src/config/environment';

describe('Authentication API', () => {
  test('smoke - returns token with valid credentials', async () => {
    const response = await request(environment.baseUrl)
      .post('/auth')
      .send({
        username: environment.username,
        password: environment.password
      });

    expect(response.status).toBe(200);
    expect(typeof response.body.token).toBe('string');
    expect(response.body.token.length).toBeGreaterThan(0);
  });

  test('returns Bad credentials for invalid credentials', async () => {
    const response = await request(environment.baseUrl)
      .post('/auth')
      .send({
        username: 'invalid-user',
        password: 'invalid-password'
      });

    expect(response.status).toBe(200);
    expect(response.body.reason).toBe('Bad credentials');
  });
});
