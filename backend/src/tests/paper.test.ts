import request from 'supertest';
import app from '../app';
import { describe, it, expect } from '@jest/globals';

describe('Search API Endpoints', () => {
  it('should return 200 for health check', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  it('should return 200 for search query', async () => {
    const res = await request(app).get('/api/papers/search?q=test');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  }, 30000);

  it('should return 401 for unauthorized indexing', async () => {
    const res = await request(app).post('/api/papers/index').send({ title: 'Unauthorized' });
    expect(res.status).toBe(401);
  });
});
