# how to connect real youtube music to mura

hi! since you're new to coding, i've broken this down into the simplest steps possible. you don't need a premium subscription for this.

## step 1: the search engine
right now, mura searches a small list of songs i wrote. to make it search all of youtube:
1. go to the **google cloud console**.
2. create a project and enable the **youtube data api v3**.
3. get your **api key**.
4. in `src/lib/music-service.ts`, you would change the code to "fetch" data from `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=YOUR_API_KEY`.

## step 2: the player
to actually play the videos as audio:
1. you need to install a helper. in your terminal, type: `npm install react-player`.
2. in `src/components/mura/Player.tsx`, you will replace the `<audio>` tag with a component called `<ReactPlayer />`.
3. you give it the youtube link: `url={"https://www.youtube.com/watch?v=" + currentTrack.youtubeId}`.
4. set `width={0}` and `height={0}` so it stays invisible, working just like an audio player.

## step 3: track data
make sure your `Track` type in `src/lib/types.ts` has a field called `youtubeId`. this stores the unique code for each video (like `dQw4w9WgXcQ`).

## why this works for free
- **spotify** charges developers to use their player.
- **youtube** gives their player away for free as long as you follow their "embedding" rules. by using `react-player`, you are essentially "watching" the video invisibly, which is allowed on free accounts.

good luck with your project!