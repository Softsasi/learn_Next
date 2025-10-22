import { faker } from '@faker-js/faker';

export function generateFakePost() {
  const title = faker.lorem.sentence();
  const content = faker.lorem.paragraphs(10);
  const authorId = '68f75698716f6c33655e7aa2';

  return { title, content, authorId };
}
