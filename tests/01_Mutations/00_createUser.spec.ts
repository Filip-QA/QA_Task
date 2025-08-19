import { test, expect } from '@playwright/test';

// Define the user data
const userData = {
  name: 'Mister Postman',
  username: 'misterpostman',
  email: 'misterpostman@email.com',
  website: 'https://misterpostman.com',
  address: {
    street: 'Fifth Street',
    city: 'New City',
    zipcode: '123456'
  }
};

// Define the mutation for creating a user
  const url = 'https://graphqlzero.almansi.me/api';
  const mutation = ({ name, username, email, website, address }: { name: string, username: string, email: string, website: string, address: { street: string, city: string, zipcode: string } }) => `
    mutation {
      createUser(
        input: {
          name: "${name}",
          username: "${username}",
          email: "${email}",
          website: "${website}",
          address: {
            street: "${address.street}",
            city: "${address.city}",
            zipcode: "${address.zipcode}"
          }
        }
      ) {
        id
        name
        username
        email
        website
        address {
          street
          city
          zipcode
        }
      }
    }
  `;
  
test.describe('Create User', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    // Check that the status code is 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if the user data is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    const jsonData = await response.json();

    // Ensure that the returned user data is not empty
    expect(jsonData.data.createUser).toBeInstanceOf(Object);
    expect(jsonData.data.createUser).not.toBeNull();
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });

  test('Check if the user data matches the input', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    const jsonData = await response.json();
    const user = jsonData.data.createUser;

    // Check if the returned user matches the input data
    expect(user.name).toBe(userData.name);
    console.log('Expected name:', userData.name);
    console.log('Returned name:', user.name);

    expect(user.username).toBe(userData.username);
    console.log('Expected username:', userData.username);
    console.log('Returned username:', user.username);

    expect(user.email).toBe(userData.email);
    console.log('Expected email:', userData.email);
    console.log('Returned email:', user.email);

    expect(user.website).toBe(userData.website);
    console.log('Expected website:', userData.website);
    console.log('Returned website:', user.website);

    expect(user.address.street).toBe(userData.address.street);
    console.log('Expected street address:', userData.address.street);
    console.log('Returned street address:', user.address.street);

    expect(user.address.city).toBe(userData.address.city);
    console.log('Expected city:', userData.address.city);
    console.log('Returned city:', user.address.city);

    expect(user.address.zipcode).toBe(userData.address.zipcode);
    console.log('Expected city:', userData.address.zipcode);
    console.log('Returned city:', user.address.zipcode);
  });

  test('Check if the user has required fields', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    const jsonData = await response.json();
    const user = jsonData.data.createUser;

    // Check if the returned user contains the required fields
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('website');
    expect(user).toHaveProperty('address');
    expect(user.address).toHaveProperty('street');
    expect(user.address).toHaveProperty('city');
    expect(user.address).toHaveProperty('zipcode');
  });
});