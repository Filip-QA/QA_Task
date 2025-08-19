import { test, expect } from '@playwright/test';

const url = 'https://graphqlzero.almansi.me/api';

test.describe('Create User without required fields', () => {
  test('Should return errors when name is missing', async ({ request }) => {
    const mutation = `
      mutation {
        createUser(input: { 
        username: "testuser", 
        email: "test@example.com" }) {
          id
          name
        }
      }
    `;

    const response = await request.post(url, { data: { query: mutation } });

    // Check that the status code is 400
    expect(response.status()).toBe(400);
    console.log('Status Code:', response.status());

    const json = await response.json();

    expect(json).toHaveProperty('errors');
    console.log('Errors (missing name):', JSON.stringify(json.errors, null, 2));
  });

  test('Should return errors when username is missing', async ({ request }) => {
    const mutation = `
      mutation {
        createUser(input: {  
        name: "Test User", 
        email: "test@example.com" 
        }) 
        {
          id
          name
        }
      }
    `;

    const response = await request.post(url, { data: { query: mutation } });

    // Check that the status code is 400
    expect(response.status()).toBe(400);
    console.log('Status Code:', response.status());

    const json = await response.json();

    expect(json).toHaveProperty('errors');
    console.log('Errors:', JSON.stringify(json.errors, null, 2));
  });

  test('Should return errors when email is missing', async ({ request }) => {
    const mutation = `
      mutation {
        createUser(input: {  
        name: "Test User", 
        username: "testuser",  
        }) 
        {
          id
          name
        }
      }
    `;

    const response = await request.post(url, { data: { query: mutation } });

    // Check that the status code is 400
    expect(response.status()).toBe(400);
    console.log('Status Code:', response.status());

    const json = await response.json();

    expect(json).toHaveProperty('errors');
    console.log('Errors:', JSON.stringify(json.errors, null, 2));
  });
});
