const { toXML } = require("jstoxml");
const mp3Duration = require("mp3-duration");
const path = require("path");
const { stat } = require("fs").promises;

const xmlOptions = {
  header: true,
  indent: "  "
};

module.exports = generateXML;

async function generateXML(metadata, episodes) {
  const categories = metadata.category.map(c => ({
    _name: "itunes:category",
    _attrs: {
      text: c
    }
  }));

  async function createEpisode(episode) {
    const url = toUrl(episode, metadata);
    const size = await readBytes(episode);

    return {
      item: [
        {
          title: episode.title
        },
        {
          "itunes:author": metadata.author
        },
        {
          "itunes:summary": episode.description
        },
        {
          "itunes:image": metadata.image
        },
        {
          _name: "enclosure",
          _attrs: {
            url: url,
            length: size,
            type: "audio/x-m4a"
          }
        },
        {
          guid: url
        },
        {
          pubDate: episode.publishDate
        },
        {
          "itunes:duration": await duration(episode)
        },
        {
          "itunes:keywords": metadata.keywords.join(", ")
        }
      ]
    };
  }

  return toXML(
    {
      _name: "rss",
      _attrs: {
        "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
        version: "2.0"
      },
      _content: {
        channel: [
          {
            title: metadata.title
          },
          {
            link: metadata.link
          },
          {
            language: metadata.language
          },
          {
            copyright: "Copyright " + new Date().getFullYear()
          },
          {
            "itunes:subtitle": metadata.subtitle
          },
          {
            "itunes:author": metadata.author
          },
          {
            "itunes:summary": metadata.description
          },
          {
            description: metadata.description
          },
          {
            "itunes:owner": {
              "itunes:name": metadata.owner.name,
              "itunes:email": metadata.owner.email
            }
          },
          {
            _name: "itunes:image",
            _attrs: {
              href: metadata.image
            }
          },
          {
            _name: "atom:link",
            _attrs: {
              rel: metadata.public_feed_link
            }
          },
          {
            image: {
              url: metadata.image,
              title: metadata.title,
              link: metadata.link
            }
          },
          {
            "itunes:explicit": !metadata.explicit ? "no" : "yes"
          },
          {
            "itunes:keywords": metadata.keywords.join(", ")
          },
          ...categories,
          ...(await Promise.all(episodes.map(createEpisode)))
        ]
      }
    },
    xmlOptions
  );
}

function toLocalFile(episode) {
  return path.join(__dirname, "..", "episodes", episode.filename + ".mp3");
}

function toUrl(episode, metadata) {
  return `${metadata.public_episode_baseurl}/${episode.filename}.mp3`;
}

function readableDate(inputSeconds) {
  const dateObj = new Date(inputSeconds * 1000);
  const hours = dateObj.getUTCHours();
  const minutes = dateObj.getUTCMinutes();
  const seconds = dateObj.getSeconds();

  return (
    hours.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0")
  );
}

async function duration(episode) {
  const dur = await mp3Duration(toLocalFile(episode));
  return readableDate(dur);
}

async function readBytes(episode) {
  const file = toLocalFile(episode);
  const fileStat = await stat(file);
  return fileStat.size;
}
