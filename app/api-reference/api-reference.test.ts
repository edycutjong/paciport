import { GET } from './route';
import { ApiReference } from '@scalar/nextjs-api-reference';

// Mock the scalar package
jest.mock('@scalar/nextjs-api-reference', () => ({
  ApiReference: jest.fn().mockImplementation((config) => {
    return async () => ({ text: async () => `Mocked Scalar ${config.theme}` } as unknown as Response);
  }),
}));

describe('API Reference Route', () => {
  it('should export a GET handler created by ApiReference', async () => {
    // Because ApiReference is called at module scope, checking if it was called should work.
    expect(ApiReference).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/openapi.json',
        theme: 'saturn',
        darkMode: true,
        metaData: expect.objectContaining({
          title: 'API Reference — PaciPort',
        }),
      })
    );

    // Verify GET is a function (the handler returned by our mock)
    expect(typeof GET).toBe('function');
    
    // Test the mock response
    const request = new Request('http://localhost:3000/api-reference');
    const response = await (GET as unknown as ((req: Request) => Promise<Response>))(request);
    const text = await response.text();
    expect(text).toBe('Mocked Scalar saturn');
  });
});
