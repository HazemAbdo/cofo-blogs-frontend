"use client";
import { useState } from "react";
import { BlogContnetInterface } from "@types";
import { summeryConfig, titleConfig } from "@types";
import EditorComponent from "@components/create-blog/Editor";
import Tags from "@components/create-blog/Tags";
import { Dialog } from "@mui/material";
import Spinner from "@components/Spinner";
export default function CreateBlogForm({
  token,
  baseUrl,
  s3Url,
}: {
  token: string;
  baseUrl: string;
  s3Url: string;
}) {
  const [blog, setBlog] = useState<BlogContnetInterface>({
    title: "",
    content: "",
    tags: [],
    summery: "",
  });
  const [status, setStatus] = useState<string>("notReady");
  const [imageUploaded, setImageUploaded] = useState("idle");
  const publishBlog = async () => {
    fetch(`${baseUrl}/blogs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: blog.title,
        content: blog.content,
        tags: blog.tags.map((t) => t.id),
        summery: blog.summery,
      }),
    })
      .then((response) => {
        const res = response as unknown as Response;
        if (res.status === 201) {
          //@ts-ignore
          window.location = `/feed`;
        } else {
          throw new Error(`Request failed with status ${res.status}`);
        }
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div className='creat-blog w-3/5 max-lg:w-full max-lg:px-5 m-auto mt-10 flex flex-col gap-5'>
      {imageUploaded === "uploading" && (
        <Dialog
          open={imageUploaded == "uploading"}
          onClose={() => setImageUploaded("idle")}
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
            },
          }}
        >
          <Spinner />
        </Dialog>
      )}
      <EditorComponent
        type='title'
        key={"title-editor"}
        blog={blog}
        setBlog={setBlog}
        setStatus={setStatus}
        config={titleConfig}
      />
      <EditorComponent
        type='summery'
        key={"content-summery"}
        blog={blog}
        setBlog={setBlog}
        setStatus={setStatus}
        config={summeryConfig}
      />
      <EditorComponent
        blog={blog}
        setBlog={setBlog}
        type='content'
        setStatus={setStatus}
        key={"content-editor"}
        config={{
          statusbar: false,
          toolbar_mode: "floating",
          menubar: false,
          toolbar: false,
          min_height: 500,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "charmap",
            "preview",
            "searchreplace",
            "visualblocks",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "textpattern",
            "codesample",
            "image ",
            "media ",
            "table ",
            "anchor ",
            "pagebreak ",
            "quickbars",
            "autoresize",
          ],
          textpattern_patterns: [
            { start: "*", end: "*", format: "italic" },
            { start: "**", end: "**", format: "bold" },
            { start: "#", format: "h1" },
            { start: "##", format: "h2" },
            { start: "###", format: "h3" },
            { start: "####", format: "h4" },
            { start: "#####", format: "h5" },
            { start: "######", format: "h6" },
            { start: "1. ", cmd: "InsertOrderedList" },
            { start: "* ", cmd: "InsertUnorderedList" },
            { start: "- ", cmd: "InsertUnorderedList" },
            { start: "//brb", replacement: "Be Right Back" },
          ],
          codesample_languages: [
            { text: "HTML/XML", value: "markup" },
            { text: "JavaScript", value: "javascript" },
            { text: "CSS", value: "css" },
            { text: "PHP", value: "php" },
            { text: "Ruby", value: "ruby" },
            { text: "Python", value: "python" },
            { text: "Java", value: "java" },
            { text: "C", value: "c" },
            { text: "C#", value: "csharp" },
            { text: "C++", value: "cpp" },
          ],
          file_browser_callback_types: "image",
          file_picker_callback: async function (callback, value, meta) {
            if (meta.filetype === "image") {
              let input = document.getElementById(
                "my-file"
              ) as HTMLInputElement;
              input.click();
              input.onchange = async function () {
                let file = input.files ? input.files[0] : null;
                if (!file) return;
                let uploadURL = "";
                setImageUploaded("uploading");
                const dialogWrap = document.querySelector(
                  ".tox-dialog-wrap"
                ) as HTMLElement;
                if (dialogWrap) {
                  dialogWrap.style.visibility = "hidden";
                }
                try {
                  let preSignedUrlResponse = await fetch(s3Url, {
                    method: "POST",
                    body: JSON.stringify({
                      Filetype: file.type,
                      Filename: file.name,
                    }),
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "application/json",
                    },
                  });
                  const presignedBody = await preSignedUrlResponse.json();
                  uploadURL = presignedBody.uploadURL;
                } catch (error) {
                  console.log("error in getting presigned url:", error);
                }

                try {
                  console.log("uploadURL:", uploadURL);
                  let uploadResponse = await fetch(uploadURL, {
                    method: "PUT",
                    body: file,
                    headers: {
                      "Content-Type": file.type,
                    },
                  });
                  if (uploadResponse.status === 200) {
                    dialogWrap.style.visibility = "visible";
                    setImageUploaded("idle");
                    callback(uploadResponse.url.split("?Content-Type")[0], {
                      alt: file.name,
                    });
                  } else {
                    dialogWrap.style.visibility = "visible";
                    setImageUploaded("idle");
                    console.error("error in uploading image to s3 bucket");
                  }
                } catch (error) {
                  dialogWrap.style.visibility = "visible";
                  setImageUploaded("idle");
                  console.log("error in uploading image to s3 bucket:", error);
                }
              };
            }
          },
          paste_data_images: true,
          skin: "snow",
          content_style: `
            img,iframe{
              max-width:100%;
            }
            @import url('https://fonts.googleapis.com/css2?family=Tinos&display=swap'); body { font-family: 'Tinos', serif; font-size: 16pt; color: #292929;min-height:20px;}
          `,
          placeholder: "Tell your story...",
          quickbars_selection_toolbar:
            "bold italic link | h1 h2 | blockquote codesample",
          quickbars_insert_toolbar: "image table codesample | link",
        }}
      />
      <Tags setBlog={setBlog} blog={blog} />
      <button
        disabled={status == "ready" ? false : true}
        className='text-white bg-[#742F23] hover:bg-[#d13821] focus:ring-4 focus:outline-none focus:ring-[#d13821] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#742F23] dark:hover:bg-[#d13821] dark:focus:ring-[#d13821] w-[200px] m-auto disabled:bg-white'
        onClick={(e) => {
          e.preventDefault();
          publishBlog();
        }}
      >
        Publish
      </button>
    </div>
  );
}
