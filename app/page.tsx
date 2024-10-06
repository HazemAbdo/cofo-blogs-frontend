"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function SIgnUpPage() {
  const router = useRouter();
  const { user } = useUser();
  if (user) {
    router.push("/feed");
  }

  return (
    <section className='items-center  max-lg:px-5 h-fit min-h-screen flex flex-col justify-center gap-6 bg-white'>
      <h1 className='font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-600 '>
        COFOBLOGS
      </h1>
      <div className='w-[300px] h-[420px] bg-transparent cursor-pointer group perspective shadow-2xl shadow-orange-400'>
        <div className='relative preserve-3d group-hover:my-rotate-y-180 w-full h-full duration-1000'>
          <div className='absolute backface-hidden border-2 w-full h-full'>
            <Image
              src='/assets/images/cofo/SVGIconSticker.svg'
              className='w-full h-full object-cover'
              width={100}
              height={100}
              alt='cofo icon'
            />
          </div>
          <div className='absolute my-rotate-y-180 backface-hidden w-full h-full overflow-hidden flex flex-col justify-center'>
            <a
              href='https://coformatique.com/'
              className='flex flex-col items-center justify-center gap-5'
            >
              <Image
                className='w-8 h-8 mr-2'
                src='/assets/images/cofo/SVGIconSticker.svg'
                alt='logo'
                width={32}
                height={32}
                priority={true}
              />
              <p className='font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-600'>
                Coformatique
              </p>
            </a>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8 flex flex-col justify-center'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white m-auto'>
                Welcome Back
              </h1>
              <a
                type='submit'
                className='w-4/5 m-auto text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center '
                href='/api/auth/login?returnTo=/feed'
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
        <div className='absolute my-rotate-y-180 backface-hidden w-full h-full overflow-hidden'>
          <p className='font-extrabold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-600'>
            Welcome To COFOBLOGS
          </p>
        </div>
      </div>
    </section>
  );
}
