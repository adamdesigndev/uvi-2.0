// api.test.js
import { API } from '../scripts/api.js';

// Mock global.fetch so we do not perform actual HTTP requests
global.fetch = jest.fn(() => Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ data: 'sample data'}),
}));

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
    });

})