import { createFakeTag, createFakeUser, db } from '@/testing/mocks/db';
import { TagsList } from './tags-list';
import {
  findByTestId,
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import { AppProvider } from '@/app-provider';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router';
import userEvent from '@testing-library/user-event';
import { supabase } from '@/lib/supabase';
import { drop } from '@mswjs/data';

describe('tags', () => {
  beforeEach(() => {
    drop(db);
    const user = createFakeUser();
    vi.spyOn(supabase.auth, 'getSession').mockResolvedValue({
      data: {
        session: {
          user: {
            id: user.id,
          },
        },
      },
    });

    vi.spyOn(supabase.auth, 'onAuthStateChange').mockReturnValue({
      data: {
        subscription: {
          id: '1',
          callback: () => {},
          unsubscribe: () => {},
        },
      },
    });
  });

  it('should create tag', async () => {
    console.log('render', db.tag.getAll());
    const user = userEvent.setup();
    render(
      <AppProvider>
        <Suspense fallback={<p>loading...</p>}>
          <BrowserRouter>
            <TagsList />
          </BrowserRouter>
        </Suspense>
      </AppProvider>,
    );

    expect(await screen.findByText(/tags/i)).toBeInTheDocument();
    // expect(screen.getAllByRole('listitem')).toHaveLength(TAGS_COUNT);

    // await user.type(screen.getByPlaceholderText('Add tag'), 'meow{enter}');

    // expect(await screen.findAllByRole('listitem')).toHaveLength(TAGS_COUNT + 1);

    const input = await screen.findByPlaceholderText(/add tag/i);

    const newTag = 'book';
    await user.clear(input);
    await user.type(input, `${newTag}{enter}`);

    //both useless?
    // expect(await screen.findByText(/loading/i)).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument(),
    );

    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    expect(await screen.findByText(newTag)).toBeInTheDocument();

    db.tag.getAll().forEach(tag => {
      const elem = screen.getByText(tag.name);
      expect(elem).toHaveTextContent(tag.name);
    });
  });

  it('should delete tag', async () => {
    console.log('delete', db.tag.getAll());
    createFakeTag();
    const tagName = 'movies';
    createFakeTag(tagName);

    render(
      <AppProvider>
        <Suspense fallback={<p>loading...</p>}>
          <BrowserRouter>
            <TagsList />
          </BrowserRouter>
        </Suspense>
      </AppProvider>,
    );

    const delItem = await screen.findByText(tagName);
    const dropdown = screen.getByTestId(`edit-${tagName}`);
    fireEvent.pointerDown(
      dropdown,
      new PointerEvent('pointerdown', { ctrlKey: false, button: 0 }),
    );
    // await user.click(dropdown);
    // await user.click(
    //   screen.getByRole('button', {
    //     name: /delete/i,
    //   }),
    // );

    fireEvent.click(
      screen.getByRole('button', {
        name: /delete/i,
      }),
    );

    fireEvent.click(
      screen.getByRole('button', {
        name: /confirm/i,
      }),
    );
    // await user.click(
    //   screen.getByRole('button', {
    //     name: /confirm/i,
    //   }),
    // );

    await waitForElementToBeRemoved(delItem, { timeout: 5000 });
    await waitFor(() =>
      expect(screen.getAllByRole('listitem')).toHaveLength(1),
    );
  });
  {
    it.skip('should rename tag', async () => {
      const tag = createFakeTag();
      const user = userEvent.setup({ skipHover: true });

      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

      const dropdown = await screen.findByTestId(`edit-${tag.name}`);

      // await user.click(dropdown);

      fireEvent.pointerDown(
        dropdown,
        new PointerEvent('pointerdown', { ctrlKey: false, button: 0 }),
      );
      const input = await screen.findByDisplayValue(tag.name);

      const renamedTag = 'movies';
      await user.clear(input);
      await user.type(input, `${renamedTag}{enter}`);

      await waitFor(() =>
        expect(screen.queryByTestId(/loading/i)).not.toBeInTheDocument(),
      );

      expect(await screen.findByText(renamedTag)).toBeInTheDocument();
    });

    it.skip('should show error if tag already exists', async () => {
      const tag = createFakeTag();
      const tag1 = createFakeTag();
      const user = userEvent.setup();
      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

      const dropdown = await screen.findByTestId(`edit-${tag?.name}`);
      fireEvent.pointerDown(
        dropdown,
        new PointerEvent('pointerdown', { ctrlKey: false, button: 0 }),
      );
      const input = screen.getByDisplayValue(tag?.name);

      await user.clear(input);
      await user.type(input, `${tag1.name}{enter}`);

      expect(screen.getByText(/tag already exists/i)).toBeInTheDocument();
    });
  }
});
