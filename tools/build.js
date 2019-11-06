const metadata = require("../metadata.json");
const episodes = require("../episodes.json");
const generateXML = require("./mapping");
const { writeFile } = require("fs").promises;
const { join } = require("path");

async function buildAndSave() {
  try {
    const xml = await generateXML(metadata, episodes);
    const file = join(__dirname, "..", "feed.xml");
    await writeFile(file, xml);

    console.log("[ Success ] Generated and saved podcast.xml");
  } catch (e) {
    console.error("[ Error ]", e);
  }
}

buildAndSave();
