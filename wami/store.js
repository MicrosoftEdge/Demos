import { get, set, del } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';
import { getUniqueId } from './utils.js';

export async function getFlows() {
  let flows = await get('wami-flows');

  // If this is the first time using the app, there won't be any flows.
  // Let's create a couple of demo flows so the app isn't empty.
  if (!flows) {
    flows = [
      {
        name: 'Resize to 1300px at most',
        id: getUniqueId(),
        steps: [
          {
            type: 'resize-width-if-larger',
            params: [1300]
          }
        ],
      },
      {
        name: 'Make green and sharpen',
        id: getUniqueId(),
        steps: [{
          type: 'fill',
          params: ['#00ffff']
        }, {
          type: 'colorize',
          params: [50]
        }, {
          type: 'sharpen',
          params: [0, 1]
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
      },
      {
        name: 'Crop a little region',
        id: getUniqueId(),
        steps: [{
          type: 'crop',
          params: [200, 200, 0, 0]
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
