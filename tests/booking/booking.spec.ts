import Ajv from 'ajv';
import { AuthClient } from '../../src/clients/auth.client';
import { BookingClient } from '../../src/clients/booking.client';
import { buildBooking } from '../../src/data/booking.factory';
import { bookingSchema } from '../../src/schemas/booking.schema';

describe('Booking API', () => {
  const bookingClient = new BookingClient();
  const authClient = new AuthClient();

  test('smoke - lists available bookings', async () => {
    const response = await bookingClient.list();

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('creates a booking and validates response contract', async () => {
    const payload = buildBooking();
    const response = await bookingClient.create(payload);

    expect(response.status).toBe(200);
    expect(response.body.bookingid).toEqual(expect.any(Number));
    expect(response.body.booking).toMatchObject(payload);

    const ajv = new Ajv();
    const validate = ajv.compile(bookingSchema);

    expect(validate(response.body.booking)).toBe(true);
  });

  test('retrieves a booking by id', async () => {
    const payload = buildBooking({ firstname: 'API' });
    const created = await bookingClient.createAndReturn(payload);

    let response;

    for (let attempt = 1; attempt <= 3; attempt++) {
      response = await bookingClient.getById(created.bookingid);

      if (response.status === 200) {
        break;
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    expect(response?.status).toBe(200);
    expect(response?.body).toMatchObject(payload);
  });

  test('updates an existing booking using authentication', async () => {
    const created = await bookingClient.createAndReturn(buildBooking());
    const token = await authClient.createToken();
    const updatedPayload = buildBooking({
      firstname: 'Updated',
      totalprice: 900
    });

    const response = await bookingClient.update(
      created.bookingid,
      updatedPayload,
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.firstname).toBe('Updated');
    expect(response.body.totalprice).toBe(900);
  });

  test('partially updates an existing booking', async () => {
    const created = await bookingClient.createAndReturn(buildBooking());
    const token = await authClient.createToken();

    const response = await bookingClient.partialUpdate(
      created.bookingid,
      { lastname: 'Automation' },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.lastname).toBe('Automation');
  });

  test('deletes a booking and confirms it is no longer available', async () => {
    const created = await bookingClient.createAndReturn(buildBooking());
    const token = await authClient.createToken();

    const deleteResponse = await bookingClient.delete(created.bookingid, token);
    expect([201, 200]).toContain(deleteResponse.status);

    const getResponse = await bookingClient.getById(created.bookingid);
    expect(getResponse.status).toBe(404);
  });

  test('returns 404 for a booking that does not exist', async () => {
    const response = await bookingClient.getById(999999999);

    expect(response.status).toBe(404);
  });

  test('rejects update without authentication', async () => {
    const created = await bookingClient.createAndReturn(buildBooking());

    const response = await bookingClient.update(
      created.bookingid,
      buildBooking({ firstname: 'Unauthorized' }),
      'invalid-token'
    );

    expect(response.status).toBe(403);
  });
});
