const path = require("path");
const express = require('express');
const app = express();
module.exports = app;

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public/index.html"));
});

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error("Not found");
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });