// App imports.
import * as Contacts from "./Contacts";
import { config } from "./config";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import { ImagePalette } from "material-ui/svg-icons";


/**
 * This function must be called once and only once from BaseLayout.
 */
export function createState(inParentComponent) {

  return {


    // Flag: Is the please wait dialog visible?
    pleaseWaitVisible : false,

    // List of contacts.
    contacts : [ ],

    // List of mailboxes.
    mailboxes : [ ],

    // List of messages in the current mailbox.
    messages : [ ],

    // The view that is currently showing ("welcome", "message", "compose", "contact" or "contactAdd").
    currentView : "welcome",

    // The currently selected mailbox, if any.
    currentMailbox : null,

    // The details of the message currently being viewed or composed, if any.
    messageID : null,
    messageDate : null,
    messageFrom : null,
    messageTo : null,
    messageSubject : null,
    messageBody : null,

    // The details of the contact currently being viewed or added, if any.
    contactID : null,
    contactName : null,
    contactEmail : null,


    // ------------------------------------------------------------------------------------------------
    // ------------------------------------ View Switch functions -------------------------------------
    // ------------------------------------------------------------------------------------------------


    showHidePleaseWait : function(inVisible: boolean): void {
        this.setState({pleaseWaitVisibile: inVisible});
    }.bind(inParentComponent),

    addMailboxToList : function(inMailbox: IMAP.IMailbox): void{
      const cl: IMAP.IMailbox[] = this.state.mailboxes.slice(0);
      cl.push(inMailbox);
      this.setState({mailboxes: cl});
    }.bind(inParentComponent),

    addContactToList : function(inContact: Contacts.IContact): void{
      const cl = this.state.contacts.slice(0);
      cl.push({_id: inContact._id, name: inContact.name, email: inContact.email});
      this.setState({contacts: cl});
    }.bind(inParentComponent)

    
  };
}