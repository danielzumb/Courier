import path from "path";
import express, {Express, NextFunction, Request, Response} from "express";
import {serverInfo} from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./Contacts";
import {IContact} from "./Contacts";

const app: Express = express();

app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../../clients/dist")));

app.use(function(inRequest: Request, inResponse: Response, inNext: NextFunction){
    inResponse.header("Access-Control-Allow-Origin", "*");
    inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    inNext();
});

// List Mailboxes
app.get("/mailboxes",
    async(inRequest: Request, inResponse: Response) => {
        try{
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
            inResponse.json(mailboxes);
        }catch(inError){
            inResponse.status(500);
            inResponse.send("Error encountered: " + inError);
        }
    }
);

// List Messages in a mailbox

app.get("/mailboxes/:mailbox",
    async(inRequest: Request, inResponse: Response) => {
        try{
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messages: IMAP.IMessage[] = await imapWorker.listMessages({
                mailbox: inRequest.params.mailbox
            });
            inResponse.json(messages);
        }catch(inError){
            let responseMessage: string = "Error: " + inError;
            if(String(inError).includes("Unknown Mailbox")){
                inResponse.status(404);
                responseMessage = `Mailbox name '${inRequest.params.mailbox}' not found. Full error:     ` + inError;
            }else{
                inResponse.status(500);
                responseMessage = 'Encountered a failure when retrieving mailbox. Full error:      ' + inError;
            }
            inResponse.send(responseMessage);

        }
    }
);

// Get a message
app.get("/messages/:mailbox/:id",
    async(inRequest: Request, inResponse: Response) => {
        try{
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string = await imapWorker.getMessageBody({
                mailbox: inRequest.params.mailbox,
                id: parseInt(inRequest.params.id, 10)
            });
            inResponse.send(messageBody);
        }catch(inError){
            let responseMessage: string = "Error: " + inError;
            if(String(inError).includes("Unknown Mailbox")){
                inResponse.status(404);
                responseMessage = `Mailbox name '${inRequest.params.mailbox}' not found. Full error:     ` + inError;
            }else if(String(inError).includes("body[]")){
                inResponse.status(404);
                responseMessage = `Message with ID '${inRequest.params.id}' not found.`;
            }else{
                inResponse.status(500);
                responseMessage = 'Encountered a failure when retrieving mailbox. Full error:      ' + inError;
            }
            inResponse.send(responseMessage);
        }
    }
);

// Delete a message
app.delete("/messages/:mailbox/:id",
    async(inRequest: Request, inResponse: Response) => {
        try{
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox: inRequest.params.mailbox,
                id: parseInt(inRequest.params.id, 10)
            });
            inResponse.send("ok");
        }catch(inError){
            let responseMessage: string = "Error: " + inError;
            if(String(inError).includes("Unknown Mailbox")){
                inResponse.status(404);
                responseMessage = `Mailbox name '${inRequest.params.mailbox}' not found. Full error:     ` + inError;
            }else if(String(inError).includes("body[]")){
                inResponse.status(404);
                responseMessage = `Message with ID '${inRequest.params.id}' not found.`;
            }else{
                inResponse.status(500);
                responseMessage = 'Encountered a failure when retrieving mailbox. Full error:      ' + inError;
            }
            inResponse.send(responseMessage);
        }
    }
);

// Send a message
app.post("/messages",
    async(inRequest: Request, inResponse: Response) => {
        try{
            const smptWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
            await smptWorker.sendMessage(inRequest.body);
            inResponse.send("ok");
        }catch(inError){
            inResponse.status(500);
            inResponse.send("Error encountered: " + inError);
        }
    }
);

// List contacts
app.get("/contacts",
    async(inRequest: Request, inResponse: Response) => {
        try{
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contacts: IContact[] = await contactsWorker.listContacts();
            inResponse.json(contacts);
        }catch(inError){
            inResponse.status(500);
            inResponse.send("Error encountered: " + inError);
        }
    }
);

// Add a contact
app.post("/contacts",
    async(inRequest: Request, inResponse: Response) => {
        try{
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.addContact(inRequest.body);
            inResponse.json(contact);
        }catch(inError){
            inResponse.status(500);
            inResponse.send("Error encountered: " + inError);
        }
    }
);

// Delete a contact
app.delete("/contacts/:id",
    async(inRequest: Request, inResponse: Response) => {
        try{
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            await contactsWorker.deleteContact(inRequest.params.id);
            inResponse.send("ok");
        }catch(inError){
            let responseMessage: string = "Error: " + inError;
            if(String(inError).includes("Unknown Mailbox")){
                inResponse.status(404);
                responseMessage = `Contact with ID '${inRequest.params.id}' not found. Full error:     ` + inError;
            }else{
                inResponse.status(500);
                responseMessage = 'Encountered a failure when retrieving mailbox. Full error:      ' + inError;
            }
            inResponse.send(responseMessage);
        }
    }
);

app.put("/contacts/:id",
    async(inRequest: Request, inResponse: Response) => {
        try{
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            await contactsWorker.updateContact(inRequest.params.id, inRequest.body);
            inResponse.send("ok");
        }catch(inError){
            let responseMessage: string = "Error: " + inError;
            if(String(inError).includes("Unknown Mailbox")){
                inResponse.status(404);
                responseMessage = `Contact with ID '${inRequest.params.id}' not found. Full error:     ` + inError;
            }else{
                inResponse.status(500);
                responseMessage = 'Encountered a failure when retrieving mailbox. Full error:      ' + inError;
            }
            inResponse.send(responseMessage);
        }
    }
);

app.listen(80);
