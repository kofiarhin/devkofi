const request = require('supertest');

const mockFeedbackCreate = jest.fn();
const mockFeedbackFind = jest.fn();
const mockProgressFindOne = jest.fn();
const mockProgressCreate = jest.fn();

jest.mock('../Model/feedbackModel', () => ({
  create: (...args) => mockFeedbackCreate(...args),
  find: (...args) => mockFeedbackFind(...args),
}));

jest.mock('../Model/progressModel', () => ({
  findOne: (...args) => mockProgressFindOne(...args),
  create: (...args) => mockProgressCreate(...args),
}));

jest.mock('../middlewares/auth', () => (req, _res, next) => {
  req.user = { _id: 'user-1', role: 'admin' };
  next();
});

jest.mock('../middlewares/requireAdmin', () => (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  return next();
});

const app = require('../app');

describe('Feedback routes', () => {
  beforeEach(() => {
    mockFeedbackCreate.mockReset();
    mockFeedbackFind.mockReset();
  });

  it('creates feedback entries', async () => {
    const created = {
      id: 'feedback-1',
      sentiment: 'up',
      message: 'Loving the mentorship!',
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
    };
    mockFeedbackCreate.mockResolvedValue(created);

    const response = await request(app).post('/api/ux/feedback').send({ sentiment: 'up', message: 'Loving the mentorship!' });

    expect(response.statusCode).toBe(201);
    expect(mockFeedbackCreate).toHaveBeenCalledWith({
      sentiment: 'up',
      message: 'Loving the mentorship!',
      source: 'web',
      metadata: undefined,
    });
    expect(response.body).toMatchObject({ id: 'feedback-1', sentiment: 'up' });
  });

  it('rejects invalid submissions', async () => {
    const response = await request(app).post('/api/ux/feedback').send({ sentiment: 'maybe', message: '' });
    expect(response.statusCode).toBe(400);
  });

  it('exports CSV feedback', async () => {
    const lean = jest.fn().mockResolvedValue([
      {
        _id: 'f-1',
        sentiment: 'up',
        message: 'Ship it',
        source: 'web',
        createdAt: new Date('2024-02-02T00:00:00.000Z'),
      },
    ]);
    const sort = jest.fn().mockReturnValue({ lean });
    mockFeedbackFind.mockReturnValue({ sort });

    const response = await request(app).get('/api/ux/feedback/export');

    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('text/csv');
    expect(response.text).toContain('f-1');
    expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
    expect(lean).toHaveBeenCalled();
  });
});

describe('Progress routes', () => {
  beforeEach(() => {
    mockProgressFindOne.mockReset();
    mockProgressCreate.mockReset();
  });

  it('returns defaults when no progress is stored', async () => {
    mockProgressFindOne.mockResolvedValue(null);
    const response = await request(app).get('/api/user/progress');
    expect(response.statusCode).toBe(200);
    expect(response.body).toMatchObject({ percentage: 0, badges: [] });
  });

  it('updates progress and awards badges', async () => {
    const save = jest.fn().mockResolvedValue();
    const progress = {
      id: 'progress-1',
      userId: 'user-1',
      activeCourseId: 'course-1',
      activeCourseTitle: 'Launch MERN',
      completedLessons: 0,
      totalLessons: 10,
      streak: 2,
      badges: [],
      nextLessonId: null,
      milestones: [],
      save,
    };
    mockProgressFindOne.mockResolvedValue(progress);

    const response = await request(app)
      .post('/api/user/progress')
      .send({ courseId: 'course-1', completedLessons: 7, totalLessons: 10, courseTitle: 'Launch MERN' });

    expect(response.statusCode).toBe(200);
    expect(save).toHaveBeenCalled();
    expect(response.body.percentage).toBe(70);
    expect(response.body.badges.length).toBeGreaterThanOrEqual(2);
  });
});
