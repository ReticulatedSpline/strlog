## A blog server with zero dependencies and a clean, pure-HTML interface.
To host your own copy:
- Pull a release
- Unzip and (optionally) add posts to ./posts. These consist of a single directory per post titled with the date in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). In this directory add any resources (such as photos) and a file titled `post.md` containing the body text. A subset of Markdown syntax is supported.
- Navigate to the root directory and run `npm start`. The server will default to port 5000.
