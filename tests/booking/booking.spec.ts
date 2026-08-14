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
    expect(response.body.length).toBeGreaterThan(0);
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

  test('retrieves an existing booking by id', async () => {
    const bookingsResponse = await bookingClient.list();

    expect(bookingsResponse.status).toBe(200);
    expect(Array.isArray(bookingsResponse.body)).toBe(true);
    expect(bookingsResponse.body.length).toBeGreaterThan(0);

    const bookingId = bookingsResponse.body[0].bookingid;

    expect(bookingId).toEqual(expect.any(Number));

    const response = await bookingClient.getById(bookingId);

    expect(response.status).toBe(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        firstname: expect.any(String),
        lastname: expect.any(String),
        totalprice: expect.any(Number),
        depositpaid: expect.any(Boolean),
        bookingdates: expect.objectContaining({
          checkin: expect.any(String),
          checkout: expect.any(String)
        })
      })
    );
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
    expect(response.body).toMatchObject(updatedPayload);
  });

  test('partially updates an existing booking', async () => {
    const created = await bookingClient.createAndReturn(buildBooking());
    const token = await authClient.createToken();

    const partialPayload = {
      lastname: 'Automation'
    };

    const response = await bookingClient.partialUpdate(
      created.bookingid,
      partialPayload,
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.lastname).toBe(partialPayload.lastname);
  });

  test('deletes a booking and confirms it is no longer available', async () => {
    const created = await bookingClient.createAndReturn(buildBooking());
    const token = await authClient.createToken();

    const deleteResponse = await bookingClient.delete(
      created.bookingid,
      token
    );

    expect([200, 201]).toContain(deleteResponse.status);

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
      buildBooking({
        firstname: 'Unauthorized'
      }),
      'invalid-token'
    );

    expect(response.status).toBe(403);
  });
});