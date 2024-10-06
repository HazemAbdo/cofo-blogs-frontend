import React, { useState } from "react";
interface EmojiInterface {
  name: string;
  unicode: string;
  code: string;
}

const EmojiPicker = ({
  setComment,
  setShowPicker,
}: {
  setComment: React.Dispatch<React.SetStateAction<string>>;
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const emojis: EmojiInterface[] = [
    {
      name: "smiling face with heart-eyes",
      unicode: "😍",
      code: ":heart_eyes:",
    },
    { name: "grinning face", unicode: "😀", code: ":grinning:" },
    { name: "winking face", unicode: "😉", code: ":wink:" },
    { name: "smiling face", unicode: "😊", code: ":smile:" },
    {
      name: "slightly smiling face",
      unicode: "🙂",
      code: ":slightly_smiling_face:",
    },
    { name: "kissing face", unicode: "😗", code: ":kissing_face:" },
    { name: "thumbs up", unicode: "👍", code: ":thumbs_up:" },
    { name: "clapping hands", unicode: "👏", code: ":clap:" },
    { name: "fire", unicode: "🔥", code: ":fire:" },
    { name: "rocket", unicode: "🚀", code: ":rocket:" },
    { name: "heart", unicode: "❤️", code: ":heart:" },
    { name: "star", unicode: "⭐️", code: ":star:" },
  ];

  return (
    <div className='emoji-list max-sm:w-60'>
      {emojis.map((emoji) => (
        <span
          key={emoji.code}
          onClick={() => {
            setShowPicker(false);
            setComment((prev) => prev + emoji.unicode);
          }}
          className='emoji-item'
        >
          {emoji.unicode}
        </span>
      ))}
    </div>
  );
};

export default EmojiPicker;
