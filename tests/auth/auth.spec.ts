import { AuthClient } from '../../src/clients/auth.client';
import { environment } from '../../src/config/environment';

describe('Authentication API', () => {
  const authClient = new AuthClient();

  test('smoke - returns token with valid credentials', async () => {
    const response = await authClient.authenticate(
      environment.username,
      environment.password
    );

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        token: expect.any(String)
      })
    );

    expect(response.body.token.length).toBeGreaterThan(0);
  });

  test('returns Bad credentials for invalid credentials', async () => {
    const response = await authClient.authenticate(
      'invalid-user',
      'invalid-password'
    );

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        reason: 'Bad credentials'
      })
    );
  });
});
