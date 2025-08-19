import { test, expect } from '@playwright/test';

// Define the query for the album with id=50
const url = 'https://graphqlzero.almansi.me/api';
const query = `
    {
      album(id: 50) {
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
  `;

test.describe('Get the data for a single album', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    // Check that the status code is 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if album data is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    const jsonData = await response.json();

    // Check that the album data is returned and is not empty
    expect(jsonData.data.album).toBeInstanceOf(Object);
    expect(jsonData.data.album).not.toBeNull();
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });

  test('Check if the correct album is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    const jsonData = await response.json();

    // Check if the album id is correct
    expect(jsonData.data.album.id).toBe('50');
    const { id, title } = jsonData.data.album;
    console.log(`Album ID: ${id}, Title: ${title}`);
  });

  test('Check if album has required data', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: query }
    });

    const jsonData = await response.json();
    const album = jsonData.data.album;

    // Check album data
    expect(album).toHaveProperty('id');
    expect(album).toHaveProperty('title');
    expect(album).toHaveProperty('user');

    // Check that user inside the album contains required fields
    const user = album.user;
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('username');
    expect(user).toHaveProperty('email');
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });
});