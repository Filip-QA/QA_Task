import { test, expect } from '@playwright/test';

// Define the query for the albums
const url = 'https://graphqlzero.almansi.me/api';
const query = `
    {
      albums {
        data {
          id
          title
          user {
            id
            name
            username
            email
          }
        }
      }
    }
  `;

test.describe('Get the data for all albums', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    // Check that the status code is 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if albums data is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    const jsonData = await response.json();

    // Check that the albums data is returned and is not empty
    expect(jsonData.data.albums.data).toBeInstanceOf(Array);
    expect(jsonData.data.albums.data.length).toBeGreaterThan(0);
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });

  test('Check if albums contain id, title, and user data', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    const jsonData = await response.json();
    const albums = jsonData.data.albums.data;

    // Check that each album contains the required fields
    albums.forEach((album: any) => {
      expect(album).toHaveProperty('id');
      expect(album).toHaveProperty('title');
      expect(album).toHaveProperty('user');

      // Check that the user object within each album contains required fields
      const user = album.user;
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('username');
      expect(user).toHaveProperty('email');
      console.log('Response Body:', JSON.stringify(jsonData, null, 2));
    });
  });
});