"use client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0/client";
import ProfileImage from "@components/profile/ProfileImage";
import { useUserContext } from "@app/(pages)/context/user";
import { UserProfileDataInterface } from "@types";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";
const fetchUserProfileData = async (token: string, baseUrl: string) => {
  try {
    const res = await fetch(`${baseUrl}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const userProfileData = await res.json();
    return userProfileData.data
      .myProfile as unknown as UserProfileDataInterface;
  } catch (error) {
    console.log("error in fetching user profile data", error);
  }
};

const updateProfileDate = async (
  userProfileData: UserProfileDataInterface,
  router: AppRouterInstance,
  token: string,
  baseUrl: string
) => {
  try {
    const newDate = userProfileData.dateOfBirth;
    const [yyyy, mm, dd] = newDate.split("-");
    const res = await fetch(`${baseUrl}/me`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: userProfileData.image,
        bio: userProfileData.bio,
        dateOfBirth: `${mm}/${dd}/${yyyy}`,
      }),
    });
    if (res.ok) {
      router.push("/profile");
    } else {
      console.log(res.text);
    }
  } catch (error) {
    console.log("error in updating profile:", error);
  }
};
function Profile() {
  const [userProfileData, setUserProfileData] =
    useState<UserProfileDataInterface>({
      id: "",
      image: "",
      email: "",
      bio: "",
      dateOfBirth: "",
      name: "",
    });
  const { token, baseUrl } = useUserContext();
  useEffect(() => {
    (async () => {
      const data = (await fetchUserProfileData(
        token,
        baseUrl
      )) as UserProfileDataInterface;
      if (data) {
        if (data.dateOfBirth) {
          const newDate = data.dateOfBirth;
          const [mm, dd, yyyy] = newDate.split("/");
          setUserProfileData({
            ...data,
            dateOfBirth: `${yyyy}-${mm}-${dd}`,
          });
        } else {
          setUserProfileData({
            ...data,
          });
        }
      }
    })();
  }, [token, baseUrl]);
  const router = useRouter();
  const [imageSizeError, setImageSizeError] = useState(false);
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div className='min-h-screen pt-2 font-mono '>
      <div className='container mx-auto'>
        <div className='inputs w-full max-w-2xl p-6 mx-auto'>
          <h2 className='text-2xl text-gray-900'>{`${
            userProfileData?.name || "User"
          }'s settings`}</h2>
          <form
            className='mt-6 border-t border-[#EAB308] pt-4'
            onSubmit={handleSubmit}
          >
            <div className='flex flex-wrap -mx-3 mb-6'>
              <div className='w-full md:w-full px-3 mb-6'>
                <ProfileImage
                  setImageSizeError={setImageSizeError}
                  setUserProfileData={setUserProfileData}
                  userProfileData={userProfileData}
                />
                {imageSizeError && (
                  <p color='danger' className='text-center mt-2'>
                    Image size exceeds 2 megabytes
                  </p>
                )}
              </div>
              <div className='w-full md:w-full px-3 mb-6'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='grid-text-1'
                >
                  email
                </label>
                <input
                  className='appearance-none block w-full bg-white text-gray-700 border border-[#EAB308] shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500'
                  id='grid-text-1'
                  type='text'
                  placeholder={
                    userProfileData?.email ? "" : "Please Enter Your Email"
                  }
                  value={userProfileData?.email || ""}
                  readOnly
                />
              </div>
              <div className='w-full md:w-full px-3 mb-6'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='grid-text-1'
                >
                  Name
                </label>
                <input
                  className='appearance-none block w-full bg-white text-gray-700 border border-[#EAB308] shadow-inner rounded-md py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500'
                  id='grid-text-1'
                  type='text'
                  placeholder={
                    userProfileData?.name ? "" : "Please Enter Your Name"
                  }
                  value={userProfileData?.name || ""}
                  readOnly
                />
              </div>
              <div className='w-full md:w-full px-3 mb-6'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='grid-text-1'
                >
                  Bio
                </label>
                <textarea
                  className='shadow appearance-none  rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border border-[#EAB308]'
                  id='bio'
                  value={userProfileData?.bio}
                  placeholder={
                    userProfileData.bio ? "" : "Please Enter Your bio"
                  }
                  onChange={(e) => {
                    setUserProfileData({
                      ...userProfileData,
                      bio: e.target.value,
                    });
                  }}
                  cols={50}
                  rows={10}
                />
              </div>
              <div className='w-full md:w-full px-3 mb-6'>
                <label
                  className='block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2'
                  htmlFor='grid-text-1'
                >
                  DOB
                </label>
                <input
                  className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-[#EAB308]'
                  id='date'
                  type='date'
                  value={userProfileData?.dateOfBirth || ""}
                  onChange={(e) => {
                    setUserProfileData({
                      ...userProfileData,
                      dateOfBirth: e.target.value,
                    });
                  }}
                  max='2010-01-01'
                />
              </div>
              <div className='w-full md:w-full  mb-6 flex justify-end'>
                <button
                  type='submit'
                  className='w-1/5 min-w-fit  text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center '
                  onClick={() => {
                    updateProfileDate(userProfileData, router, token, baseUrl);
                  }}
                >
                  save changes
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default withPageAuthRequired(Profile);
