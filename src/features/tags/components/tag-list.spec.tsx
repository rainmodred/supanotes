import { createFakeTag } from '@/testing/mocks/db';
import { TagsList } from './tags-list';
import {
  findByTestId,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { AppProvider } from '@/app-provider';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';

describe('tags', () => {
  it.skip('should render tags', async () => {
    const user = userEvent.setup();
    const TAGS_COUNT = 2;
    for (let i = 0; i < TAGS_COUNT; i++) {
      createFakeTag();
    }

    render(
      <AppProvider initialSession={{ user: { id: '123' } }}>
        <Suspense fallback={<p>meow</p>}>
          <BrowserRouter>
            <TagsList />
          </BrowserRouter>
        </Suspense>
      </AppProvider>,
    );

    expect(await screen.findByText(/tags/i)).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(TAGS_COUNT);

    await user.type(screen.getByPlaceholderText('Add tag'), 'meow{enter}');

    expect(screen.getAllByRole('listitem')).toHaveLength(TAGS_COUNT + 1);
  });

  it.only('should delete tag', async () => {
    const user = userEvent.setup();
    const tags = [];
    const TAGS_COUNT = 2;

    for (let i = 0; i < TAGS_COUNT; i++) {
      tags.push(createFakeTag());
    }

    render(
      <AppProvider initialSession={{ user: { id: '123' } }}>
        <Suspense fallback={<p>meow</p>}>
          <BrowserRouter>
            <TagsList />
          </BrowserRouter>
        </Suspense>
      </AppProvider>,
    );

    expect(await screen.findByText(/tags/i)).toBeInTheDocument();
    // expect(screen.getAllByRole('listitem')).toHaveLength(TAGS_COUNT);

    await user.click(screen.getByTestId(`edit-${tags.at(0)?.name}`));
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() =>
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument(),
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(TAGS_COUNT);
  });
});
