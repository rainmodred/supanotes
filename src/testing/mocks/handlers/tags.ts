import { delay, http, HttpResponse } from 'msw';
import { createFakeTag, db } from '../db';
import { ITag } from '@/lib/types';

export const API_URL = import.meta.env.VITE_URL;
export const tagsHandlers = [
  http.get(`${API_URL}/rest/v1/tags`, async () => {
    await delay();
    try {
      return HttpResponse.json(db.tag.getAll());
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),

  http.patch(`${API_URL}/rest/v1/tags`, async ({ request }) => {
    await delay();
    try {
      const renamedTag = (await request.json()) as ITag;
      const addedTag = db.tag.update({
        where: { id: { equals: renamedTag.id } },
        data: { name: renamedTag.name },
      });
      return HttpResponse.json([addedTag]);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),

  http.post(`${API_URL}/rest/v1/tags`, async ({ request }) => {
    await delay();
    try {
      const newTag = (await request.json()) as ITag;
      const addedTag = createFakeTag(newTag.name);
      return HttpResponse.json([addedTag]);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),

  http.delete(`${API_URL}/rest/v1/tags`, async ({ request }) => {
    await delay();
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get('id')?.slice(3);
      if (!id) {
        throw new Error();
      }

      db.tag.delete({ where: { id: { equals: id } } });

      return new HttpResponse(null, { status: 204 });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),
];
