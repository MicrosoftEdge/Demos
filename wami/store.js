import { get, set, del } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';
import { getUniqueId } from './utils.js';

export async function getFlows() {
  let flows = await get('wami-flows');

  // If this is the first time using the app, there won't be any flows.
  // Let's create a couple of demo flows so the app isn't empty.
  if (!flows) {
    flows = [
      {
        name: 'Resize to 1300px',
        id: getUniqueId(),
        steps: [
          {
            type: 'resize-width-if-larger',
            params: [1300]
          }
        ],
      },
      {
        name: 'Greenify',
        id: getUniqueId(),
        steps: [{
          type: 'grayscale',
          params: ['Rec709Luminance']
        }, {
          type: 'colorize',
          params: ['#00ff59', 50]
        }, {
          type: 'resize',
          params: [300, 300]
        }],
      },
      {
        name: 'Pixelate',
        id: getUniqueId(),
        steps: [{
          type: 'scale',
          params: ['10%']
        }, {
          type: 'scale',
          params: ['1000%']
        }],
      },
      {
        name: 'Resize to 200x200',
        id: getUniqueId(),
        steps: [{
          type: 'resize',
          params: [200, 200]
        }]
      }
    ];
    await set('wami-flows', flows);
  }
  return flows;
}

export async function saveFlows(flows) {
  await set('wami-flows', flows);
}
