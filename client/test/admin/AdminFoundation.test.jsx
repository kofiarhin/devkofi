import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminOverview from '../../src/Pages/Admin/AdminOverview';
import AdminArticles from '../../src/Pages/Admin/AdminArticles';

vi.mock('../../src/hooks/useAdminData', () => ({
  useAdminOverview: vi.fn(),
  useAdminArticles: vi.fn(),
  useArticleTransition: vi.fn(),
}));

import { useAdminArticles, useAdminOverview, useArticleTransition } from '../../src/hooks/useAdminData';

describe('Admin foundation pages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useArticleTransition.mockReturnValue({ mutate: vi.fn(), isPending: false });
  });

  it('renders database overview metrics and recent activity', () => {
    useAdminOverview.mockReturnValue({
      isLoading: false,
      isError: false,
      data: { data: { data: {
        articles: { total: 4, published: 3, draft: 1 },
        bookings: { total: 6, upcoming: 2 },
        messages: { total: 8, unread: 5 },
        subscribers: { total: 10, verified: 9 },
        recentActivity: [{ id: '1', type: 'article', label: 'Test article', status: 'draft', at: '2026-09-03T00:00:00.000Z' }],
      } } },
    });
    render(<AdminOverview />);
    expect(screen.getByRole('heading', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByText('Test article')).toBeInTheDocument();
    expect(screen.getByText('3 published · 1 drafts')).toBeInTheDocument();
  });

  it('renders article management and publishes a draft', () => {
    const mutate = vi.fn();
    useArticleTransition.mockReturnValue({ mutate, isPending: false });
    useAdminArticles.mockReturnValue({ isLoading: false, isError: false, data: { data: { data: {
      items: [{ _id: 'article-1', title: 'Draft article', slug: 'draft-article', status: 'draft', updatedAt: '2026-09-03T00:00:00.000Z' }],
      page: 1, totalPages: 1,
    } } } });
    render(<MemoryRouter><AdminArticles /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: 'Publish' }));
    expect(mutate).toHaveBeenCalledWith({ id: 'article-1', action: 'publish' });
    expect(screen.getByRole('link', { name: 'New article' })).toHaveAttribute('href', '/admin/articles/new');
  });
});
