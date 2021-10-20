# Link

A link is an entity that has two parts: a url, and optionally, a hyperlink.
A hyperlink is a string that substitutes for the url.

## Creation

A user can create a link entity in one of two ways. Either we generate a link using the link button, or a user can enter a valid url in the editor box. The link button is contained within the formatting toolbar.

If the user generates a link using the link button, a valid link meets the following conditions:

- has a valid top-level-domain
- the user is not required to specify a hyperlink to create a link

Once generated, the link will be assigned styling.

## UI

We will give link text "link" styling - a blue, underlined, and italic font.
We will use a decorator to style valid links

## UX

If the editor is in focus and the cursor's current index is == the link's range, we say the link has focus and we display a tooltip that allows the user to change or remove the link.

A link is considered a link if at least one character exists. If the link is of length l, deleting l-1 characters does not change the state of the link. If the entire text of the link is removed, then the link is deleted from editor state

A link has a "starting" and "closing" index. Suppose a link contains l-many characters. If a user's cursor is on the closing index+1 and they type characters at this position, we do not append those characters to the link. The characters typed assume default inline text, unless inline formatting is specified otherwise.

## To Markdown

## From Markdown
