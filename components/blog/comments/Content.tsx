import { useUserContext } from "@app/(pages)/context/user";
import React, { useState } from "react";

export function ContentEdit({
  commentId,
  contentToEdit,
  setContent,
  setIsEditing,
}: {
  contentToEdit: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  commentId: string;
}) {
  const handleContentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };
  const { token, baseUrl } = useUserContext();

  const handleEditSubmit = async (content: string) => {
    fetch(`${baseUrl}/blogs/comments/${commentId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: content,
      }),
    })
      .then((response) => {
        const res = response as unknown as Response;
        if (res.status === 200) {
          setIsEditing(false);
        } else {
          throw new Error(`Request failed with status ${res.status}`);
        }
      })

      .catch((error) => {
        console.log("Error:", error);
      });
  };

  return (
    <div className='m-3 flex flex-col'>
      <textarea
        onChange={handleContentChange}
        value={contentToEdit}
        rows={5}
        className='bg-White border resize-none border-Light-gray py-2 px-5 rounded-md placeholder:text-start text-Grayish-Blue '
        placeholder='Add a comment...'
      />
      <div className='flex justify-end my-4'>
        <button
          onClick={() => {
            handleEditSubmit(contentToEdit);
          }}
          className='bg-Moderate-blue px-3 py-1 rounded-md hover:opacity-50 bg-blue-500 text-white'
        >
          UPDATE
        </button>
      </div>
    </div>
  );
}
const Content = ({
  commenId,
  setIsEditing,
  content,
  isEditing,
}: {
  commenId: string;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  content: string;
  isEditing: boolean;
}) => {
  const [text, setText] = useState(content);
  return (
    <>
      {(!isEditing && (
        <p className='text-Grayish-Blue my-3 break-words'>{text}</p>
      )) || (
        <ContentEdit
          commentId={commenId}
          contentToEdit={text}
          setContent={setText}
          setIsEditing={setIsEditing}
        />
      )}
    </>
  );
};

export default Content;
