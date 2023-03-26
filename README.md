# Match Colors

## Short info

Mini game I did just for fun.

There are `3` boxes packages (variable `BOXES_PACKAGE_NAME`):

- Rectangles (boxes_rectangles_package.css)
- Shapes (boxes_shapes_package.css)
- Blobs (boxes_blobs_package.css)

There are `2` types of movement (variable `PLAY_MOVEMENT`):

- Slide (Mobile support)
  - On desktop:
    - Hover on the box(rectangle/shape/blob) you want to move
    - Slide to the desired direction
  - On mobile:
    - Slide box(rectangle/shape/blob) to the desired direction
- Drag N Drop (No mobile support)

For now, the game only support minimum of `3` match colors.

### Adding more levels

- File: `src/scripts/levels_db.js`
- Inside `export const LEVELS = []` you can add your new levels
- You can set the minimum score for each level
- Set the only colors that allowed to be in the level
- Set the level size by adding the colors

### DEV

The `dev.js` designed for testing box movement.
So if you want to change/add movement use this file.
You can obviously add more abilities.

- Go to file: `src/scripts/dev.js`
- In the file you can find couple of tests cases I made
- To use them go to `.env.development` (If you didn't create it - do it ;) )
- Set `DEV_MODE=true`
- Set `DEV_TEST_NAME` with one of the names (E.g. `DEV_TEST_NAME=TEST1`)
- (If you didn't run the command `npm run dev` you should do it now)
- Now you can see the dev level you set.

## Start Work

Create 2 .env files.
Copy & Paste the content from `.env.example`

```
.env.development
```

```
.env.production
```

Install all packages

```
npm i
```

Generate .css files from .scss

```
npm run scss:init
```

Start dev

```
npm run dev
```

Watch scss changes

```
npm run scss:watch
```

### Build: dev

```
npm run build:dev
```

## Build: prod

```
npm run build:prod
```

## deploy: site

- Make sure you set the env variables `GIT_URL` & `GIT_SITE_BRANCH`

```
npm run deploy:site
```

### ISSUES

- `boxes_package2`\
  Active draged (Drag N Drop) shape becomes rectangle
