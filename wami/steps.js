// This is the list of all possible steps.
// Each step has:
// - A unique key (the property name in the STEPS object).
// - A friendly name and description, which are displayed in the UI.
// - A list of parameters, with name, type, and default values.
// - An optional getCmd function used to convert the step param to what imagemagick expects.
//   If multiple parameters are needed, then the getCmd function is mandatory. When not present
//   only the first parameter is used.

export const STEPS = {
  'colorize': {
    name: 'Colorize',
    description: 'Colorize the image by an amount specified by value, using a specified color.',
    params: [
      { name: 'color', type: 'color', default: 'lime' },
      { name: 'value', type: 'number', default: 0 }
    ],
    getCmd: (step) => ['-fill', step.params[0], '-colorize', step.params[1]]
  },
  'rotate': {
    name: 'Rotate',
    description: 'Rotate the image by the specified number of degrees.',
    params: [
      { name: 'angle', type: 'number', default: 0 }
    ]
  },
  'scale': {
    name: 'Scale',
    description: 'Minify or magnify the image with pixel block averaging and pixel replication, respectively.',
    params: [
      { name: 'ratio', type: 'text', default: '50%' }
    ]
  },
  'crop': {
    name: 'Crop',
    description: 'Cut out a rectangular region of the image.',
    params: [
      { name: 'width', type: 'number', default: 256 },
      { name: 'height', type: 'number', default: 256 },
      { name: 'x', type: 'number', default: 0 },
      { name: 'y', type: 'number', default: 0 }
    ],
    getCmd: (step) => ['-crop', `${step.params[0]}x${step.params[1]}+${step.params[2]}+${step.params[3]}`]
  },
  'resize': {
    name: 'Resize',
    description: 'Resize the image to the width and height specified.',
    params: [
      { name: 'width', type: 'number', default: 900 },
      { name: 'height', type: 'number', default: 450 }
    ],
    getCmd: (step) => ['-resize', `${step.params[0]}x${step.params[1]}`]
  },
  'resize-width-if-larger': {
    name: 'Resize width if larger than',
    description: 'Resize the image. If the width is larger than the specified value, resize the image to the specified width. The height is automatically adjusted to maintain the aspect ratio.',
    params: [
      { name: 'width', type: 'number', default: 900 },
    ],
    getCmd: (step) => ['-resize', `${step.params[0]}x>`]
  },
  'resize-height-if-larger': {
    name: 'Resize height if larger than',
    description: 'Resize the image. If the height is larger than the specified value, resize the image to the specified height. The width is automatically adjusted to maintain the aspect ratio.',
    params: [
      { name: 'height', type: 'number', default: 450 },
    ],
    getCmd: (step) => ['-resize', `x${step.params[0]}>`]
  },
  'sharpen': {
    name: 'Sharpen',
    description: 'Sharpen the image using a Gaussian operator of the given radius and standard deviation (sigma). For reasonable results, the radius should be larger than sigma. Use a radius of 0 and Sharpen() selects a suitable radius for you. Use a sigma of 1.0 and Sharpen() selects a suitable sigma for you.',
    params: [
      { name: 'radius', type: 'number', default: 0 },
      { name: 'sigma', type: 'number', default: 1 }
    ],
    getCmd: (step) => ['-sharpen', `${step.params[0]}x${step.params[1]}`]
  },
  'grayscale': {
    name: 'Grayscale',
    description: 'Convert image to grayscale.',
    params: [
      { name: 'method', type: 'select', default: 'Rec709Luma', options: ['Rec601Luma', 'Rec601Luminance', 'Rec709Luma', 'Rec709Luminance', 'Brightness', 'Lightness'] }
    ]
  }
};
