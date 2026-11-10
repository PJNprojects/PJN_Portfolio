# Media

Everything the site shows is in this folder and is referenced by name from `src/content/site.ts`.
Replace a file with a new one **under the same name** and the site picks it up.

| File | Shown in | Size |
| --- | --- | --- |
| `collar-enclosure-1536.webp`, `-900.webp` | Hero | 3:2 landscape, 1536 and 900 px wide |
| `collar-base-1120.webp`, `-640.webp` | Teardown: Enclosure | 4:5 portrait, 1120 and 640 px wide |
| `collar-board-1086.webp`, `-640.webp` | Teardown: Circuit board | 3:4 portrait, 1086 and 640 px wide |
| `collar-coil-1086.webp`, `-640.webp` | Teardown: Antenna coil | 3:4 portrait, 1086 and 640 px wide |
| `bench-scope-1600.webp`, `-800.webp` | Teardown: Bench test, and Lab | 16:9 landscape, 1600 and 800 px wide |
| `heat-detection.mp4` | Film | 1280 px wide, H.264, no audio, about 7 MB |
| `heat-detection-poster.webp` | Film, before it plays | one frame of the video, 1280 px wide |
| `og.jpg` | Link previews (WhatsApp, LinkedIn) | 1200 × 630 |

If a new picture has a different width, change the two numbers in its `picture(...)` line in
`site.ts` to match the new file names.

## Making the files (needs ffmpeg)

```bash
# a photo, large and small
ffmpeg -i photo.png -vf scale=1120:-2 -quality 80 collar-base-1120.webp
ffmpeg -i photo.png -vf scale=640:-2  -quality 80 collar-base-640.webp

# a video: 1280 wide, 30 fps, no sound, starts playing before it has fully downloaded
ffmpeg -i clip.mp4 -an -vf "fps=30,scale=1280:-2" -c:v libx264 -crf 27 -preset slow -movflags +faststart heat-detection.mp4

# its poster frame
ffmpeg -ss 1 -i heat-detection.mp4 -frames:v 1 -quality 78 heat-detection-poster.webp
```

Shoot pictures on a dark, plain background so they sit on the page the way the current ones do.
Keep photos under about 200 KB and the video under 8 MB. If the video gets new scenes, update the
chapter start times in `film.chapters` (`site.ts`).

Never put anything here that names a client's parts, chips or suppliers.
