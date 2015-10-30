# Accounting-System-Front-End-
This is the front end of IAS

## Desktop Environment Integration

[Electron.Atom.io Guide](http://electron.atom.io/docs/v0.34.0/tutorial/quick-start/)

### To run the application using electron

#### Install the `electron` command globally
npm install electron-prebuilt -g

#### Install as a development dependency
npm install electron-prebuilt --save-dev


If you've installed electron-prebuilt globally with npm, then you will only need to run the following in your app's source directory:

electron .

or

npm start


npm start command provides this code to execute npm commands:
"scripts": {
	"test": "echo \"Error: no test specified\" && exit 1",
	"start": "./node_modules/.bin/electron ."
},