import { FullBlogInterface } from "@types";
import dynamic from "next/dynamic";
import BlogWrapper from "@components/blog/BlogWrapper";
import Image from "next/image";
import IconsGroup from "@components/blog/IconsGroup";
const Comments = dynamic(() => import("@components/blog/comments/Comments"), {
  ssr: false,
});
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { distanceToNow } from "@utils/utils";
import { Chip } from "@mui/material";

async function fetchComments(page: number, token: string, blogId: string) {
  try {
    const res = await fetch(
      `${
        process.env.BACKEND_BASE_URL
      }/blogs/${blogId}/comments?page=${page}&pageSize=${10}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await res.json();
    return data.data.comments;
  } catch (error) {
    console.log("fetchComments ~ error:", error);
  }
}

async function fetchBlogData(blogId: string, token: string) {
  try {
    const res = await fetch(`${process.env.BACKEND_BASE_URL}/blogs/${blogId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    return data.data.blog as FullBlogInterface;
  } catch (error) {
    console.log("fetchBlogData ~ error:", error);
  }
}

export default withPageAuthRequired(async function BlogFullView({ params }) {
  // @ts-ignore
  const { blogId } = params;
  const { accessToken } = await getAccessToken();
  const blog = (await fetchBlogData(
    blogId,
    accessToken as string
  )) as unknown as FullBlogInterface;
  const intialComments = await fetchComments(1, accessToken as string, blogId);
  return (
    <>
      {blog && (
        <BlogWrapper>
          <div className=' pb-16 lg:pb-24 bg-white dark:bg-gray-900 antialiased mt-10 max-lg:px-5'>
            <div className='flex justify-between px-4 mx-auto max-w-screen-xl '>
              <article className='mx-auto w-full max-w-2xl format format-sm sm:format-base lg:format-lg format-blue dark:format-invert '>
                <header className='mb-4 lg:mb-6 not-format'>
                  <div
                    dangerouslySetInnerHTML={{ __html: blog.title }}
                    className='prose lg:prose-xl mb-4 '
                  />
                  <address className='flex items-center mb-6 not-italic'>
                    <div className='inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white'>
                      <Image
                        className='mr-4 w-16 h-16 rounded-full'
                        src={blog.user.image || "/assets/icons/person.svg"}
                        alt={`${blog.user.name || ""} image`}
                        width={64}
                        height={64}
                      />
                      <div>
                        <a
                          href='#'
                          rel='author'
                          className='text-xl font-bold text-gray-900 dark:text-white'
                        >
                          {blog.user.name || ""}
                        </a>
                        <p className='text-base text-gray-500 dark:text-gray-400'>
                          {blog.user.bio || ""}
                        </p>
                        <p className='text-base text-gray-500 dark:text-gray-400'>
                          <time
                            dateTime='2022-02-08'
                            title='February 8th, 2022'
                          >
                            {distanceToNow(blog.updatedAt)}
                          </time>
                        </p>
                      </div>
                    </div>
                  </address>
                </header>
                <IconsGroup blog={blog} />
                <div className='blog-body flex flex-col gap-5'>
                  <div
                    className='prose lg:prose-xl'
                    dangerouslySetInnerHTML={{ __html: blog.summery }}
                  />
                  <div
                    className='prose lg:prose-xl'
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                </div>

                <div className='tags-container flex mt-5 gap-4 flex-wrap'>
                  {blog.tags &&
                    blog.tags.map((t) => <Chip label={t.name} key={t.id} />)}
                </div>
                <Comments intialComments={intialComments} blogId={blogId} />
              </article>
            </div>
          </div>
        </BlogWrapper>
      )}
    </>
  );
});
