const baseUrl =
  process.env.BASE_URL ??
  'https://restful-booker.herokuapp.com';

const username =
  process.env.API_USERNAME ??
  'admin';

const password =
  process.env.API_PASSWORD ??
  'password123';

if (!baseUrl.startsWith('http')) {
  throw new Error(
    'Invalid BASE_URL configuration. Expected an HTTP or HTTPS URL.'
  );
}

export const environment = {
  baseUrl,
  username,
  password
} as const;
