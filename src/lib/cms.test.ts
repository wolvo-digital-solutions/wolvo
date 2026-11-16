import { describe, expect, it } from 'vitest';
import {
  mapDbArticleToArticle,
  mapDbProjectToProject,
  mapDbServiceToService,
  mapDbTestimonialToTestimonial,
  type DbArticle,
  type DbProject,
  type DbService,
  type DbTestimonial,
} from './supabase';
import { getIconComponent } from './icons';

describe('CMS Database Mappers', () => {
  it('maps DbArticle to Article with custom cover image', () => {
    const dbArticle: DbArticle = {
      id: 'test-article',
      title: 'Test Title',
      category: 'Web Development',
      summary: 'Short summary',
      date: '2026-10-01',
      cover: 'orbit',
      cover_image_url: 'https://supabase.co/storage/img.webp',
      body: [{ heading: 'H1', paragraphs: ['Paragraph 1'] }],
      featured: true,
      status: 'published',
    };

    const mapped = mapDbArticleToArticle(dbArticle);
    expect(mapped.id).toBe('test-article');
    expect(mapped.title).toBe('Test Title');
    expect(mapped.featured).toBe(true);
    expect(mapped.coverImage?.fallback).toBe('https://supabase.co/storage/img.webp');
    expect(mapped.body).toHaveLength(1);
    expect(mapped.body[0].paragraphs[0]).toBe('Paragraph 1');
  });

  it('maps DbService to Service and resolves dynamic LucideIcon', () => {
    const dbService: DbService = {
      id: 'web',
      title: 'Web Dev',
      short_title: 'Web',
      description: 'Building fast sites',
      icon_name: 'Monitor',
      deliverables: ['Websites', 'Apps'],
      href: '#contact',
      image_url: 'https://example.com/web.jpg',
      image_alt: 'Web Alt',
      image_fallback: 'https://example.com/web-fb.jpg',
      status: 'published',
      sort_order: 1,
    };

    const mapped = mapDbServiceToService(dbService);
    expect(mapped.id).toBe('web');
    expect(mapped.shortTitle).toBe('Web');
    expect(mapped.deliverables).toEqual(['Websites', 'Apps']);
    expect(mapped.icon).toBeDefined();
  });

  it('maps DbProject with result metric and tags', () => {
    const dbProject: DbProject = {
      id: 'luxetime',
      title: 'LuxeTime Watches',
      client: 'LuxeTime',
      category: 'Website',
      description: 'E-commerce build',
      challenge: 'Slow legacy site',
      solution: 'Next.js headless store',
      result_metric: '+42%',
      result_label: 'Conversion',
      overview: 'Full story here',
      services: ['Web Development', 'UI/UX'],
      technologies: ['React', 'TypeScript', 'Stripe'],
      image: 'https://example.com/screen.webp',
      image_alt: 'Storefront',
      visual: 'commerce',
      href: 'https://luxetime.com',
      featured: true,
      placeholder: false,
      status: 'published',
      sort_order: 1,
    };

    const mapped = mapDbProjectToProject(dbProject);
    expect(mapped.id).toBe('luxetime');
    expect(mapped.result?.metric).toBe('+42%');
    expect(mapped.result?.label).toBe('Conversion');
    expect(mapped.services).toHaveLength(2);
    expect(mapped.technologies).toHaveLength(3);
  });

  it('maps DbTestimonial properly', () => {
    const dbTestimonial: DbTestimonial = {
      id: 'rev-1',
      name: 'Jane Doe',
      role: 'CEO',
      company: 'TechCorp',
      avatar: 'https://example.com/jane.jpg',
      quote: 'Wolvo delivered on time with stellar quality.',
      rating: 5,
      placeholder: false,
      status: 'published',
      sort_order: 1,
    };

    const mapped = mapDbTestimonialToTestimonial(dbTestimonial);
    expect(mapped.name).toBe('Jane Doe');
    expect(mapped.rating).toBe(5);
    expect(mapped.quote).toContain('Wolvo delivered');
  });

  it('resolves known icons and falls back gracefully for unknown names', () => {
    const monitorIcon = getIconComponent('Monitor');
    expect(monitorIcon).toBeDefined();

    const smartphoneIcon = getIconComponent('Smartphone');
    expect(smartphoneIcon).toBeDefined();

    const fallbackIcon = getIconComponent('NonExistentIcon');
    expect(fallbackIcon).toBeDefined();
  });
});
