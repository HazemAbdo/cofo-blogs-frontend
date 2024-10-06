import LoadMoreSaves from "@components/saves/LoadMoreSaves";
import { getAccessToken, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { MiniBlogInterface } from "@types";

async function fetchSaves(
  search = {
    tag: "",
    username: "",
  },
  token: string
) {
  try {
    const res = await fetch(
      `${
        process.env.BACKEND_BASE_URL
      }/blogs/save/list?page=${1}&pageSize=${10}${
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

export default withPageAuthRequired(async function SavesPage({ searchParams }) {
  // @ts-ignore
  const search = {
    // @ts-ignore
    tag: typeof searchParams?.tag === "string" ? searchParams.tag : "",
    // @ts-ignore
    username:
      // @ts-ignore
      typeof searchParams?.username === "string" ? searchParams.username : "",
  };

  const { accessToken } = await getAccessToken();
  const intialSaves = await fetchSaves(search, accessToken as string);
  return (
    <>
      {intialSaves && intialSaves?.length > 0 && (
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
            <LoadMoreSaves
              intialSaves={intialSaves}
              search={search}
              key='blogs section'
            />
          </>
        </section>
      )}
      {!intialSaves ||
        (intialSaves && !(intialSaves.length > 0) && (
          <div className='px-4 mx-auto max-w-screen-xl lg:px-6 pt-20'>
            <div className='mx-auto max-w-screen-sm text-center'>
              <h1 className='mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-[#EAB308] dark:text-[#EAB308]'>
                OOOOOH
              </h1>
              <p className='mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white'>
                Something missing.
              </p>
              <p className='mb-4 text-lg font-light text-gray-500 dark:text-gray-400'>
                There is no saves results!
              </p>
              <a
                href='/feed'
                className='inline-flex text-white bg-[#EAB308] hover:bg-[#EAB308] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4'
              >
                Back to feed
              </a>
            </div>
          </div>
        ))}
    </>
  );
});
