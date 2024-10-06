"use client";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, Fragment } from "react";
import BlogCard from "@components/feed/BlogCard";
import { MiniBlogInterface } from "@types";
import { useUserContext } from "@app/(pages)/context/user";
import Spinner from "@components/Spinner";

async function fetchBlogs(
  search = {
    tag: "",
    user: "",
  },
  token: string,
  page: number,
  baseUrl: string
) {
  try {
    const res = await fetch(
      `${baseUrl}/blogs?page=${page}&pageSize=${10}
      ${
        search.tag !== ""
          ? `&filter=tag&id=${search.tag}`
          : search.user !== ""
          ? `&filter=user&id=${search.user}`
          : ""
      }
      `,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const blogs = await res.json();
    return blogs.data.blogs as MiniBlogInterface[];
  } catch (error) {
    console.log("error in fetching blogs in feed", error);
  }
}
export default function LoadMoreBlogs({
  search,
  intialBlogs,
}: {
  search: {
    tag: string;
    user: string;
  };
  intialBlogs: MiniBlogInterface[] | undefined;
}) {
  const [blogs, setBlogs] = useState<MiniBlogInterface[] | undefined>(
    intialBlogs
  );
  const { token, baseUrl } = useUserContext();
  const [page, setPage] = useState<number>(1);
  const [ref, inView] = useInView();

  useEffect(() => {
    async function loadMoreBlogs() {
      const next = page + 1;
      const blogs = await fetchBlogs(search, token, next, baseUrl);
      if (blogs?.length) {
        setPage(next);
        setBlogs((prev: MiniBlogInterface[] | undefined) => [
          ...(prev?.length ? prev : []),
          ...blogs,
        ]);
      }
    }
    if (inView) {
      loadMoreBlogs();
    }
  }, [inView, page, search, token, baseUrl]);
  if (Array.isArray(blogs)) {
    return (
      <>
        <div className='flex flex-wrap min-h-full'>
          {blogs?.map((blog) => (
            <Fragment key={blog.id}>
              <BlogCard blog={blog} />
            </Fragment>
          ))}
        </div>
        <Spinner myRef={ref} />
      </>
    );
  }
}
