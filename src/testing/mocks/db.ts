import { factory, primaryKey } from '@mswjs/data';
import { faker } from '@faker-js/faker';

const models = {
  tag: {
    id: primaryKey(String),
    name: String,
  },
};

export const db = factory(models);

function initDb() {
  // db.tag.create({ id: faker.string.uuid(), name: faker.word.noun() });
}

initDb();

export function createTag(name?: string) {
  const tagName = name ? name : faker.word.noun();
  return db.tag.create({ id: faker.string.uuid(), name: tagName });
}
