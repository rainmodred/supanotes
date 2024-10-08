import { INote } from '@/lib/types';

export function filterNotes(
  notes: INote[],
  tagName: string | null,
  search: string,
) {
  search = search.toLowerCase();
  const filteredByTag =
    tagName === null
      ? [...notes]
      : notes?.filter(note => note.tags.some(tag => tag.name === tagName));

  if (search === '') {
    return filteredByTag;
  }

  return filteredByTag.filter(
    note =>
      note.body.toLowerCase().includes(search) ||
      note.title.toLowerCase().includes(search),
  );
}
