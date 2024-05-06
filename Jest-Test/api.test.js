// api.test.js
// npm test -- jest-test/api.test.js

import { API } from '../scripts/api.js';

// Mock global.fetch so we do not perform actual HTTP requests
global.fetch = jest.fn(async (url) => {
    return {
        ok: true,
        json: async () => ({ data: 'sample data' }),
    };
});

beforeEach(() => {
    fetch.mockClear();
});

describe('API', () => {
    describe('fetchData', () => {
        it('constructs the correct URL and fetches data', async () => {
            const api = new API();
            await api.fetchData('testEndpoint');
            expect(fetch).toHaveBeenCalledWith('https://data.epa.gov/efservice/testEndpoint');
        });

        it('returns JSON data on a successful fetch', async () => {
            const api = new API();
            const data = await api.fetchData('testEndpoint');
            expect(data).toEqual({data: 'sample data' });
        });

        it('throws an error when the response is not ok', async () => {
            fetch.mockImplementationOnce(async () => ({
                ok: false,
                status: 404,
                json: async () => ({ error: 'NOt found'})
            }));
            const api = new API();
            await expect(api.fetchData('badEndpoint')).rejects.toThrow('Failed to fetch data');
        });

        it('handles fetch operation errors', async () => {
            fetch.mockImplementationOnce(async () => {
                throw new Error('Network error');
            });
        
            const api = new API();
            await expect(api.fetchData('errorEndpoint')).rejects.toThrow('Network error');
        });        
    });
});