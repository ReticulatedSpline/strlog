## strlog is a static site server
This project serves blog posts using the built-in http module provided by the NodeJS standard library. In addition, it parses markdown files to provide page styling and supports tags for organizing posts. The github repository itself serves as a content repository. When setup with a CI pipeline, publishing a post is as simple as pushing a git commit.

![screenshot](https://imgur.com/wbTqj35.jpg "Screenshot")

#### hosting your own copy:
- Pull a release from the release branch. This branch is updated with features but purged of my own personal posts.
- Unzip the archive.
- Navigate to the root directory and run `npm start local`. The server will default to port 5000.

#### roadmap
1. move navbar to side on desktop
5. single template / remove error.html
3. all routes accesible on desktop
2. all routes accessible on mobile
2. server.js cleanup
4. linktree style homepage styled off the error route
7. full markdown parsing 

#### caveats
Markdown parsing is an audacious claim for what is really just a series of regex string replace calls. It is not possible to fully cover the mardown spec this way because it is not context-aware. Sufficiently complex Markdown will break the "parser".

#### directory structure
The repository contains the following important directories:
- `./posts`: holds directories titled with the date in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) representing a single blog post each. Two files are required:
  - A [Markdown](https://www.markdownguide.org/) file called `post.md`.
  - A [JSON](https://en.wikipedia.org/wiki/JSON) file with three attributes: the post name, title, and an array of topics which may be empty.
  - Additionally, you may add any resources, such as photos, to this directory.
  - A special directory called "about" holds the content for the about page.
- `resources`: holds template html files, the favicon, an icon for link embeds, and the CSS file.
- `src`: source code, split roughly into routing / file reading (`server.js`) and markdown parsing / html building (`format.js`).
- `test`: holds the unit tests.
