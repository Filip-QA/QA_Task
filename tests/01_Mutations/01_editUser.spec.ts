import { test, expect } from '@playwright/test';

// Define the user data
const userData = {
  id: 3,
  name: 'Postman Junior',
  username: 'postmanjunior',
  email: 'postmanjunior@email.com',
  website: 'https://postmanjunior.com',
  address: {
    street: 'Seventh Street',
    city: 'Old City',
    zipcode: '654321'
  }
};

// Define the mutation for updating a user
  const url = 'https://graphqlzero.almansi.me/api';
  const mutation = ({ id, name, username, email, website, address }: { id: number, name: string, username: string, email: string, website: string, address: { street: string, city: string, zipcode: string } }) => `
    mutation {
      updateUser(
        id: "${id}",
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
  

test.describe('Edit User', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    // Check that the status code is 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if the updated user data is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    const jsonData = await response.json();

    // Ensure that the updated user data is returned and is not empty
    expect(jsonData.data.updateUser).toBeInstanceOf(Object);
    expect(jsonData.data.updateUser).not.toBeNull();
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });

  test('Check if the correct user is updated', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    const jsonData = await response.json();

    // Ensure that the returned user has the correct id
    expect(jsonData.data.updateUser.id).toBe(String(userData.id));
  });

  test('Check if the user data matches the updated input', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    const jsonData = await response.json();
    const user = jsonData.data.updateUser;
    
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

    // Check if the returned user data matches the input values
    expect(user.name).toBe(userData.name);
    expect(user.username).toBe(userData.username);
    expect(user.email).toBe(userData.email);
    expect(user.website).toBe(userData.website);
    expect(user.address.street).toBe(userData.address.street);
    expect(user.address.city).toBe(userData.address.city);
    expect(user.address.zipcode).toBe(userData.address.zipcode);
  });

  test('Check if the user has required fields after update', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    const jsonData = await response.json();
    const user = jsonData.data.updateUser;

    // Check that the returned user contains the required fields
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