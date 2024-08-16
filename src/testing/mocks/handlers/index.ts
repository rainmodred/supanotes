import { noteTagsHandlers } from './note-tags';
import { notesHandlers } from './notes';
import { tagsHandlers } from './tags';
// import { authHandlers } from './auth';

export const handlers = [
  // ...authHandlers,
  ...notesHandlers,
  ...noteTagsHandlers,
  ...tagsHandlers,
];
