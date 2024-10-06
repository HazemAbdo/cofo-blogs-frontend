import React, { EventHandler, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { EditorInterface } from "@types";
import Spinner from "@components/Spinner";

const EditorComponent = ({
  setBlog,
  setStatus,
  blog,
  config,
  type,
}: EditorInterface) => {
  // const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  return (
    <div className='flex flex-col justify-center'>
      {loading && <Spinner />}
      <input
        id='my-file'
        type='file'
        name='my-file'
        style={{ display: "none" }}
      />
      <Editor
        // onInit={(evt, editor) => (editorRef.current = editor)}
        onInit={() => {
          setLoading(false);
        }}
        value={
          type === "title"
            ? blog.title
            : type === "content"
            ? blog.content
            : blog.summery
        }
        onEditorChange={(e) => {
          if (type === "title") {
            setBlog({
              ...blog,
              title: e,
            });
            if (blog.content !== "" && blog.summery !== "" && e !== "") {
              setStatus("ready");
            } else {
              setStatus("notReady");
            }
          } else if (type === "content") {
            setBlog({
              ...blog,
              content: e,
            });
            if (e !== "" && blog.summery !== "" && blog.title !== "") {
              setStatus("ready");
            } else {
              setStatus("notReady");
            }
          } else {
            setBlog({
              ...blog,
              summery: e,
            });
            if (blog.content !== "" && e !== "" && blog.title !== "") {
              setStatus("ready");
            } else {
              setStatus("notReady");
            }
          }
        }}
        init={config}
      />
    </div>
  );
};
export default EditorComponent;
