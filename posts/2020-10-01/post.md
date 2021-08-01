# hello world
You've successfully hosted the strlog server! New posts consist of a single directory under ./posts, which should be should titled after the ISO 8601 date format. This directory should contain a post.md file with any body text as well as any additional resources (like images). 

# markdown
This software supports a subset of [Markdown](https://www.markdownguide.org/) features, including titles, line breaks, bold text, italics, quotes, lists, and preformatted text. It is rendered like this:

# h1 title
## h2 title
### h3 title
#### h4 title
##### h5 title
###### h6 title

Any two consecutive newlines should be visually separated.

This line should be visually separated from the one above it!
This line should not be.

## images
![One of my echiaveras before etiolating in the weak sun of a Minnesota winter](image.jpg)
Given [alt-text](https://en.wikipedia.org/wiki/Alt_attribute) appears below the image in italics. Always include it! Accessibility is important.

## bold & italics
Okay, now let's see if we can generate **bold text**. It should work even in the middle of a word: like**this**text! *Asterisks form italic text*, also in the middle of word: like*this*text! ***The parser should allow for mixed bold and italic styling.***


## quotes
> Non ridere, non lugere, neque detestari, sed intelligere.
Not to laugh, not to lament, not to curse, but to understand.

## Ordered Lists
1. Yamaha Bolt
2. Indian Scout
3. Kawasaki W800
4. Honda CB450
5. Triumph T100

## unordered lists:
- *The Monster at our Door* (Mike Davis)
- *El Principito* (Antoine de Saint-Exupery)
- *Stranger in a Strange Land* (Robert A. Heinlein)
- *Southern Reach* (Jeff VanderMeer)
- *The Terror* (Dan Simmons)


## code
An example of preformatted text: `monospace`

## thanks

The code and content of this blog are hosted on [github](https://github.com/ReticulatedSpline/blog). So far, it consists of a partial [regex](https://en.wikipedia.org/wiki/Regular_expression) based [Markdown](https://www.markdownguide.org/) parser (a sane person would have used a library) and a web server. The code is written on the [NodeJS](https://nodejs.org/en/) platform, with technical inspiration from this [sitepoint article](https://www.sitepoint.com/build-microblog-node-js-git-markdown/) and aesthetic inspiration from John Gruber's [daring fireball](https://daringfireball.net/) website. It was originally hosted on [Heroku](https://www.heroku.com/) and given a name through [Google Domains](https://domains.google/). It may or may not be live at [strlog.net](http://www.strlog.net).