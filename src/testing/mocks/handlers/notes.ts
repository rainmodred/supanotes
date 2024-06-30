import { delay, http, HttpResponse } from 'msw';
import { createFakeNote, db } from '../db';
import { INote } from '@/lib/types';

export const API_URL = import.meta.env.VITE_URL;
export const notesHandlers = [
  http.get(`${API_URL}/rest/v1/notes`, async ({ request }) => {
    await delay();
    try {
      const url = new URL(request.url);
      const note_id = url.searchParams.get('id')?.slice(3);
      if (note_id) {
        return HttpResponse.json([
          db.note.findFirst({ where: { id: { equals: note_id } } }),
        ]);
      }

      return HttpResponse.json(db.note.getAll());
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),

  http.patch(`${API_URL}/rest/v1/notes`, async ({ request }) => {
    await delay();
    try {
      const patchedNote = (await request.json()) as INote;

      const updated = db.note.update({
        where: { id: { equals: patchedNote.id } },
        data: patchedNote,
      });

      return HttpResponse.json([updated]);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),

  http.post(`${API_URL}/rest/v1/notes`, async ({ request }) => {
    await delay();
    try {
      const note = (await request.json()) as INote;
      const addedNote = createFakeNote({
        title: note.title,
        body: note.body,
      });
      return HttpResponse.json([addedNote]);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),

  http.delete(`${API_URL}/rest/v1/notes`, async ({ request }) => {
    await delay();
    try {
      const url = new URL(request.url);
      const id = url.searchParams.get('id')?.slice(3);
      if (!id) {
        throw new Error();
      }
      db.note.delete({ where: { id: { equals: id } } });
      return new HttpResponse(null, { status: 204 });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 400 },
      );
    }
  }),
];
