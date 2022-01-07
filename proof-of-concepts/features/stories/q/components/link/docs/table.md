# Table

## Creation

on button click of generate table, call insertTable()

- generate a generic default table
- two rows, three columns

insertTable
calls createTable()
new editor state with inserted table = createTable result
calls setEditor(new editor state)

createTable, creates a table object that can be inserted into the editor state
returns new editor state

blockRenderer(block) BlockComponent or null
if the block type is atomic
then return the block component
else
return null

BlockComponent(props)
switch on the prop type
case type is Table
render Table Component
case type is Link
render Link Component
case type is File
render File Component
default
throw an error of unhandled type

### Table Internals Creation

use a reducer for table details
a single function with a type:

- column to the left
- column to the right
- row above
- row below
- align left
- align right
- align center
  should call a createFunction if inserting columns/rows
  returns new editor state

or changes the inline styling
returns new editor state

the reducer calls setEditorState

### UI

We need to define a mapping from Block Type to Appearance

## To Markdown

We must transform the

## To Content Object
