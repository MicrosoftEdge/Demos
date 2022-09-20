import * as Magick from 'https://cdn.jsdelivr.net/npm/wasm-imagemagick/dist/bundles/magickApi.js';
import { STEPS } from './steps.js';

async function fetchImage(url) {
  const fetchedSourceImage = await fetch(url);
  const name = url.split('/').pop();
  const content = new Uint8Array(await fetchedSourceImage.arrayBuffer());
  return { name, content };
}

export async function runFlow(flow) {
  const cmd = ['convert', '*'];

  for (const step of flow.steps) {
    let stepCmd = [];

    if (STEPS[step.type] && STEPS[step.type].getCmd) {
      stepCmd = STEPS[step.type].getCmd(step);
    } else {
      stepCmd = [`-${step.type}`, step.params[0] + ''];
    }

    cmd.push(stepCmd[0]);
    cmd.push(stepCmd[1]);
  }

  cmd.push('out-%d.png');

  const img1 = await fetchImage('/wami/images/sample1.jpg');
  const img2 = await fetchImage('/wami/images/sample2.png');
  const img3 = await fetchImage('/wami/images/sample3.png');
  const img4 = await fetchImage('/wami/images/sample4.jpg');
  const img5 = await fetchImage('/wami/images/sample5.jpg');

  try {
    const processedFiles = await Magick.call([img1, img2, img3, img4, img5], cmd);
    return processedFiles;
  } catch (e) {
    // FIXME: handle errors.
    return null;
  }
}
