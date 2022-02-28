## a tiny nodejs blog server with dumb markdown™
### that is, context-unaware markdown

To host your own copy:
- Pull a release from the release branch (this branch is updated with features but purged of my own personal posts).
- Unzip and (optionally) add posts to ./posts. These consist of a single directory per post titled with the date in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). In this directory add any resources (such as photos) and a file titled `post.md` containing the body text. A subset of [Markdown](https://www.markdownguide.org/) syntax is supported in this file. There is also a metadata.json file containing the name of the post, a topic, and a tagline. 
- Navigate to the root directory and run `npm start`. The server will default to port 5000.
Unit tests can be run with `npm test`.

![screenshot](https://imgur.com/wbTqj35 "Screenshot")
