# osu! Background Changer

An easy way to edit osu! backgrounds instantly.


## Requirements

| Program | Version |
|--|--|
| Node.js | v16+ |
| npm | v8+ |
| gosumemory | Any |

## Execution

> **Note**
> gosumemory must be running.

Clone the repository, or download it above the file display which says `Code` and click `Download ZIP`.

If downloading, extract the files. Click the folder path and copy it, then type `cmd` where the path should be. This will open command prompt to the folder. If you have Node.js and npm installed properly, simply run `npm install`.

Before running the program, you need to add an image. Preferrably .png or .jpg/.jpeg since my program recognises them. You may want to upload it as `background.png/jpg/jpeg` to the folder of the project.
 
Once the modules have installed, go onto the osu! map selection and select a map, type `node index --background=your_background.extension`, for example: `node index --background=background.jpg` - into the command prompt, and if the image exists, the program will recognise your image and forcefully set it to the background. Then just reopen the map and it should be changed.

## Issues

If you experience any problems, open an issue detailing your problem, (preferrably with the error given by the program!) and I will attempt to respond.
