"use client";
import React, { useState, Dispatch, SetStateAction } from "react";
import { useUserContext } from "@app/(pages)/context/user";
import { CommentInterface } from "@types";
import EmojiPicker from "./EmojiPicker";
import { ClickAwayListener } from "@mui/material";

export default function SendComment({
  blogId,
  comments,
  setComments,
}: {
  blogId: string;
  comments: CommentInterface[];
  setComments: Dispatch<SetStateAction<CommentInterface[] | undefined>>;
}) {
  const [comment, setComment] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setComment(event.target.value);
    if (event.target.value !== "") {
      setStatus("ready");
    } else {
      setStatus("notReady");
    }
  };
  const { baseUrl, token } = useUserContext();
  const handleCommentSubmit = async (content: string) => {
    if (content !== "") {
      fetch(`${baseUrl}/blogs/${blogId}/comments`, {
        method: "POST",
        body: JSON.stringify({
          content: content,
        }),
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          const res = response as Response;
          if (res.ok) {
            setComment("");
            res.json().then((val) => {
              const newComments = comments.slice();
              newComments.push(val.data.comment);
              setComments(newComments);
            });
          } else {
            console.log(`Request failed with status ${response.status}`);
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  };
  const [status, setStatus] = useState("notReady");
  return (
    <>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-lg lg:text-2xl font-bold text-gray-900 dark:text-white'>
          {`Discussion (${comments.length})`}
        </h2>
      </div>
      <form>
        <label htmlFor='chat' className='sr-only'>
          Your message
        </label>
        <div className='flex items-center px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 relative'>
          <button
            type='button'
            className='p-2 text-[#CE8F04] rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600'
            onClick={() => setShowPicker((prev) => !prev)}
          >
            <svg
              className='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 20 20'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z'
              />
            </svg>
            {showPicker && (
              <ClickAwayListener onClickAway={() => setShowPicker(false)}>
                <div className='absolute z-50 m-auto'>
                  <EmojiPicker
                    setComment={setComment}
                    setShowPicker={setShowPicker}
                  />
                </div>
              </ClickAwayListener>
            )}
            <span className='sr-only'>Add emoji</span>
          </button>
          <textarea
            id='chat'
            rows={5}
            className='block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Write a comment...'
            required
            onChange={handleCommentChange}
            value={comment}
          ></textarea>
          <button
            onClick={(e) => {
              e.preventDefault();
              handleCommentSubmit(comment);
            }}
            className='inline-flex justify-center p-2 text-[#CE8F04] rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600'
          >
            <svg
              className='w-5 h-5 rotate-90'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='currentColor'
              viewBox='0 0 18 20'
            >
              <path d='m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z' />
            </svg>
            <span className='sr-only'>Send message</span>
          </button>
        </div>
      </form>
    </>
  );
}
