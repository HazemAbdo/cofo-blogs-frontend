"use client";
import { useUserContext } from "@app/(pages)/context/user";
import { Chip, TextField } from "@mui/material";
import Autocomplete, {
  AutocompleteChangeDetails,
} from "@mui/material/Autocomplete";

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
  baseUrl: string,
  setNewTags: Dispatch<SetStateAction<TagInterface[]>>,
  newTags: TagInterface[]
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
      setNewTags([
        ...newTags,
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
  baseUrl: string,
  setNewTags: Dispatch<SetStateAction<TagInterface[]>>,
  newTags: TagInterface[],
  deletedTags: TagInterface[],
  setDeletedTags: Dispatch<SetStateAction<TagInterface[]>>
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
      setNewTags(newTags.filter((t) => t.id !== tag.id));
      setDeletedTags([...(deletedTags || []), tag]);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

const EditTags = ({
  blog,
  setBlog,
  newTags,
  setNewTags,
  deletedTags,
  setDeletedTags,
}: {
  blog: BlogContnetInterface;
  setBlog: Dispatch<SetStateAction<BlogContnetInterface>>;
  newTags: TagInterface[];
  setNewTags: Dispatch<SetStateAction<TagInterface[]>>;
  deletedTags: TagInterface[];
  setDeletedTags: Dispatch<SetStateAction<TagInterface[]>>;
}) => {
  const { token, baseUrl } = useUserContext();
  const [predifinedTags, setPredifinedTags] = useState<TagInterface[]>([]);
  useEffect(() => {
    fetchTags(token, baseUrl, setPredifinedTags);
  }, [token, baseUrl]);
  return (
    <Autocomplete
      value={blog.tags ? [...blog.tags, ...newTags] : []}
      onChange={(
        event,
        newValues,
        reason,
        details: AutocompleteChangeDetails<TagInterface | string> | undefined
      ) => {
        if (reason === "removeOption") {
          if (
            blog.tags.includes(details?.option as TagInterface) ||
            predifinedTags.includes(details?.option as TagInterface)
          ) {
            const updatedTags = blog.tags.filter(
              (t) => t.id !== (details?.option as TagInterface).id
            );
            const updatedBlog = {
              ...blog,
              tags: updatedTags,
            };
            setBlog(updatedBlog);
            setDeletedTags([
              ...(deletedTags || []),
              details?.option as TagInterface,
            ]);
          } else {
            //if new tag make DELETE request and remove it from tags
            deleteTag(
              details?.option as TagInterface,
              token,
              baseUrl,
              setNewTags,
              newTags,
              deletedTags,
              setDeletedTags
            );
          }
        } else if (reason === "selectOption") {
          // if predfined or init just add it
          if (
            blog.tags.includes(details?.option as TagInterface) ||
            predifinedTags.includes(details?.option as TagInterface)
          ) {
            setNewTags([...newTags, details?.option as TagInterface]);
          }
        } else {
          postTag(
            details?.option as unknown as string,
            token,
            baseUrl,
            setNewTags,
            newTags
          );
        }
      }}
      multiple
      options={predifinedTags.length > 0 ? [...predifinedTags] : []}
      isOptionEqualToValue={(option, value) =>
        (option as TagInterface).id === (value as TagInterface).id
      }
      getOptionLabel={(option: TagInterface | string) =>
        (option as TagInterface).name
      }
      freeSolo
      renderTags={(value: (string | TagInterface)[], getTagProps) =>
        [...blog.tags, ...newTags].map(
          (option: TagInterface, index: number) => (
            <Chip
              variant='outlined'
              label={option.name}
              {...getTagProps({ index })}
              key={option.id}
            />
          )
        )
      }
      renderInput={(params) => (
        <TextField {...params} label='Tags' placeholder='Tag' />
      )}
    />
  );
};

export default EditTags;
