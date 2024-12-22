import { INote } from '@/lib/types';
import { cn } from '@/lib/utils';
import { NavLink, useLocation } from 'react-router';
import { format } from 'date-fns';

export function NotePreview({ note }: { note: INote }) {
  const truncatedBody = note.body.split('\n').slice(0, 2);
  const { search } = useLocation();

  return (
    <NavLink
      to={`${note.id}${search}`}
      className={({ isActive }) =>
        cn('block py-2 hover:bg-accent hover:text-accent-foreground', {
          'bg-accent': isActive,
        })
      }
    >
      <div className="flex flex-col gap-2 px-4">
        <span className="text-base font-semibold">{note.title}</span>
        <span className="truncate text-xs font-normal">{truncatedBody}</span>
        <span className="text-xs font-normal opacity-50">
          {format(new Date(note.updated_at), 'MMMM dd, yyyy, HH:mm')}
        </span>
      </div>
    </NavLink>
  );
}
