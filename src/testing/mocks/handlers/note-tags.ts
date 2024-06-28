import { delay, http, HttpResponse } from 'msw';
import { db } from '../db';

export const API_URL = import.meta.env.VITE_URL;
export const noteTagsHandlers = [
  http.post(`${API_URL}/rest/v1/notes_tags`, async ({ request }) => {
    await delay();
    try {
      const { note_id, tag_id } = (await request.json()) as {
        note_id: string;
        tag_id: string;
      };
      const tag = db.tag.findFirst({ where: { id: { equals: tag_id } } })!;
      db.note.update({
        where: {
          id: {
            equals: note_id,
          },
        },
        data: {
          tags: prevTags => [...prevTags, tag],
        },
      });

      return HttpResponse.json([]);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),

  http.delete(`${API_URL}/rest/v1/notes_tags`, async ({ request }) => {
    await delay();

    try {
      const url = new URL(request.url);
      const note_id = url.searchParams.get('note_id')?.slice(3);
      const tag_id = url.searchParams.get('tag_id')?.slice(3);
      db.note.update({
        where: { id: { equals: note_id } },
        data: { tags: prevTags => prevTags.filter(tag => tag.id !== tag_id) },
      });

      return new HttpResponse(null, { status: 204 });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),
];
