"use client";
import { useUserContext } from "@app/(pages)/context/user";
import { TextField } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import { BlogContnetInterface, TagInterface } from "@types";
import { useEffect, useState, Dispatch, SetStateAction } from "react";

const fetchTags = async (
  token: string,
  baseUrl: string,
  setPredifinedTags: Dispatch<SetStateAction<TagInterface[]>>
) => {
  fetch(`${baseUrl}/tags`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      return response.json();
    })
    .then((tags) => {
      // Handle the data after a successful response
      setPredifinedTags(tags.data.tags);
    })
    .catch((error) => {
      console.log("error:", error);
    });
};

const postTag = async (
  tag: string,
  token: string,
  setAddedTags: Dispatch<SetStateAction<TagInterface[]>>,
  addedTags: TagInterface[],
  baseUrl: string
) => {
  fetch(`${baseUrl}/tags`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: tag,
      score: 0,
    }),
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then((res: { data: { tag: TagInterface } }) => {
      const tag = res.data.tag;
      setAddedTags([
        ...addedTags,
        { id: tag.id, name: tag.name, score: tag.score },
      ]);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

const deleteTag = async (
  tag: TagInterface,
  token: string,
  setAddedTags: Dispatch<SetStateAction<TagInterface[]>>,
  addedTags: TagInterface[],
  baseUrl: string
) => {
  fetch(`${baseUrl}/tags/${tag.id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.status === 200) {
        return response;
      } else {
        throw new Error(`Delete request failed with status ${response.status}`);
      }
    })
    .then(() => {
      setAddedTags(addedTags.filter((t) => t.id !== tag.id));
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

const Tags = ({
  setBlog,
  blog,
}: {
  setBlog: Dispatch<SetStateAction<BlogContnetInterface>>;
  blog: BlogContnetInterface;
}) => {
  const [predifinedTags, setPredifinedTags] = useState<TagInterface[]>([
    { id: "69", name: "software", score: 0 },
  ]);
  const [addedTags, setAddedTags] = useState<TagInterface[]>([]);
  const [currTag, setCurrTag] = useState<string>("");
  const { token, baseUrl } = useUserContext();
  // useEffect(() => {
  //   fetchTags(token, setPredifinedTags, baseUrl);
  // }, []);
  useEffect(() => {
    setBlog({
      ...blog,
      tags: addedTags,
    });
  }, [addedTags, blog, setBlog]);

  useEffect(() => {
    fetchTags(token, baseUrl, setPredifinedTags);
  }, [token, baseUrl]);
  return (
    <Autocomplete
      multiple
      id='tags-outlined'
      options={predifinedTags.length > 0 ? [...predifinedTags] : []}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      getOptionLabel={(option) => option.name}
      value={addedTags}
      onChange={(e, newValues, reason, detail) => {
        if (reason === "removeOption") {
          if (
            predifinedTags.findIndex((pt) => pt.id === detail?.option.id) !== -1
          ) {
            setAddedTags(newValues as TagInterface[]);
          } else {
            deleteTag(
              detail?.option as TagInterface,
              token,
              setAddedTags,
              addedTags,
              baseUrl
            );
          }
        } else if (reason === "selectOption") {
          setAddedTags(newValues as TagInterface[]);
          setCurrTag("");
        }
      }}
      filterSelectedOptions
      disableClearable
      renderInput={(params) => (
        <TextField
          {...params}
          value={currTag}
          onChange={(e) => setCurrTag(e.target.value)}
          label='Enter Tags'
          placeholder='Software Big Data'
          onKeyDown={(e) => {
            if (e.key === "Enter" && currTag !== "") {
              postTag(currTag, token, setAddedTags, addedTags, baseUrl);
              setCurrTag("");
            }
          }}
        />
      )}
    />
  );
};

export default Tags;
