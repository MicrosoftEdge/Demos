import * as Magick from 'https://cdn.jsdelivr.net/npm/wasm-imagemagick/dist/bundles/magickApi.js';
import { STEPS } from './steps.js';

export async function runFlow(flow, images) {
  const inputImages = [];
  for (const image of images) {
    const content = await image.arrayBuffer();
    const name = image.name;
    inputImages.push({ content, name });
  }

  let cmd = ['mogrify'];

  for (const step of flow.steps) {
    let stepCmd = [];

    if (STEPS[step.type] && STEPS[step.type].getCmd) {
      stepCmd = STEPS[step.type].getCmd(step);
    } else {
      stepCmd = [`-${step.type}`, step.params[0] + ''];
    }

    cmd = [...cmd, ...stepCmd];
  }

  cmd.push('*');

  try {
    const processedFiles = await Magick.call(inputImages, cmd);
    return processedFiles;
  } catch (e) {
    // FIXME: handle errors.
    return null;
  }
}
