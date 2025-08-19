import { test, expect } from '@playwright/test';

  // Define the query for the users
  const url = 'https://graphqlzero.almansi.me/api';
  const query = `
    {
      users {
        data {
          id
          name
          username
          email
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
    }
  `;
  
test.describe('Get the data for all users', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    // Check that the status code is 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if users data is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    // Check that the users data is returned and is not empty
    const jsonData = await response.json();
    expect(jsonData.data.users.data).toBeInstanceOf(Array);
    expect(jsonData.data.users.data.length).toBeGreaterThan(0);
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });

  test('Check if each user has required fields', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    const jsonData = await response.json();
    const users = jsonData.data.users.data;

    users.forEach((user: any) => {
      // Check basic user data
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('phone');
      
      // Check address data
      expect(user).toHaveProperty('address');
      expect(user.address).toHaveProperty('street');
      expect(user.address).toHaveProperty('suite');
      expect(user.address).toHaveProperty('city');
      expect(user.address).toHaveProperty('zipcode');
      
      // Check website data
      expect(user).toHaveProperty('website');
      
      // Check company data
      expect(user.company).toHaveProperty('name');
      expect(user.company).toHaveProperty('catchPhrase');
      expect(user.company).toHaveProperty('bs');
      console.log('Response Body:', JSON.stringify(jsonData, null, 2));
    });
  });
});