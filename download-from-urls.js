const bent = require("bent");
const fs = require("fs");

let filename = "peaceful.txt";
let directory = "./peaceful";

function main() {
    fs.readFile(filename, "utf-8", (err, res) => {
        if (err) return console.log(err);
        const urlArray = res.split(",");

        const getBuffer = bent("buffer");

        for (const i in urlArray) {
            const url = urlArray[i];
            if (url.substring(0,4) === "http"){
                console.log(`Downloading file from ${url}`);
                // const file = fs.createWriteStream(`./images/${i}.jpg`);

                getBuffer(url).then(res => {
                    fs.writeFile(`${directory}/${i}.jpg`, res, "binary", err => { err ? console.log(err) : console.log(`file ${i}.jpg saved`) })
                }).catch(e => { console.log(e) });
            } else {
                console.log(`Rejected url ${url}`);
            }

        }
    });
}

main();