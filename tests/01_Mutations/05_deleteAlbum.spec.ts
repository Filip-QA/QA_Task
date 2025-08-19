import { test, expect } from '@playwright/test';

// Define the album data
const albumData = {
  albumId: 50
};

// Define the mutation for deleting an album
  const url = 'https://graphqlzero.almansi.me/api';
  const mutation = ({ albumId }: { albumId: number }) => `
    mutation {
      deleteAlbum(id: ${albumId}) 
    }
  `;

test.describe('Delete Album', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    // Check that the status code is 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if deletion mutation was successful', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(albumData) }
    });

    const jsonData = await response.json();

    // Ensure that the user is successfully deleted
    expect(jsonData.data.deleteAlbum).toBe(true);
    console.log('Album deletion successful:', jsonData.data.deleteAlbum);
  });

  test('Check that the album no longer exists', async ({ request }) => {
    // This test will fail because the API does not allow changing of data, as stated in the task description
    // If this were a real test environment where data could be changed, the test would be:

    await request.post(url, {
      data: { query: mutation(albumData) }
    });

    // Verify that the deleted album does not exist
    const getAlbumQuery = `
    {
      album(id: ${albumData.albumId}) {
        id
        title
      }
    }
  `;

    const getAlbumResponse = await request.post(url, {
      data: { query: getAlbumQuery }
    });

    const getAlbumData = await getAlbumResponse.json();

    // Check if the album does not exist after deletion
    expect(getAlbumData.data.album).toBeNull();
    console.log('Deleted album query result:', getAlbumData.data.album);
  });
});