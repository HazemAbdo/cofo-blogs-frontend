"use client";
import dynamic from "next/dynamic";
const SendComment = dynamic(() => import("./SendComment"), { ssr: false });
import CommentCard from "./CommentCard";
import { CommentInterface } from "@types";
import { useInView } from "react-intersection-observer";
import { useState, useEffect } from "react";
import { useUserContext } from "@app/(pages)/context/user";
import Spinner from "@components/Spinner";

export async function fetchComments(
  page: number,
  blogId: string,
  token: string,
  baseUrl: string
) {
  fetch(`${baseUrl}/blogs/${blogId}/comments?page=${page}&pageSize=${10}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    .then((data) => {
      return data.data.comments;
    })
    .catch((error) => {
      console.log(error);
    });
}

export default function Comments({
  intialComments,
  blogId,
}: {
  intialComments: CommentInterface[];
  blogId: string;
}) {
  const [comments, setComments] = useState<CommentInterface[] | undefined>(
    intialComments
  );
  const [page, setPage] = useState<number>(1);
  const [ref, inView] = useInView();
  const { token, baseUrl } = useUserContext();

  useEffect(() => {
    async function loadMoreComments() {
      const next = page + 1;
      const comments = (await fetchComments(
        next,
        blogId,
        token,
        baseUrl
      )) as unknown as CommentInterface[];
      if (comments?.length) {
        setPage(next);
        setComments((prev: CommentInterface[] | undefined) => [
          ...(prev?.length ? prev : []),
          ...comments,
        ]);
      }
    }
    if (inView) {
      loadMoreComments();
    }
  }, [inView, blogId, page, token, baseUrl]);

  return (
    <div className='font-rubik py-5 flex justify-center'>
      <section className='flex flex-col justify-center w-full'>
        <SendComment
          blogId={blogId}
          comments={comments as CommentInterface[]}
          setComments={setComments}
        />
        <div className='comments-container flex flex-col justify-center p-2'>
          {(comments?.length as number) > 0 && (
            <>
              {comments
                ?.sort(
                  (a, b) =>
                    new Date(b.updatedAt).valueOf() -
                    new Date(a.createdAt).valueOf()
                )
                .map((comment) => (
                  <CommentCard
                    comment={comment}
                    key={comment.id}
                    blogId={blogId}
                    comments={comments}
                    setComments={setComments}
                  />
                ))}
              <Spinner myRef={ref} />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
