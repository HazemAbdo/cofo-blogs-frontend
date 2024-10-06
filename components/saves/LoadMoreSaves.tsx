"use client";
import { useInView } from "react-intersection-observer";
import { useState, useEffect, Fragment } from "react";
import BlogCard from "@components/feed/BlogCard";
import { MiniBlogInterface } from "@types";
import { useUserContext } from "@app/(pages)/context/user";
import Spinner from "@components/Spinner";
async function fetchSaves(
  search = {
    tag: "",
    username: "",
  },
  token: string,
  page: number,
  baseUrl: string
) {
  try {
    const res = await fetch(
      `${baseUrl}/blogs/save/list?page=${page}&pageSize=${10}${
        search.tag !== ""
          ? `&filter=tag&id=${search.tag}`
          : search.username !== ""
          ? `&filter=username&id=${search.username}`
          : ""
      }`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const saves = await res.json();
    return saves.data.savedList.map(
      (item: { blog: MiniBlogInterface }) => item.blog
    ) as MiniBlogInterface[];
  } catch (error) {
    console.log("error in fetching blogs in saves", error);
  }
}
export default function LoadMoreSaves({
  search,
  intialSaves,
}: {
  search: {
    tag: string;
    username: string;
  };
  intialSaves: MiniBlogInterface[] | undefined;
}) {
  const [saves, setSaves] = useState<MiniBlogInterface[] | undefined>(
    intialSaves
  );
  const [page, setPage] = useState<number>(1);
  const [ref, inView] = useInView();
  const { token, baseUrl } = useUserContext();

  useEffect(() => {
    async function loadMoreSaves() {
      const next = page + 1;
      const saves = (await fetchSaves(
        search,
        token,
        next,
        baseUrl
      )) as unknown as MiniBlogInterface[];
      if (saves?.length) {
        setPage(next);
        setSaves((prev: MiniBlogInterface[] | undefined) => [
          ...(prev?.length ? prev : []),
          ...saves,
        ]);
      }
    }
    if (inView) {
      loadMoreSaves();
    }
  }, [inView, page, search, token, baseUrl]);

  if (Array.isArray(saves)) {
    return (
      <>
        <div className='saves-container min-h-full mt-10 flex flex-wrap -mx-4'>
          {saves?.map((blog) => (
            <Fragment key={blog.id}>
              <BlogCard blog={blog} />
            </Fragment>
          ))}
        </div>
        {/* <MySkeleton ref={ref} /> */}
        <Spinner myRef={ref} />
      </>
    );
  }
}
