/**
 * @file DTPS predeploy script
 * @author jottocraft
 * 
 * @copyright Copyright (c) 2018-2020 jottocraft. All rights reserved.
 * @license GPL-2.0-only
 * 
 * This script file minifies DTPS and generates docs
 */

//Import modules
const { minify } = require("terser");

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const glob = require("glob");
const mkdirp = require('mkdirp');
const rimraf = require("rimraf");
const ncp = require('ncp').ncp;

//Delete existing build folder
rimraf.sync("./build/*");

//Run functions
minifyJS();

//[1/3] Minify JavaScript
function minifyJS() {
    console.log("\n[1/3] Minifying JavaScript...");

    //Minify files function
    async function minifyFile(filePath) {
        //Run terser
        var results = await minify({
            [filePath]: fs.readFileSync(filePath, "utf8")
        }, {
            sourceMap: {
                url: "/" + filePath + ".map",
                includeSources: true,
                root: "/"
            }
        });

        //Make parent folder
        mkdirp.sync(path.join("build", filePath, ".."));

        //Write output files
        fs.writeFileSync(path.join("build", filePath), results.code, "utf8");
        fs.writeFileSync(path.join("build", filePath + ".map"), results.map, "utf8");
    }

    //Minify files
    minifyFile("init.js");
    glob.sync("scripts/**/*.js").forEach(file => {
        minifyFile(file);
    });

    console.log("[1/3] Done");
    copyStatic();
}

//[2/3] Copy static files
function copyStatic() {
    console.log("\n[2/3] Copying static files...");

    //Make build folder if it doesn't already exist
    mkdirp.sync("build");

    //Copy dtps.css
    fs.copyFileSync("dtps.css", "build/dtps.css");

    //Copy www
    ncp("www", "build", function () {
        console.log("[2/3] Done");
        generateDocs();
    });
}

//[3/3] Generate documentation
function generateDocs() {
    console.log("\n[3/3] Generating documentation...");

    //Make build folder if it doesn't already exist
    mkdirp.sync("./build/docs");

    //Generate docs
    var cp = exec("node ./node_modules/jsdoc/jsdoc.js -r scripts -d ./build/docs -c ./docs/jsdoc.conf.json -t ./node_modules/foodoc/template -R ./docs/README.md", function (e, o) {
        if (e) console.error(e);
        if (o) console.log(o);
    });

    //Listen for exit
    cp.addListener("close", function () {
        console.log("[3/3] Done");
        finish();
    });
}

function finish() {
    console.log("\nAll build tasks have finished");
}