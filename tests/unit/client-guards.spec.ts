import { AuthClient } from '../../src/clients/auth.client';
import { BookingClient } from '../../src/clients/booking.client';
import { buildBooking } from '../../src/data/booking.factory';

describe('API Client Guard Clauses', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AuthClient', () => {
    test('throws an error when authentication returns an unexpected status', async () => {
      const authClient = new AuthClient();

      jest.spyOn(authClient, 'authenticate').mockResolvedValue({
        status: 500,
        body: {}
      } as any);

      await expect(authClient.createToken()).rejects.toThrow(
        'Authentication failed. Expected status 200, received 500.'
      );
    });

    test('throws an error when authentication does not return a token', async () => {
      const authClient = new AuthClient();

      jest.spyOn(authClient, 'authenticate').mockResolvedValue({
        status: 200,
        body: {}
      } as any);

      await expect(authClient.createToken()).rejects.toThrow(
        'Authentication succeeded but no token was returned by the API.'
      );
    });
  });

  describe('BookingClient', () => {
    test('throws an error when booking creation returns an unexpected status', async () => {
      const bookingClient = new BookingClient();
      const payload = buildBooking();

      jest.spyOn(bookingClient, 'create').mockResolvedValue({
        status: 500,
        body: {}
      } as any);

      await expect(
        bookingClient.createAndReturn(payload)
      ).rejects.toThrow(
        'Unable to create booking. Expected status 200, received 500.'
      );
    });
  });
});