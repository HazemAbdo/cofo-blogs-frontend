"use client";
import React, { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import SearchBar from "./SearchBar";
import { useUser } from "@auth0/nextjs-auth0/client";

const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setSearchOpen(false);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
  };
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useUser();
  return (
    <nav className=' text-gray-900 bg-gradient-to-br from-transparent to-yellow-100'>
      <div className='flex justify-between items-center py-8 px-6 mx-auto max-w-screen-xl md:px-12 lg:px-16 xl:px-24'>
        <button
          className={`sidebar-open block md:hidden relative z-30 focus:outline-none transform  -translate-x-1/2 -translate-y-1/2 active:scale-75 transition-transform mt-4`}
          onClick={toggleMenu}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='btn-open h-5 w-5 transform transition duration-500 ease-in-out '
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
              clipRule='evenodd'
            />
          </svg>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='btn-close hidden h-5 w-5 transform transition duration-500 ease-in-out'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M3 7a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 13a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
              clipRule='evenodd'
            />
          </svg>
        </button>
        <a
          href='/feed'
          className='text-3xl md:text-4xl font-bold tracking-wide'
        >
          Cofo-<span className='text-yellow-500'>Blogs</span>
        </a>
        {user && (
          <>
            <div
              className={`menu-resposive fixed flex inset-0 transition-all bg-white/70 backdrop-blur-xl z-20 md:static md:bg-transparent md:flex items-center justify-center space-y-8 md:space-y-0 flex-col md:flex-row md:space-x-8 ${
                menuOpen ? "" : "hidden"
              } -mt-56 md:mt-0`}
            >
              <ul className='flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-6 lg:md:-x-8'>
                <li className='text-lg md:text-base lg:text-lg font-medium group '>
                  <a
                    href='/feed'
                    className={pathname === "/feed" ? "text-yellow-600" : ""}
                  >
                    Feed
                  </a>
                  <div
                    className={`h-0.5 bg-yellow-500 scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out`}
                  ></div>
                </li>
                <li className='text-lg md:text-base lg:text-lg font-medium group'>
                  <a
                    href='/create-blog'
                    className={
                      pathname === "/create-blog" ? "text-yellow-600" : ""
                    }
                  >
                    Write
                  </a>
                  <div
                    className={`h-0.5 bg-yellow-500 scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out`}
                  ></div>
                </li>
                <li className='text-lg md:text-base lg:text-lg font-medium group'>
                  <a
                    href='/profile'
                    className={pathname === "/profile" ? "text-yellow-600" : ""}
                  >
                    Profile
                  </a>
                  <div
                    className={`h-0.5 bg-yellow-500 scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out`}
                  ></div>
                </li>
                <li className='text-lg md:text-base lg:text-lg font-medium group '>
                  <a
                    href='/saves'
                    className={pathname === "/saves" ? "text-yellow-600" : ""}
                  >
                    Saves
                  </a>
                  <div
                    className={`h-0.5 bg-yellow-500 scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out`}
                  ></div>
                </li>
                <li className='text-lg md:text-base lg:text-lg font-medium group'>
                  <a href='/api/auth/logout'>Sign out</a>
                  <div
                    className={`h-0.5 bg-yellow-500 scale-x-0 group-hover:scale-100 transition-transform origin-left rounded-full duration-300 ease-out`}
                  ></div>
                </li>
              </ul>
            </div>

            <SearchBar search={searchParams.get("search") ?? ""} />
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
