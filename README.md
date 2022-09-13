# MapColPal - Proof of concept

## Basic setup
via https://github.com/svelte-add/svelte-add :

```sh
npm create @svelte-add/vite@latest
```
- vite & svelte
- typescript
- postCSS, tailwindCSS and daisyUI

## Further installed packages:
via npm
- d3.js to display and easily update map overlay
- chroma.js to work easier with colors
- leaflet.js to display basemap tiles
- leaflet-providers to easily use different sources for basemaps
- merge-images to merge basemap tiles to one big canvas to then extract colors from it
- color-blind to simulate CVD vision