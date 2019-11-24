# ppmimagepreview README

Sample extension for preview .ppm image files in vscode.

I am generating lots of .ppm image files and got lazy. These image files are not supported in vs code's OOTB image-preview extension
so I thought I would see what extensions were all about.
http://paulbourke.net/dataformats/ppm/


## Features

previewppmimage command scans workspace for .ppm files and displays them using a web canvas.

## Requirements


## Extension Settings

...

## Known Issues

* Only tested with simple P6 1byte per color channel ppm files. A sample exists under `/sample images`.
* Slow.
* Currently vscode extension api does not seem to have a reliable way to grab currently selected file or currently open editor - 
if that editor is not a text editor, so we can't just preview the currently selected or open file.
* There are no tests.
## Release Notes

### 0.0.1

Initial commit.
