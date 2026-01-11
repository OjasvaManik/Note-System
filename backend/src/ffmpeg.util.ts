import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function videoToGif(inputPath: string, outputPath: string) {
  const palettePath = `${inputPath}.palette.png`;

  // 1. Palette generation (12fps, 480w)
  await execAsync(
    `ffmpeg -y -i "${inputPath}" -vf "fps=12,scale=480:-1:flags=lanczos,palettegen" "${palettePath}"`,
  );

  // 2. GIF generation
  await execAsync(
    `ffmpeg -y -i "${inputPath}" -i "${palettePath}" ` +
      `-filter_complex "fps=12,scale=480:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer" ` +
      `"${outputPath}"`,
  );
}
