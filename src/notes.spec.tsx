import { describe } from 'node:test';
import { renderApp } from './testing/test-utils';
import {
  screen,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Notes,
  loader as notesLoader,
  action as notesAction,
} from './routes/notes';
import { queryClient } from './lib/react-query';
import { createTag, db } from './testing/mocks/db';
import { drop } from '@mswjs/data';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

describe('NotesRoute', () => {
  window.ResizeObserver = ResizeObserver;

  const COUNT = 2;

  afterEach(() => {
    drop(db);
  });
  describe('Tags', () => {
    it('should render tags', async () => {
      for (let i = 0; i < COUNT; i++) {
        createTag();
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

      expect(screen.queryAllByRole('listitem')).toHaveLength(COUNT);
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

    it('should delete tag', async () => {
      createTag();
      const tagName = 'movies';
      createTag('movies');

      const user = userEvent.setup();
      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

      const delItem = await screen.findByText(tagName);
      const dropdown = screen.getByTestId(`edit-${tagName}`);
      await user.click(dropdown);
      await user.click(
        screen.getByRole('button', {
          name: /delete/i,
        }),
      );

      await waitForElementToBeRemoved(delItem);

      await waitFor(() =>
        expect(screen.getAllByRole('listitem')).toHaveLength(1),
      );
    });

    it('should edit tag', async () => {
      const tag = createTag();
      const user = userEvent.setup();
      renderApp(<Notes />, {
        path: '/notes',
        url: '/notes',
        loader: notesLoader(queryClient),
        action: notesAction(queryClient),
      });

      const dropdown = await screen.findByTestId(`edit-${tag?.name}`);
      await user.click(dropdown);
      const input = screen.getByDisplayValue(tag?.name);

      await user.clear(input);
      await user.type(input, 'movies{enter}');
      expect(await screen.findByText('movies')).toBeInTheDocument();
    });
    it.skip('try action', async () => {
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
});
