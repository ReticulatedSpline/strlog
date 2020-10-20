# A Markdown test page

Wow! Seems like routing works, as the URL has changed. Let's test out some markdown features...

## h2 title
### h3 title
#### h4 title
##### h5 title
###### h6 title

Lets test out line breaks:

This line should be visually separated!
This line should not be.

Okay, now let's see if we can generate bold text, either with **asterisk notation** or __underscore notation__. It should work even in the middle of a word: like**this**text!

Another markdown feature is italicized text, again both with *asterisks* or _underscore_ notation, and in the middle of word: like*this*text!

***The parser should allow for mixed bold and italic styling.***

Block quotes:
> Life is nasty, brutish, and short.

Multiple paragraph block quotes:
> Non ridere, non lugere, neque detestari, sed intelligere.
>
> Not to laugh, not to lament, not to curse, but to understand.

Ordered lists:
1. Yamaha Bolt
2. Indian Scout
3. Kawasaki W800
4. Honda CB450
5. Triumph T100

Unordered lists:
- The Monster at our Door (Mike Davis)
- El Principito (Antoine de Saint-Exupery)
- Stranger in a Strange Land (Robert A. Heinlein)
- Southern Reach (Jeff VanderMeer)
- The Terror (Dan Simmons)

Here's `preformatted` text, and also a quick code sample:
	const CSS_MIME = { 'Content-Type': 'text/css' };
	const HTML_MIME = { 'Content-Type': 'text/html' };
	const PNG_MIME = { 'Content-Type': 'image/png' };
	const JPG_MIME = { 'Content-Type': 'image/jpg' };

A divider:

---

That concludes the test of all the Markdown elements I'd like to support.