import { test, expect } from '@playwright/test';

const url = 'https://graphqlzero.almansi.me/api';

test.describe('Create Album without title', () => {
    test('Should return errors when ID is a string', async ({ request }) => {
        const mutation = `
      mutation {
        createAlbum(input: { userId: 1 }) {
          id
          title
        }
      }
    `;

        const response = await request.post(url, { data: { query: mutation } });

        // Check that the status code is 400
        expect(response.status()).toBe(400);
        console.log('Status Code:', response.status());

        const json = await response.json();

        expect(json).toHaveProperty('errors');
        expect(json.errors[0].message).toContain('title');
        console.log('Errors:', JSON.stringify(json.errors, null, 2));
    });
});
