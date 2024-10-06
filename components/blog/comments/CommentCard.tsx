"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import DeleteWarning from "./DeleteWarning";
import Image from "next/image";
import { CommentInterface } from "@types";
import { distanceToNow } from "@utils/utils";
import Content from "./Content";
import { useUserContext } from "@app/(pages)/context/user";
import { useUser } from "@auth0/nextjs-auth0/client";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";

export default function CommentCard({
  comment,
  blogId,
  comments,
  setComments,
}: {
  comment: CommentInterface;
  blogId: string;
  comments: CommentInterface[];
  setComments: Dispatch<SetStateAction<CommentInterface[] | undefined>>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const { user } = useUser();
  function handleShowWarning() {
    setShowDeleteWarning(true);
  }

  async function confirmDelete(
    token: string,
    commentId: string,
    baseUrl: string,
    comments: CommentInterface[],
    setComments: Dispatch<SetStateAction<CommentInterface[] | undefined>>
  ) {
    fetch(`${baseUrl}/blogs/${blogId}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const res = response as unknown as Response;
        if (res.status === 200) {
          const res = response as unknown as Response;
          setIsVisible(false);
          setShowDeleteWarning(false);
          setComments((prev) => prev?.filter((c) => c.id !== commentId));
        } else {
          throw new Error(`Request failed with status ${res.status}`);
        }
        return res.json();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }

  function cancelDelete() {
    setShowDeleteWarning(false);
  }

  function editComment() {
    setIsEditing(true);
  }

  const { token, baseUrl } = useUserContext();

  return (
    <>
      <DeleteWarning
        onCancel={cancelDelete}
        onDelete={() =>
          confirmDelete(token, comment.id, baseUrl, comments, setComments)
        }
        showDeleteWarning={showDeleteWarning}
      />

      {isVisible && (
        <div key={comment.id}>
          <article className=' text-base bg-white border-t border-gray-200 dark:border-gray-700 dark:bg-gray-900 justify-between transition duration-300 hover:scale-105'>
            <div className='flex justify-between items-center mb-2'>
              <div className='flex items-center mt-2'>
                <p className='inline-flex items-center mr-3 font-semibold text-sm text-gray-900 dark:text-white whitespace-nowrap'>
                  <Image
                    className='mr-2 w-6 h-6 rounded-full'
                    src={comment.user.image || "/assets/icons/person.svg"}
                    alt='Bonnie Green'
                    width={24}
                    height={24}
                  />
                  {comment.user.name || "Username"}
                </p>
                <p className='text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap'>
                  {distanceToNow(comment.updatedAt)}
                </p>
              </div>
              {comment.user.authId === user?.sub && (
                <PopupState variant='popover' popupId='demo-popup-menu'>
                  {(popupState) => (
                    <React.Fragment>
                      <Button {...bindTrigger(popupState)}>
                        <EllipsisHorizontalIcon
                          height={25}
                          width={25}
                          color='#CE8F04'
                        />
                      </Button>
                      <Menu {...bindMenu(popupState)}>
                        <MenuItem
                          onClick={() => {
                            popupState.close();
                            handleShowWarning();
                          }}
                        >
                          Delete
                        </MenuItem>
                        <MenuItem
                          onClick={() => {
                            popupState.close();
                            editComment();
                          }}
                        >
                          Edit
                        </MenuItem>
                      </Menu>
                    </React.Fragment>
                  )}
                </PopupState>
              )}
            </div>
            <Content
              commenId={comment.id}
              setIsEditing={setIsEditing}
              content={comment.content}
              isEditing={isEditing}
            />
          </article>
        </div>
      )}
    </>
  );
}
