# packt-claimer
This is a web utility for claiming your Packt book automagically.

Everday Packt Publishing release a free book at: https://www.packtpub.com/packt/offers/free-learning

This NodeJS server, based apon the code from [Fabio](https://github.com/draconar/)'s repository, [grab_packt](https://github.com/draconar/grab_packt/), allows for a web request on port 80 to be sent to this Node.JS application in order to claim your book.

As this runs on a web server, it means that (<b>if you're happy passing through your details in plaintext</b>), it can be run in conjunction with IFTTT.

^ <i>Obviously, not so secure.</i>

## Installing

Install this script in the cloned directory using the following command:

    npm install

After that run the script with the following command:

    watch -n 5000 --differences node server.js
    
Then send a web request to: `http://localhost/?email=EMAIL@HERE.COM&password=PASSWORD`

^ <i>This link then can be called from other services such as [IFTTT](https://ifttt.com/channels/maker/actions/1600703425-make-a-web-request) to claim your book when certian actions occur.</i>