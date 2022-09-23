import { get, set, del } from 'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm';
import { getUniqueId } from './utils.js';

export async function getFlows() {
  let flows = await get('wami-flows');

  // If this is the first time using the app, there won't be any flows.
  // Let's create a couple of demo flows so the app isn't empty.
  if (!flows) {
    flows = [
      {
        name: 'Resize to 1300px wide max',
        id: getUniqueId(),
        steps: [
          {
            type: 'resize-width-if-larger',
            params: [1300]
          }
        ],
      },
      {
        name: 'Pixelate',
        id: getUniqueId(),
        steps: [{
          type: 'scale',
          params: [10]
        }, {
          type: 'scale',
          params: [1000]
        }],
      },
      {
        name: 'Resize to 200x200',
        id: getUniqueId(),
        steps: [{
          type: 'resize-exactly',
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
