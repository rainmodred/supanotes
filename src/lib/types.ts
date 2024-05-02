export interface INote {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  body: string;
  user_id: string;
}

export interface ITag {
  id: string;
  name: string;
  user_id: string;
}
