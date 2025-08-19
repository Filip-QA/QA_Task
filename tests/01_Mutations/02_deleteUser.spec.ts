import { test, expect } from '@playwright/test';

// Define the user data
const userData = {
  id: 10
};

  // Define the mutation for deleting a user
  const url = 'https://graphqlzero.almansi.me/api';
  const mutation = ({ id }: { id: number }) => `
    mutation {
      deleteUser(id: ${id}) 
    }
  `;

test.describe('Delete User', () => {
  test('Check if status code is 200', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    // Check that the status code is 200
    expect(response.status()).toBe(200);
    console.log('Status Code:', response.status());
  });

  test('Check if user deletion response is empty', async ({ request }) => {
    const response = await request.post(url, {
      data: { query: mutation(userData) }
    });

    const jsonData = await response.json();

    // Ensure that the user is successfully deleted
    expect(jsonData.data.deleteUser).toBe(true);
    console.log('User deletion successful:', jsonData.data.deleteUser);
  });

  test('Check if the user no longer exists', async ({ request }) => {
    // This test will fail because the API does not allow changing of data, as stated in the task description
    // If this was a real test environment where data could be changed, the test I would do after deleting a user would be the following: 
    
    await request.post(url, {
      data: { query: mutation(userData) }
    });

    // After deletion, try to query the deleted user
    const getUserQuery = `
      {
        user(id: ${userData.id}) {
          id
          name
        }
      }
    `;

    const getUserResponse = await request.post(url, {
      data: { query: getUserQuery }
    });

    const getUserData = await getUserResponse.json();

    // Check if the user does not exist after deletion
    expect(getUserData.data.user).toBeNull();
    console.log('Deleted user query result:', getUserData.data.user);
  });
});