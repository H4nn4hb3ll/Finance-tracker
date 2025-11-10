<div>
    This web application is designed to track user financial information. When fully implemented, the application will be accessible via web browser and hosted on our personal servers.
</div>
<div>
    Currently to view system functionality, you must have node.js installed to run the scripts detailed in <strong>package.json</strong>. 
    First, using your systems terminal, navigate to the <strong>PlaidProject</strong> directory. We recommend opening this directory in two separate terminal windows. When in the directory, <strong>npm run dev</strong> will host the web page and it’s associated scripts on the web address <strong>http://localhost:5127</strong>. Using the other terminal, <strong>npm run server</strong> will host the server. Most of the application functionalities will not run without a running server.
<div>
<div>
    You will enter a landing page where you can either log in to an existing account or create a new account. The created account will store a username, password, and an access token if a bank account is linked.
<div>
<div>
    Because the server is not yet hosted on personal servers, and is still in development, a testing account has been hard coded and will navigate to the prototype dashboard. This testing account is <strong>user</strong> for the username and <strong>pass</strong> for the password.
<div>
<div>
    The prototype dashboard is a simple dashboard that will simulate the linking of a bank account using plaid services and grab a variety of fake bank account information to display. After clicking on the “link account” button a plaid interface will appear. When prompted for a bank account username and password, enter <strong>user_good</strong> and <strong>pass_good</strong>. After Plaid verifies the bank account is linked, clicking “display transactions” will retrieve all transactions associated with the lined bank account to the user.
<div>
<div>
    Future implementations will include signed certificates and https, encrypted passwords and access tokens, improved functionality for displaying and searching transaction information, and user interface quality improvements.
<div>

