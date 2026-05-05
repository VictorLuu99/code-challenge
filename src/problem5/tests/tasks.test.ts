import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp();

describe('POST /api/v1/tasks', () => {
  it('creates a task with required fields', async () => {
    const res = await request(app).post('/api/v1/tasks').send({ title: 'New task' });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ title: 'New task', status: 'todo', priority: 'medium' });
    expect(res.body.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('rejects empty title', async () => {
    const res = await request(app).post('/api/v1/tasks').send({ title: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });
});

describe('GET /api/v1/tasks', () => {
  it('returns paginated list with filters', async () => {
    await request(app).post('/api/v1/tasks').send({ title: 'A', priority: 'high' });
    await request(app).post('/api/v1/tasks').send({ title: 'B', priority: 'low' });
    await request(app).post('/api/v1/tasks').send({ title: 'C', priority: 'high' });

    const res = await request(app).get('/api/v1/tasks?priority=high&limit=10');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 10, total: 2, totalPages: 1 });
  });

  it('searches by title (case-insensitive)', async () => {
    await request(app).post('/api/v1/tasks').send({ title: 'Refactor auth' });
    await request(app).post('/api/v1/tasks').send({ title: 'Update deps' });

    const res = await request(app).get('/api/v1/tasks?q=AUTH');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].title).toBe('Refactor auth');
  });
});

describe('GET /api/v1/tasks/:id', () => {
  it('returns the task', async () => {
    const created = await request(app).post('/api/v1/tasks').send({ title: 'X' });
    const res = await request(app).get(`/api/v1/tasks/${created.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(created.body.id);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/v1/tasks/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });
});

describe('PATCH /api/v1/tasks/:id', () => {
  it('updates the task', async () => {
    const created = await request(app).post('/api/v1/tasks').send({ title: 'old' });
    const res = await request(app)
      .patch(`/api/v1/tasks/${created.body.id}`)
      .send({ status: 'done' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('done');
  });

  it('returns 404 when task does not exist', async () => {
    const res = await request(app)
      .patch('/api/v1/tasks/00000000-0000-0000-0000-000000000000')
      .send({ status: 'done' });
    expect(res.status).toBe(404);
  });

  it('rejects empty body', async () => {
    const created = await request(app).post('/api/v1/tasks').send({ title: 'X' });
    const res = await request(app).patch(`/api/v1/tasks/${created.body.id}`).send({});
    expect(res.status).toBe(400);
  });
});

describe('DELETE /api/v1/tasks/:id', () => {
  it('deletes and returns 204', async () => {
    const created = await request(app).post('/api/v1/tasks').send({ title: 'gone' });
    const del = await request(app).delete(`/api/v1/tasks/${created.body.id}`);
    expect(del.status).toBe(204);
    const after = await request(app).get(`/api/v1/tasks/${created.body.id}`);
    expect(after.status).toBe(404);
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/v1/tasks/00000000-0000-0000-0000-000000000000');
    expect(res.status).toBe(404);
  });
});
