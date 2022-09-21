## a tiny nodejs blog server
This project serves blog posts using the built-in http module provided by the NodeJS standard library. In addition, it parses markdown files to provide page styling and supports a tags for organizing posts. Strlog uses its own github repository as a content repository. When setup with a CI pipeline, publishing a post is as simple as pushing a git commit.

![screenshot](https://imgur.com/wbTqj35.jpg "Screenshot")

#### hosting your own copy:
- Pull a release from the release branch. This branch is updated with features but purged of my own personal posts.
- Unzip the archive.
- Navigate to the root directory and run `npm start`. The server will default to port 5000.
Unit tests can be run with `npm test`.

#### roadmap
1. update or remove tests
2. refactor: better interface between server.js and format.js
4. refactor: pack globals into object
5. refactor: better text replace method in format.js
7. full markdown parsing 

#### a caveat
Markdown parsing is an audacious claim for what is really just a series of regex string manipulations. It is not possible to fully cover the mardown spec this way because it is not context-aware. Sufficiently complex Markdown will break the "parser". Someday I'd love to take the time to write a real one.

#### layout
The repository contains the following important directories:
- `./posts`: holds directories titled with the date in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) representing a single blog post each. Two files are required:
  - A [Markdown](https://www.markdownguide.org/) file called `post.md`.
  - A [JSON](https://en.wikipedia.org/wiki/JSON) file with three attributes: the post name, title, and an array of topics which may be empty.
  - Additionally, you may add any resources, such as photos, to this directory.
  - A special directory called "about" holds the content for the about page.
- `resources`: holds template html files, the favicon, an icon for link embeds, and the CSS file.
- `src`: source code, split roughly into routing / file reading (`server.js`) and markdown parsing / html building (`format.js`).
- `test`: holds the unit tests.
