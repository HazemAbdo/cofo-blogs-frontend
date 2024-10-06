import LoadMoreBlogs from "../../../components/feed/LoadMoreBlogs";
import { withPageAuthRequired, getAccessToken } from "@auth0/nextjs-auth0";
import { MiniBlogInterface } from "@types";

async function fetchBlogs(
  search = {
    tag: "",
    user: "",
  },
  token: string
) {
  try {
    const res = await fetch(
      `${process.env.BACKEND_BASE_URL}/blogs?page=${1}&pageSize=${10}
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

export default withPageAuthRequired(async function BlogsPage({ searchParams }) {
  // @ts-ignore
  const search = {
    // @ts-ignore
    tag:
      // @ts-ignore
      typeof searchParams?.filter === "string" &&
      // @ts-ignore
      searchParams?.filter === "tag" &&
      // @ts-ignore
      typeof searchParams?.id === "string"
        ? // @ts-ignore
          searchParams?.id
        : // @ts-ignore
          "",
    // @ts-ignore
    user:
      // @ts-ignore
      typeof searchParams?.filter === "string" &&
      // @ts-ignore
      searchParams?.filter === "user" &&
      // @ts-ignore
      typeof searchParams?.id === "string"
        ? // @ts-ignore
          searchParams?.id
        : // @ts-ignore
          "",
  };
  const { accessToken } = await getAccessToken();
  const intialBlogs = await fetchBlogs(search, accessToken as string);

  return (
    <>
      {intialBlogs && intialBlogs?.length > 0 && (
        <section className='flex flex-col justify-center max-w-6xl min-h-screen px-4 py-10 mx-auto sm:px-6'>
          <>
            <div className='flex flex-wrap items-center mb-8 justify-end'>
              <a
                href='/saves'
                className='block pb-1 mt-2 text-base font-black text-[#EAB308] uppercase border-b border-transparent hover:border-blue-600'
              >
                Go to Saves -&gt;
              </a>
            </div>
            <LoadMoreBlogs
              intialBlogs={intialBlogs}
              search={search}
              key='blogs section'
            />
          </>
        </section>
      )}
      {!intialBlogs ||
        (intialBlogs && !(intialBlogs.length > 0) && (
          <div className='px-4 mx-auto max-w-screen-xl lg:px-6 pt-20'>
            <div className='mx-auto max-w-screen-sm text-center'>
              <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-[#EAB308] dark:text-[#EAB308]'>
                OOOOOH
              </h1>
              <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
                Something missing.
              </p>
              <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
                {`There is no ${searchParams?.filter ? "search" : ""} results!`}
              </p>
              {searchParams?.filter ? (
                <a
                  href='/feed'
                  className='inline-flex text-white bg-[#EAB308] hover:bg-[#EAB308] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
                >
                  Back to feed
                </a>
              ) : (
                <a
                  href='/create-blog'
                  className='inline-flex text-white bg-[#EAB308] hover:bg-[#EAB308] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
                >
                  write a blog
                </a>
              )}
            </div>
          </div>
        ))}
    </>
  );
});
