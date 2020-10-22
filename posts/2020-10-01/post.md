# a blog

If you're reading this, the blog server is running and successfully hosted!

Posts consist of a single directory under `./posts`, which should be should titled after the ISO 8601 date format. This directory should contain a `post.md` file with any body text, as well as any additional resources like images. 

# markdown

This blog engine supports a subset of [Markdown](https://www.markdownguide.org/) features, including titles, line breaks, bold text, italics, quotes, lists, and preformatted text.

## Titles
### h3 title
#### h4 title
##### h5 title
###### h6 title


### line Breaks
Any two consecutive newlines should be visually separated.

This line should be visually separated from the one above it!
This line should not be.


### Images
![succulent macro](./posts/2020-10-01/image.jpg)
*One of my echiaveras before etiolating in the weak sun of a Minnesota winter*


### Bold & Italic Text
Okay, now let's see if we can generate **bold text**. It should work even in the middle of a word: like**this**text!

*Asterisks form italic text*, even in the middle of word: like*this*text!

***The parser should allow for mixed bold and italic styling.***


### Quotes

> Non ridere, non lugere, neque detestari, sed intelligere.
*Not to laugh, not to lament, not to curse, but to understand.*

### Lists
Ordered lists:
1. Yamaha Bolt
2. Indian Scout
3. Kawasaki W800
4. Honda CB450
5. Triumph T100

Unordered lists:
- *The Monster at our Door* (Mike Davis)
- *El Principito* (Antoine de Saint-Exupery)
- *Stranger in a Strange Land* (Robert A. Heinlein)
- *Southern Reach* (Jeff VanderMeer)
- *The Terror* (Dan Simmons)


### Code
An example of preformatted text: `monospace`

# thanks

[This software](https://github.com/ReticulatedSpline/blog) is written on the [NodeJS](https://nodejs.org/en/) platform, with technical inspiration from this [sitepoint article](https://www.sitepoint.com/build-microblog-node-js-git-markdown/) and aesthetic inspiration from John Gruber's [daring fireball](https://daringfireball.net/) website. It was original hosted on [Heroku](https://www.heroku.com/) and given a name through [Google Domains](https://domains.google/). It may or may not be live at [strlog.net](http://www.strlog.net).