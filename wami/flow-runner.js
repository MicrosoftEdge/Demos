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
  let clonedIndex = 1;

  for (const step of flow.steps) {
    // The clone step is special. It works with imagemagick but
    // not with mogrify. So we don't actually generate an IM
    // command for it. Instead we just add the image to the
    // inputImages array.
    if (step.type === 'clone') {
      const sourceImage = inputImages[step.params[0]];
      const destImage = { ...sourceImage };
      destImage.name =
        sourceImage.name.substring(0, sourceImage.name.lastIndexOf('.')) +
        '-' +
        clonedIndex +
        sourceImage.name.substring(sourceImage.name.lastIndexOf('.'));

      clonedIndex++;

      inputImages.splice(step.params[0] + 1, 0, destImage);
      continue;
    }

    let stepCmd = [];

    if (STEPS[step.type] && STEPS[step.type].getCmd) {
      stepCmd = STEPS[step.type].getCmd(step);
    } else if (step.params.length) {
      stepCmd = [`-${step.type}`, step.params[0] + ''];
    } else {
      stepCmd = [`-${step.type}`];
    }

    cmd = [...cmd, ...stepCmd];
  }

  cmd.push('*');

  try {
    // This is counter-intuitive but it actually feels better to users if the flow takes a bit
    // of time to run. Here we wait both for ImageMagick to run AND for a timer to finish.
    // If the flow is complicated and ImageMagick takes a while to run, we'll just wait for this to
    // be done.
    // But if the flow is trivial and runs in a few milliseconds, the user won't be able to tell that
    // anything has run at all. We want to make sure that the user can see the "running" state.
    const res = await Promise.all([getFakeWaitingTimePromise(), Magick.call(inputImages, cmd)]);
    const processedFiles = res[1];
    return processedFiles;
  } catch (e) {
    // FIXME: handle errors.
    return null;
  }
}

function getFakeWaitingTimePromise() {
  return new Promise(r => {
    setTimeout(r, 700);
  });
}
