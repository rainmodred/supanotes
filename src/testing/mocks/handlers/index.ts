import { noteTagsHandlers } from './note-tags';
import { notesHandlers } from './notes';
import { tagsHandlers } from './tags';

export const handlers = [
  ...notesHandlers,
  ...noteTagsHandlers,
  ...tagsHandlers,
];
