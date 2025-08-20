import { test, expect } from '@playwright/test';

const url = 'https://graphqlzero.almansi.me/api';

test.describe('Create User with data', () => {
  test('Should return errors when ID is a string', async ({ request }) => {
    const mutation = `
      mutation {
        createUser(input: { 
        id: "invalid-string", 
        name: "Test User", 
        username: "testuser", 
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
    expect(json.errors[0].message).toContain('id');
    console.log('Errors (string id):', JSON.stringify(json.errors, null, 2));
  });

  test('Should return errors when ID is negative number', async ({ request }) => {
    const mutation = `
      mutation {
        createUser(input: { 
        id: -5, 
        name: "Test User", 
        username: "testuser", 
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
    expect(json.errors[0].message).toContain('id');
    console.log('Errors:', JSON.stringify(json.errors, null, 2));
  });

  test('Should return errors when name is a number', async ({ request }) => {
    const mutation = `
        mutation CreateUser($name: String!, $username: String!, $email: String!) {
          createUser(input: { 
          name: $name, 
          username: $username, 
          email: $email 
          }) 
          {
            id
            username
          }
        }
      `;

    // Intentionally use wrong type: number instead of string
    const variables = {
      name: 12345, // wrong type
      username: "testuser",
      email: "test@example.com"
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

  test('Should return errors when username is a number', async ({ request }) => {
    const mutation = `
          mutation CreateUser($name: String!, $username: String!, $email: String!) {
            createUser(input: { 
            name: $name, 
            username: $username, 
            email: $email 
            }) 
            {
              id
              username
            }
          }
        `;

    // Intentionally use wrong type: number instead of string
    const variables = {
      name: "Test User",
      username: 12345, // wrong type
      email: "test@example.com"
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

  test('Should return errors when email is a number', async ({ request }) => {
    const mutation = `
            mutation CreateUser($name: String!, $username: String!, $email: String!) {
              createUser(input: { 
              name: $name, 
              username: $username, 
              email: $email 
              }) 
              {
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

  test('Should return errors when phone is a number', async ({ request }) => {
    const mutation = `
      mutation CreateUser($name: String!, $username: String!, $email: String! $phone: String) {
        createUser(input: { 
        name: $name, 
        username: $username, 
        email: $email,
        phone: $phone 
        }) 
        {
          id
          username
        }
      }
    `;

    // Intentionally use wrong type: number instead of string
    const variables = {
      name: "Test User",
      username: "testuser",
      email: "testuser@example.com",
      phone: 12345 // wrong type
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