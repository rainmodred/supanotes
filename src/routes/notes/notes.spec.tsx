import {
  fireEvent,
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Notes, loader as notesLoader, action as notesAction } from './notes';
import { drop } from '@mswjs/data';
import { queryClient } from '@/lib/react-query';
import {
  createFakeNote,
  createFakeTag,
  createFakeUser,
  db,
} from '@/testing/mocks/db';
import { supabase } from '@/lib/supabase';
import { renderApp } from '@/testing/test-utils';
import { NewNote, action as newNoteAction } from '../new';

describe('NotesRoute', () => {
  beforeEach(() => {
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

  afterEach(() => {
    drop(db);
    vi.clearAllMocks();
    // vi.resetAllMocks();
  });

  afterAll(() => {
    drop(db);
  });

  describe('Tags', () => {
    it('should render tags', async () => {
      const TAGS_COUNT = 2;
      for (let i = 0; i < TAGS_COUNT; i++) {
        createFakeTag();
      }
      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

      expect(await screen.findByTestId('loading-tags')).toBeInTheDocument();
      await waitFor(() =>
        expect(screen.queryByTestId('loading-tags')).not.toBeInTheDocument(),
      );

      expect(screen.queryAllByRole('listitem')).toHaveLength(TAGS_COUNT);
    });
    it('should create tag', async () => {
      const user = userEvent.setup();
      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

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
      expect(screen.getByText(newTag)).toBeInTheDocument();

      db.tag.getAll().forEach(tag => {
        const elem = screen.getByText(tag.name);
        expect(elem).toHaveTextContent(tag.name);
      });

      // screen.debug(undefined, Infinity);
    });

    it('should rename tag', async () => {
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

    it.skip('rename meow', async () => {
      window.PointerEvent = MouseEvent as typeof PointerEvent;

      const user = userEvent.setup({ skipHover: true });
      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

      const button = await screen.findByTestId('meow');
      // await user.click(button);
      // fireEvent.click(button);
      fireEvent.pointerDown(
        button,
        new PointerEvent('pointerdown', { ctrlKey: false, button: 0 }),
      );

      expect(screen.getByText(/content/i)).toBeInTheDocument();
    });

    it('should show error if tag already exists', async () => {
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
    it('should delete tag', async () => {
      createFakeTag();
      const tagName = 'movies';
      createFakeTag(tagName);

      const user = userEvent.setup();
      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

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
    it.skip('action example', async () => {
      const formData = new FormData();
      formData.append('intent', 'test');
      let request = new Request('http://localhost:3000/notes', {
        method: 'POST',
        body: formData,
      });
      const action = notesAction(queryClient);
      const response = await action({ request, params: {}, context: {} });
    });
  });
  describe('Notes', () => {
    const NOTES_COUNT = 5;
    it('should render notes', async () => {
      const notes = [];
      for (let i = 0; i < NOTES_COUNT; i++) {
        notes.push(createFakeNote());
      }
      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

      expect(await screen.findByTestId(/loading-notes/i)).toBeInTheDocument();
      await waitFor(() =>
        expect(screen.queryByTestId(/loading-notes/i)).not.toBeInTheDocument(),
      );

      for (const note of notes) {
        expect(
          screen.getByRole('link', {
            name: `${note.title}`,
          }),
        ).toHaveAttribute('href', `/notes/${note.id}`);
      }
    });
    it('should search by title and body', async () => {
      //TODO: move this test to notes-list?
      const notes = [];
      for (let i = 0; i < NOTES_COUNT; i++) {
        notes.push(createFakeNote());
      }
      createFakeNote({ title: 'Quick Ben' });

      const user = userEvent.setup();
      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

      expect(await screen.findByTestId(/loading-notes/i)).toBeInTheDocument();
      await waitFor(() =>
        expect(screen.queryByTestId(/loading-notes/i)).not.toBeInTheDocument(),
      );

      const searchInput = screen.getByPlaceholderText(/search note/i);
      await user.clear(searchInput);
      await user.type(searchInput, 'quick');

      for (const note of notes) {
        expect(
          screen.queryByRole('link', {
            name: `${note.title}`,
          }),
        ).not.toBeInTheDocument();
      }

      expect(
        screen.getByRole('link', {
          name: /quick ben/i,
        }),
      ).toBeInTheDocument();
    });

    it.skip('should create note', async () => {
      const user = userEvent.setup();
      renderApp(<NewNote />, {
        path: '/notes/:noteId',
        url: '/notes/new',
        action: newNoteAction(queryClient),
      });

      const titleInput = await screen.findByPlaceholderText(/title/i);
      await user.type(titleInput, 'My new note{enter}');
      //TODO:
      // screen.debug(undefined, Infinity);
    });
  });
});
