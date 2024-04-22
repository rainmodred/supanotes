import { Editor } from '@/components/editor';
import { useLoaderData, Form } from 'react-router-dom';

// export async function loader({ params }) {
//   const note = await getNote(params.noteId);
//   if (!note) throw new Response('', { status: 404 });
//   return note;
// }

// export async function action({ params }) {
//   await deleteNote(params.noteId);
//   return redirect('/new');
// }

export function Note() {
  // const note = useLoaderData();
  // return (
  //   <div>
  //     <Markdown className="p-4">{md}</Markdown>
  //     {/* <h2></h2>
  //     <div></div>
  //     <Form method="post" style={{ marginTop: '2rem' }}>
  //       <button type="submit">Delete</button>
  //     </Form> */}
  //   </div>
  // );
  return <Editor />;
}
