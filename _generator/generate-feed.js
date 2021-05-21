const { exec } = require("child_process");
const { join } = require("path");
var RSS = require("rss");

function getFileModificationDates() {
  return new Promise((resolve, reject) => {
    // 1.step get file modification timestamps from git
    // command taken from https://serverfault.com/questions/401437/how-to-retrieve-the-last-modification-date-of-all-files-in-a-git-repository/1031956#1031956
    exec(
      'git ls-tree -r --name-only HEAD -z | TZ=UTC xargs -0n1 -I_ git --no-pager log -1 --date=iso-local --format="%ct _" -- _',
      { cwd: join(__dirname, "../apps") },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        if (stderr) {
          console.error(`git stderr: ${stderr}`);
        }

        const entries = {};

        for (const entry of stdout.split("\n")) {
          const [timestamp, filename] = entry.split(" ");
          if (filename) entries[filename.split(".")[0]] = timestamp;
        }

        resolve(entries);
      }
    );
  });
}

/** @typedef {import("./schema").Schema} DataSchema */

/**
 *
 * @param {DataSchema["apps"]} apps
 * @param {DataSchema["categories"]} categories
 * @returns
 */
async function generate_feed(apps, categories) {
  const dates = await getFileModificationDates();
//   console.log({ dates });

  var feed = new RSS({
    title: "bHackers Store Apps",
    description: "List of all Apps as RSS Feed",
    site_url: "https://banana-hackers.gitlab.io/store-db/data.json", // TODO create store landing page and link to that instead
    docs: "https://gitlab.com/banana-hackers/store-db/",
    language: "English",
    pubDate: Date.now()
  });

  for (const app of apps) {
    let description_content = app.description;
    description_content += `\n\nVersion: ${app.download.version}`;
    description_content += `<img src="${app.icon}" />`;

    if (app.screenshots && app.screenshots.length > 0) {
      description_content += "Screenshots:\n";
      for (const screenshot of app.screenshots) {
        description_content += `<img src="${screenshot}" />`;
      }
    }

    feed.item({
      title: app.name,
      description: description_content,
      author: app.author,
      categories: app.meta.categories.map(c => categories[c].name),
      custom_elements: [
        {
          maintainer: app.maintainer
        },
        {
          git_repo: app.git_repo
        },
        {
          tags: app.meta.tags
        }
      ],
      date: new Date(dates[app.slug] * 1000),
      // url - IDEA -> could lead to a landing page that redirects to app in store or in webstore depending on used device
      url: app.download.url
    });
  }

  return feed.xml();
}

module.exports = { generate_feed };
