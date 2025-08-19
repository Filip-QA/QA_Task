import { test, expect } from '@playwright/test';

// Define the query for the user with id=5
const url = 'https://graphqlzero.almansi.me/api';
const query = `
    {
      user(id: 5) {
        id
        name
        email
        username
        address {
          street
          suite
          city
          zipcode
        }
        phone
        website
        company {
          name
          catchPhrase
          bs
        }
      }
    }
  `;

test.describe('Get the data for a single user', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    // Check that the status code is 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if user data is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    const jsonData = await response.json();

    // Check that the user data is returned and is not empty
    expect(jsonData.data.user).toBeInstanceOf(Object);
    expect(jsonData.data.user).not.toBeNull();
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });

  test('Check if the correct user is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    const jsonData = await response.json();

    // Check if the returned user has the correct ID
    expect(jsonData.data.user.id).toBe('5');
    const { id, name, username } = jsonData.data.user;
    console.log(`User ID: ${id}, Name: ${name}, Username: ${username}`);
  });

  test('Check if user has the required fields', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    const jsonData = await response.json();
    const user = jsonData.data.user;

    // Check that the user has the required fields
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('phone');

    // Check user address data
    expect(user).toHaveProperty('address');
    expect(user.address).toHaveProperty('street');
    expect(user.address).toHaveProperty('suite');
    expect(user.address).toHaveProperty('city');
    expect(user.address).toHaveProperty('zipcode');

    // Check user website data
    expect(user).toHaveProperty('website');

    // Check user company data
    expect(user.company).toHaveProperty('name');
    expect(user.company).toHaveProperty('catchPhrase');
    expect(user.company).toHaveProperty('bs');
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });
});