# Courier

# Configuration
1) Update server information by modifying the /server/serverInfo.json file. Update the User and Pass parameters with your Gmail login information.

2) Build the client source code. Open the terminal and navigate to the clients directory. Type 'npm run build'

3) Start the server. From terminal, navigate to the server directory. Type 'npm run compile'

When using a GMAIL account, you must ensure that the setting "Less secure app access" is turned ON. To do this, please visit https://myaccount.google.com/security and modify this setting to be ON.

Failure to do so will return an Error: Invalid credentials (Failure) message due to Google blocking the authentication.