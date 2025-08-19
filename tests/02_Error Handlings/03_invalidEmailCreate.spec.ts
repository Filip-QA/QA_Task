import { test, expect } from '@playwright/test';

const url = 'https://graphqlzero.almansi.me/api';

test.describe('Create User with invalid email type', () => {
  test('Should return errors when email is a number', async ({ request }) => {
    const mutation = `
      mutation CreateUser($name: String!, $username: String!, $email: String!) {
        createUser(input: { 
        name: $name, 
        username: $username, 
        email: $email }) {
          id
          username
        }
      }
    `;

    // Intentionally use wrong type: number instead of string
    const variables = {
      name: "Test User",
      username: "testuser", 
      email: 12345 // wrong type
    };

    const response = await request.post(url, {
      data: {
        query: mutation,
        variables: variables
      }
    });

    const json = await response.json();

    // The response will still be HTTP 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());

    // Instead, assert that validation failed
    expect(json).toHaveProperty('errors');
    expect(json.errors.length).toBeGreaterThan(0);
    expect(json.errors[0].message).toContain('string');

    console.log('Errors:', JSON.stringify(json.errors, null, 2));
  });
});