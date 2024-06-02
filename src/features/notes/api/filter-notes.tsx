import { INote } from '@/lib/types';

export function filterNotes(notes: INote[], tagName: string) {
  if (tagName === 'all') {
    return notes;
  } else {
    return notes?.filter(note => note.tags.some(tag => tag.name === tagName));
  }
}
