import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data';
import { faker } from '@faker-js/faker';
import { ITag } from '@/lib/types';

const models = {
  user: {
    id: primaryKey(String),
    email: String,
  },
  tag: {
    id: primaryKey(String),
    name: String,
  },
  note: {
    id: primaryKey(String),
    title: String,
    body: String,
    //rename to userId?
    user_id: String,
    tags: manyOf('tag'),
  },
};

export const db = factory(models);

// const user = db.user.create({
//   id: '1',
//   email: 'tom@example.com',
//   password: '123456',
// });
// const tag = db.tag.create({ id: '1', name: 'meow' });

function initDb() {}

initDb();

export function createFakeUser() {
  const user = db.user.create({
    id: faker.string.uuid(),
    email: faker.internet.email(),
  });
  return user;
}

export function createFakeTag(name?: string) {
  const tagName = name ? name : faker.word.noun();
  return db.tag.create({ id: faker.string.uuid(), name: tagName });
}

export function createFakeNote({
  title,
  body,
  tags,
}: { title?: string; body?: string; tags?: ITag[] } = {}) {
  return db.note.create({
    id: faker.string.uuid(),
    title: title ? title : faker.word.words(2),
    body: body ? body : faker.lorem.lines(),
    tags: tags ? [...tags] : [],
  });
}
