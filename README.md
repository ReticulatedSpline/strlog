## a tiny nodejs blog server

#### To host your own copy:
- Pull a release from the release branch. This branch is updated with features but purged of my own personal posts.
- Unzip the archive.
- Navigate to the root directory and run `npm start`. The server will default to port 5000.
Unit tests can be run with `npm test`.

#### Definition
The repository contains the following important directories:
- `./posts`: holds directories titled with the date in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601) representing a single blog post each. Two files are required:
  - A [Markdown](https://www.markdownguide.org/) file called `post.md`.
  - A [JSON](https://en.wikipedia.org/wiki/JSON) file with three attributes: the post name, title, and an array of topics which may be empty.
  - Additionally, you may add any resources, such as photos, to this directory. 
- `resources`: holds template html files, the favicon, an icon for link embeds, and the CSS file.
- `src`: source code, split roughly into routing / file reading (`server.js`) and markdown parsing / html building (`format.js`).
- `test`: holds the neglected unit testing suite.

#### Roadmap
1. update or remove tests
2. refactor: PageData object with named fields
3. refactor: pack globals into object
4. refactor: replace method in format.js
5. verify release branch

#### A Caveat
Markdown parsing is an audacious claim for what is really just a series of regex string manipulations. Someday I'd love to take the time to write a real parser. 

![screenshot](https://imgur.com/wbTqj35.jpg "Screenshot")
