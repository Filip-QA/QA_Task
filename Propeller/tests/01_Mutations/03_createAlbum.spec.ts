import { test, expect } from '@playwright/test';

// Define the album data
const albumData = {
  title: "Oldschool Rock Music Collection",
  userId: 10
};

// Define the mutation for creating an album
  const url = 'https://graphqlzero.almansi.me/api';
  const mutation = ({ title, userId }: { title: string, userId: number }) => `
    mutation {
      createAlbum(
        input: {
          title: "${title}",
          userId: ${userId}
        }
      ) {
        id
        title
        user {
          id
          name
          username
          email
          phone
          website
        }
      }
    }
  `;

test.describe('Create Album', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    // Check that the status code is 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if album data is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    const jsonData = await response.json();

    // Ensure that the album data is returned and it is not empty
    expect(jsonData.data.createAlbum).toBeInstanceOf(Object);
    expect(jsonData.data.createAlbum).not.toBeNull();
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });

  test('Check if album contains correct data', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    const jsonData = await response.json();
    const album = jsonData.data.createAlbum;

    // Check if the returned album has the correct title and user information
    expect(album.title).toBe(albumData.title);
    console.log('Expected album title:', albumData.title);
    console.log('Returned album title:', album.title);

    expect(album.user.id).toBe(String(albumData.userId));
    console.log('Expected user id:', albumData.userId);
    console.log('Returned user id:', album.user.id);
  });

  test('Check if user data is returned with album', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    const jsonData = await response.json();
    const album = jsonData.data.createAlbum;

    // Ensure that the album contains the user data and its properties
    expect(album.user).toHaveProperty('id');
    expect(album.user).toHaveProperty('name');
    expect(album.user).toHaveProperty('username');
    expect(album.user).toHaveProperty('email');
    expect(album.user).toHaveProperty('phone');
    expect(album.user).toHaveProperty('website');
  });
});
