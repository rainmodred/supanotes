import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Eye, Pencil, RefreshCw, Trash2 } from 'lucide-react';

interface Props {
  mode: 'edit' | 'read';
  onChangeMode: () => void;
  onDelete: () => void;
  isLoading: boolean;
}
export function EditorControls({
  mode,
  isLoading,
  onDelete,
  onChangeMode,
}: Props) {
  return (
    <>
      <Button
        type="button"
        size="icon"
        variant="outline"
        onClick={onChangeMode}
      >
        {mode === 'edit' && <Pencil size="16" />}
        {mode === 'read' && <Eye size="16" />}
      </Button>
      <div className="flex h-10 w-10 items-center justify-center border border-input bg-background">
        <RefreshCw
          size="16"
          data-testid="loading"
          className={cn({
            'animate-spin': isLoading,
          })}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        size="icon"
        name="intent"
        value="delete-note"
        data-testid="delete-note"
        onClick={onDelete}
      >
        <Trash2 size="16" />
      </Button>
    </>
  );
}
