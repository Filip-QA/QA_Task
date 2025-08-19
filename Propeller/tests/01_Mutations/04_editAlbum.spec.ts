import { test, expect } from '@playwright/test';

// Define the album data
const albumData = {
  albumId: 50,
  newTitle: 'Punk Music',
  userId: 10
};

// Define the mutation for updating an album
  const url = 'https://graphqlzero.almansi.me/api';
  const mutation = ({ albumId, newTitle, userId }: { albumId: number, newTitle: string, userId: number }) => `
    mutation {
      updateAlbum(
        id: ${albumId},
        input: {
          title: "${newTitle}",
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

test.describe('Edit Album', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    // Ensure the status code is 200 (successful request)
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if updated album data is returned', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    const jsonData = await response.json();

    // Ensure the updated album data is returned and is not null
    expect(jsonData.data.updateAlbum).toBeInstanceOf(Object);
    expect(jsonData.data.updateAlbum).not.toBeNull();
    console.log('Response Body:', JSON.stringify(jsonData, null, 2));
  });

  test('Check if album contains correct updated data', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    const jsonData = await response.json();
    const album = jsonData.data.updateAlbum;

    // Check if the album title has been updated correctly
    expect(album.title).toBe(albumData.newTitle);
    console.log('Expected album title:', albumData.newTitle);
    console.log('Returned album title:', album.title);
  });

  test('Check if user data is returned with updated album', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    const jsonData = await response.json();
    const album = jsonData.data.updateAlbum;

    // Ensure that the album contains the user data and its properties
    expect(album.user).toHaveProperty('id');
    expect(album.user).toHaveProperty('name');
    expect(album.user).toHaveProperty('username');
    expect(album.user).toHaveProperty('email');
    expect(album.user).toHaveProperty('phone');
    expect(album.user).toHaveProperty('website');
  });
});