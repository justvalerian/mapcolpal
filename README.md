# MapColPal - your pal for cartographic color palettes

MapColPal is a tool to ease working with color palettes for thematic maps.
It was originally created as part of a thesis within the Cartography M.Sc. programme and is currently maintained as a personal project. Feel free to reach out if you want to get involved!

![mapcolpal](https://user-images.githubusercontent.com/46158468/189892397-0fb4d24e-a8fd-4947-a723-0997d481136b.PNG)

## Run the code yourself

Either
1. grab the last built version from the 'dist' folder, or
2. clone the repository, run ```npm install``` and then ```npm run dev``` to run the development environment or ```npm run build``` to build it yourself

## Setup

MapColPal runs on the following stack:

### Basic setup
via https://github.com/svelte-add/svelte-add :

```sh
npm create @svelte-add/vite@latest
```
- vite & svelte
- typescript
- postCSS, tailwindCSS and daisyUI

### Further installed packages:
via npm
- d3.js to display and easily update map overlay
- chroma.js to work easier with colors
- leaflet.js to display basemap tiles
- leaflet-providers to easily use different sources for basemaps
- merge-images to merge basemap tiles to one big canvas to then extract colors from it
- color-blind to simulate CVD vision
