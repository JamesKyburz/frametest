# frametest

Creates a harness for test automation using an iframe

# install

With [npm](http://npmjs.org) do:

```
npm install frametest
```

compile with [browserify](http://browserify.org) using
[brfs](https://github.com/substack/brfs) to inline the `fs.readFile()`
call:

```
$ browserify -t brfs -r frametest > bundle.js
```

# license
MIT
