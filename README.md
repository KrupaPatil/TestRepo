# CigarScanner v3 App

## Requirements

- [Node](https://nodejs.org/en/download/)
- npm
- [git](https://git-scm.com/download/win)
- [Cordova](https://cordova.apache.org/docs/en/latest/guide/cli/)


## Setup
```bash
# Clone repo
git clone git@bitbucket.org:neptuneteam/cigar-scanner-v3.git
# Install required global dependencies
npm install -g ionic cordova
# Install deps
npm install
# This is needed for the next step (cordova prepare), otherwise the app won't be recognised as Cordova project  
mkdir www
# Install cordova plugins and platforms
cordova prepare
```

### Run local server
```bash
# development
ionic serve
```

# iOS

### Run on an iOS device

- `ionic build ios --prod`
- connect the device
- in XCode, select the device and click on the Run icon

# Android

### Facebook key hash

OpenSSL is available for download from here: `https://code.google.com/archive/p/openssl-for-windows/downloads`
Keytool, for generating the key hashes, is included with the Java SE Development Kit (JDK).

For development, generate hash using command:

On OSX
`keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64`

On Windows
`keytool -exportcert -alias androiddebugkey -keystore "path_to_debug_keystore" | "path_to_openssl" sha1 -binary | "path_to_openssl" base64`

Default password is android

# Web

- we are using azure deployment process. Everything is done according to azure documentation, with these changes:
 - `deploy.cmd` file is calling `npm run ionic:build:prod` command to build the application after every push to `master` branch
 - after build is finished, the contest of `www` folder is copied to `www_live` folder and the web application is served from that folder

 # Setting Facebook IDs

 - facebook ID for web is set in index.html
 - facebook ID for mobile is set in config.xml

