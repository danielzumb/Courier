// React imports.
import React, { Component } from "react";

// Library imports.
import List from "@material-ui/core/List";
import Chip from "@material-ui/core/Chip";

const MailboxList = ({state}) => (
    <List>
        {state.mailboxes.map(value => {
            return(
                <Chip label={`${value.name}`}
                    onClick={() => state.setCurrentMailbox(value.path)}
                    style={{width:128, marginBottom:10}}
                    color={state.currentMailbox === value.path ? "secondary" : "primary"}
                    />
            
            );
        })}
    </List>
);

export default MailboxList;