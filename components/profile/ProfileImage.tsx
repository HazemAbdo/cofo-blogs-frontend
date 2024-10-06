import { Dispatch, SetStateAction } from "react";
import { UserProfileDataInterface, HTMLInputEvent } from "@types";
import Image from "next/image";
import { useUserContext } from "@app/(pages)/context/user";

type Props = {
  setUserProfileData: Dispatch<SetStateAction<UserProfileDataInterface>>;
  userProfileData: UserProfileDataInterface;
  setImageSizeError: Dispatch<SetStateAction<boolean>>;
};
const uploadImage = async (
  e: HTMLInputEvent,
  setUserProfileData: Dispatch<SetStateAction<UserProfileDataInterface>>,
  userProfileData: UserProfileDataInterface,
  setImageSizeError: Dispatch<SetStateAction<boolean>>,
  token: string,
  s3Url: string
) => {
  setImageSizeError(false);
  const file = e.target.files ? e.target.files[0] : null;

  if (file) {
    if (file.size <= 2 * 1024 * 1024) {
      // Obtain a pre-signed URL from your server
      let uploadURL = "";
      try {
        let preSignedUrlResponse = await fetch(s3Url, {
          method: "POST",
          body: JSON.stringify({
            Filetype: file.type,
            Filename: file.name,
          }),
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const presignedBody = await preSignedUrlResponse.json();
        uploadURL = presignedBody.uploadURL;
      } catch (error) {
        console.log("error in getting upload url:", error);
      }

      // Upload the file to the S3 pre-signed URL
      try {
        let uploadResponse = await fetch(uploadURL, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });

        if (uploadResponse.status === 200) {
          setUserProfileData({
            ...userProfileData,
            image: uploadResponse.url.split("?Content-Type")[0],
          });
        } else {
          // Handle upload error
          console.error("Upload failed");
        }
      } catch (error) {
        console.log("error in uploading image to s3:", error);
      }
    } else {
      setImageSizeError(true);
      setTimeout(() => {
        setImageSizeError(false);
      }, 2000);
    }
  }
};

const ProfileImage = ({
  setUserProfileData,
  userProfileData,
  setImageSizeError,
}: Props) => {
  const { token, s3Url } = useUserContext();
  return (
    <div className='profile-pic'>
      <label className='-label' htmlFor='file'>
        <span className='glyphicon glyphicon-camera'></span>
        <span>Change Image</span>
      </label>
      <input
        id='file'
        type='file'
        accept='.jpg, .jpeg, .png'
        onChange={(e) => {
          uploadImage(
            e as unknown as HTMLInputEvent,
            setUserProfileData,
            userProfileData,
            setImageSizeError,
            token,
            s3Url
          );
        }}
      />
      <Image
        alt='NextUI hero Image with delay'
        src={userProfileData.image || "/assets/icons/person.svg"}
        className='img object-cover'
        width={500}
        height={500}
        priority={true}
      />
    </div>
  );
};

export default ProfileImage;
