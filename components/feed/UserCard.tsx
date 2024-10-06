import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { UserInterface } from "@types";

export default function UserCard({ user }: { user: UserInterface }) {
  return (
    <ListItem alignItems='flex-start'>
      <ListItemAvatar>
        <Avatar alt='Remy Sharp' src={user.image} />
      </ListItemAvatar>
      <ListItemText
        primary='Brunch this weekend?'
        secondary={
          <React.Fragment>
            <Typography
              sx={{ display: "inline" }}
              component='span'
              variant='body2'
              color='text.primary'
            >
              {`${user.name}`}
            </Typography>
            {user.bio}
          </React.Fragment>
        }
      />
    </ListItem>
  );
}
