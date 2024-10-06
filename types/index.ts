import { Dispatch, SetStateAction } from "react";
import { RawEditorOptions } from "tinymce";

export interface UserInterface {
  id: string;
  authId: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  dateOfBirth: string;
  createdAt: string;
  updatedAt: string;
}
export interface MiniBlogInterface {
  id: string;
  title: string;
  summery: string;
  createdAt: string;
  updatedAt: string;
  user: UserInterface;
  tags: { tag: TagInterface }[];
  firstImage: string;
}

export interface UserProfileDataInterface {
  id: string;
  image: string;
  email: string;
  bio: string;
  dateOfBirth: string;
  name: string;
}

export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
export interface FullBlogInterface {
  id: string;
  title: string;
  content: string;
  tags: TagInterface[];
  summery: string;
  createdAt: string;
  updatedAt: string;
  user: UserInterface;
  isSaved: boolean;
  voting: string; //UP DOWN NULL
  savesCount: number;
  upvotesCount: number;
  downvotesCount: number;
}

export interface CommentInterface {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: UserInterface;
}

export interface BlogContnetInterface {
  title: string;
  content: string;
  deletedTags?: TagInterface[];
  tags: TagInterface[]; //ID OF TAG NOT TAG ITSELF;
  summery: string;
}

export interface EditorInterface {
  blog: BlogContnetInterface;
  setBlog: Dispatch<SetStateAction<BlogContnetInterface>>;
  setStatus: Dispatch<SetStateAction<string>>;
  config: RawEditorOptions & { selector?: undefined; target?: undefined };
  type: "title" | "content" | "summery";
}

export interface TagInterface {
  id: string;
  name: string;
  score: number;
}

export const titleConfig = {
  statusbar: false,
  toolbar_mode: "floating",
  menubar: false,
  toolbar: false,
  placeholder: "Title",
  plugins: "quickbars autoresize",
  skin: "borderless",
  branding: false,
  paste_data_images: false,
  paste_block_drop: true,
  paste_as_text: true,
  quickbars_insert_toolbar: "",
  quickbars_selection_toolbar: "bold italic h1 h2",
  content_style: `
  @import url('https://fonts.googleapis.com/css2?family=Tinos&display=swap'); body { font-family: 'Tinos', serif; font-size: 16pt; color: #292929;min-height:20px;}
    `,
} as RawEditorOptions & { selector?: undefined; target?: undefined };
export const summeryConfig = {
  statusbar: false,
  toolbar_mode: "floating",
  menubar: false,
  toolbar: false,
  placeholder: "Summary",
  min_height: 200,
  plugins: ["textpattern", "quickbars", "autoresize", "link"],
  skin: "borderless",
  branding: false,
  quickbars_selection_toolbar: "bold italic link | h1 h2 | blockquote",
  paste_data_images: false,
  paste_block_drop: true,
  paste_as_text: true,
  quickbars_insert_toolbar: "",
  content_style: ` 
  img,iframe{
    max-width:100%;
  }
  @import url('https://fonts.googleapis.com/css2?family=Tinos&display=swap'); body { font-family: 'Tinos', serif; font-size: 16pt; color: #292929;min-height:20px;}
  `,
} as RawEditorOptions & { selector?: undefined; target?: undefined };
export const readOnlyConfig = {
  statusbar: false,
  toolbar_mode: "floating",
  menubar: false,
  toolbar: false,
  placeholder: "Title",
  plugins: "autoresize",
  skin: "borderless",
  branding: false,
  readonly: true,
  content_style: `
  @import url('https://fonts.googleapis.com/css2?family=Tinos&display=swap'); body { font-family: 'Tinos', serif; font-size: 16pt; color: #292929;min-height:20px;}
    `,
} as RawEditorOptions & { selector?: undefined; target?: undefined };

export interface LabelInterface {
  option: TagInterface | UserInterface;
  type: string;
}
