import express from "express";
import fs from "fs";
import path from "path";

import React from "react";
import ReactDOMServer from "react-dom/server";

import App from "../src/App";

const PORT = 3005;

const app = express();
fs.realpath('./build/index.html', (err, resolvedPath) => {
    if (err) {
        throw new Error('build/index.html does not exist, run `npm run build` before running ssr');
    }
    console.log(resolvedPath);
});

app.use("^/$", (req, res, next) => {
    fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Some error happened");
        }
        return res.send(
            data.replace(
                '<div id="root"></div>',
                `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
            )
        );
    });
});

app.use(express.static(path.resolve(__dirname, '..', 'build')));
app.use(express.static(path.resolve(__dirname, '..', 'public')));

app.listen(PORT, () => {
    console.log(`App launched on ${PORT}`);
});