import Tags from "@components/create-blog/Tags";
import { MiniBlogInterface } from "@types";
import { useEffect, useState } from "react";
const BlogCard = ({ blog }: { blog: MiniBlogInterface }) => {
  const [summaryAndTitle, setSummaryAndTitle] = useState({
    words: "",
    title: "",
  });
  useEffect(() => {
    let tempElement = document.createElement("div");
    tempElement.innerHTML = blog.summery;
    let textContent = tempElement.textContent as string;
    setSummaryAndTitle((prevState) => ({
      ...prevState,
      words: textContent.split(" ").slice(0, 25).join(" ") + " ...",
    }));
    tempElement.innerHTML = blog.title;
    textContent = tempElement.textContent as string;
    setSummaryAndTitle((prevState) => ({
      ...prevState,
      title: (textContent.split(" ").slice(0, 15).join(" ") + " ...") as string,
    }));
  }, [blog.summery, blog.title]);
  return (
    <div className='max-w-full mb-8 sm:w-1/2 px-4 lg:w-1/3 flex flex-col transition duration-300 hover:scale-105 w-full'>
      <div className='img w-full bg-gradient-to-br from-[#FEFDF1] to-[#EAB308] '>
        <img
          src={blog.firstImage || "/assets/images/cofo/SVGLogoMono.svg"}
          alt='blog img'
          className='object-fill h-48 w-full'
        />
      </div>
      <div className='flex flex-col h-full justify-between px-4 py-6 bg-white border border-gray-400 text w-full max-h-fit'>
        <div>
          <div className='mb-4 text-xs font-bold capitalize flex-row flex gap-2 flex-wrap'>
            {blog.tags &&
              blog.tags.length > 0 &&
              blog.tags.map((t, index) => (
                <p
                  key={index}
                  className='border-b-2 border-blue-600 hover:text-blue-600 whitespace-nowrap'
                >
                  {t.tag.name}
                </p>
              ))}
          </div>
          <a href={`/blog/${blog.id}`}>
            <h2 className='block mb-4 text-xl font-black leading-tight hover:underline hover:text-blue-600  h-fit break-words '>
              {summaryAndTitle.title}
            </h2>
          </a>
          <p className='mb-4 break-words '>{summaryAndTitle.words}</p>
        </div>
        <div>
          <a
            href={`/blog/${blog.id}`}
            className='inline-block pb-1 mt-2 text-base font-black text-blue-600 uppercase border-b border-transparent hover:border-blue-600'
          >
            Read More -&gt;
          </a>
        </div>
      </div>
    </div>
  );
};
export default BlogCard;
