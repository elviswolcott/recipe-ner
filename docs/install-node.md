# Install Node.js
> Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine.

\- nodejs.org

Node.js allows you to run JavaScript outside of the browser.
It also comes with a package manager called NPM (node package manager) that provides access to a robust ecosystem of open source packages.

## Windows and MacOS

The fastest way to install Node.js is by downloading an installer from [nodejs.org](https://nodejs.org).

## Linux

Unfortunately, the versions of Node.js in your system's package manager are probably out of date. 
To keep up to date, we recommend `n`, a command line tool which makes managing your Node.js version easy.


To install `n`, run the following commands from your terminal.

```bash
cd ~/Downloads
curl -L https://raw.githubusercontent.com/tj/n/master/bin/n -o n
bash n lts
npm install -g n
```
