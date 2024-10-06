"use client";
import { useUserContext } from "@app/(pages)/context/user";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  BookmarkIcon,
  EllipsisHorizontalIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Dispatch, Fragment, SetStateAction, useState } from "react";
import DeleteBlogWarning from "./DeleteBlogWarning";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { FullBlogInterface } from "@types";
const IconsGroup = ({ blog }: { blog: FullBlogInterface }) => {
  const { baseUrl, token } = useUserContext();
  const [saved, setSaved] = useState<boolean>(blog.isSaved);
  const [vote, setVote] = useState<string>(blog.voting);
  const [upCount, setUpCount] = useState<number>(blog.upvotesCount || 0);
  const [downCount, setDownCount] = useState<number>(blog.downvotesCount || 0);
  const router = useRouter();
  const { user } = useUser();
  const [showDeleteBlogWarning, setShowDeleteBlogWarning] =
    useState<boolean>(false);

  function cancelDelete() {
    setShowDeleteBlogWarning(false);
  }
  async function handleSave(
    saved: boolean,
    id: string,
    setSaved: Dispatch<SetStateAction<boolean>>
  ) {
    if (saved) {
      fetch(`${baseUrl}/blogs/save/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          const res = response as unknown as Response;
          if (res.status === 200) {
            setSaved(false);
          } else {
            throw new Error(`Request failed with status ${res.status}`);
          }
        })

        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      fetch(`${baseUrl}/blogs/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: blog.id,
        }),
      })
        .then((response) => {
          const res = response as unknown as Response;
          if (res.status === 201) {
            setSaved(true);
          } else {
            throw new Error(`Request failed with status ${res.status}`);
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }
  async function handleVoting(
    id: string,
    prevVote: string,
    setVote: Dispatch<SetStateAction<string>>,
    newVote: string
  ) {
    if (prevVote === "Null") {
      fetch(`${baseUrl}/Blogvote`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: id,
          voteType: newVote,
        }),
      })
        .then((response) => {
          const res = response as unknown as Response;
          if (res.status === 201) {
            setVote(newVote);
            if (newVote === "UPVOTE") {
              setUpCount((prev) => prev + 1);
            } else if (newVote === "DOWNVOTE") {
              setDownCount((prev) => prev + 1);
            }
          } else {
            throw new Error(`Request failed with status ${res.status}`);
          }
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    } else if (prevVote === newVote) {
      fetch(`${baseUrl}/Blogvote/${blog.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          const res = response as unknown as Response;

          if (res.status === 200) {
            setVote("Null");
            if (prevVote === "UPVOTE") {
              setUpCount((prev) => (prev <= 0 ? 0 : prev - 1));
            } else if (newVote === "DOWNVOTE") {
              setDownCount((prev) => (prev <= 0 ? 0 : prev - 1));
            }
          } else {
            throw new Error(`Request failed with status ${res.status}`);
          }
        })

        .catch((error) => {
          console.log("Error:", error);
        });
    } else {
      fetch(`${baseUrl}/Blogvote`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blogId: id,
          voteType: newVote,
        }),
      })
        .then((response) => {
          const res = response as unknown as Response;
          if (res.status === 201) {
            setVote(newVote);
            if (newVote === "UPVOTE") {
              setUpCount((prev) => prev + 1);
              setDownCount((prev) => prev - 1);
            } else if (newVote === "DOWNVOTE") {
              setDownCount((prev) => prev + 1);
              setUpCount((prev) => prev - 1);
            }
          } else {
            throw new Error(`Request failed with status ${res.status}`);
          }
        })

        .catch((error) => {
          console.log("Error:", error);
        });
    }
  }
  async function handleDelete() {
    fetch(`${baseUrl}/blogs/${blog.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const res = response as unknown as Response;
        if (res.status === 200) {
          router.push("/feed");
        } else {
          throw new Error(`Request failed with status ${res.status}`);
        }
      })

      .catch((error) => {
        console.log("Error:", error);
      });
  }

  return (
    <>
      <div className='flex flex-row justify-between w-full my-5 px-5 max-md:mx-auto'>
        <div className=' flex flex-row gap-2'>
          <button
            className='flex items-center justify-center w-8 h-8 text-sm font-medium focus:outline-none'
            onClick={() => handleSave(saved, blog.id, setSaved)}
          >
            <BookmarkIcon
              width={25}
              height={25}
              fill={saved ? "#D69A06" : "none"}
              color='#D69A06'
            />
          </button>
          {/* <button
            className='flex items-center justify-center w-8 h-8 text-sm font-medium   focus:outline-none'
            onClick={() => {
              handleVoting(blog.id, vote, setVote, "UPVOTE");
            }}
          >
            <HandThumbUpIcon
              width={25}
              height={25}
              fill={vote === "UPVOTE" ? "#D69A06" : "none"}
              color='#D69A06'
            />
          </button> */}
          {/* <button
            className='flex items-center justify-center w-8 h-8 text-sm font-medium  focus:outline-none'
            onClick={() => handleVoting(blog.id, vote, setVote, "DOWNVOTE")}
          >
            <HandThumbDownIcon
              width={25}
              height={25}
              fill={vote === "DOWNVOTE" ? "#D69A06" : "none"}
              color='#D69A06'
            />
          </button> */}
          <div className='flex gap-2'>
            <button
              className='py-1.5 px-3 hover:text-green-600 hover:scale-105 hover:shadow text-center border rounded-md border-gray-400 h-8 text-sm flex items-center gap-1 lg:gap-2'
              onClick={() => {
                handleVoting(blog.id, vote, setVote, "UPVOTE");
              }}
            >
              <svg
                className='w-4 h-4'
                xmlns='http://www.w3.org/2000/svg'
                fill={vote === "UPVOTE" ? "#D69A06" : "none"}
                color='#D69A06'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z'
                ></path>
              </svg>
              <span>{upCount}</span>
            </button>

            <button
              className='py-1.5 px-3 hover:text-red-600 hover:scale-105 hover:shadow text-center border rounded-md border-gray-400 h-8 text-sm flex items-center gap-1 lg:gap-2'
              onClick={() => handleVoting(blog.id, vote, setVote, "DOWNVOTE")}
            >
              <svg
                className='w-4 h-4'
                xmlns='http://www.w3.org/2000/svg'
                fill={vote === "DOWNVOTE" ? "#D69A06" : "none"}
                color='#D69A06'
                viewBox='0 0 24 24'
                strokeWidth='1.5'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384'
                ></path>
              </svg>
              <span>{downCount}</span>
            </button>
          </div>
        </div>
        {
          //TODO change it with real userId from backend
          blog.user.authId === user?.sub && (
            <PopupState variant='popover' popupId='demo-popup-menu'>
              {(popupState) => (
                <Fragment>
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
                        setShowDeleteBlogWarning(true);
                      }}
                    >
                      Delete
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        popupState.close();
                        router.push(`/edit-blog/${blog.id}`);
                      }}
                    >
                      Edit
                    </MenuItem>
                  </Menu>
                </Fragment>
              )}
            </PopupState>
          )
        }
      </div>
      <DeleteBlogWarning
        onCancel={cancelDelete}
        onDelete={handleDelete}
        showDeleteBlogWarning={showDeleteBlogWarning}
      />
    </>
  );
};

export default IconsGroup;
