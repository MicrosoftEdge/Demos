// This is the list of all possible steps.
// Each step has:
// - A unique key (the property name in the STEPS object).
// - A friendly name and description, which are displayed in the UI.
// - A list of parameters, with name, type, and default values.
// - An optional getCmd function used to convert the step param to what imagemagick expects.
//   If multiple parameters are needed, then the getCmd function is mandatory. When not present
//   only the first parameter is used.

export const STEPS = {
  'scale': {
    name: 'Scale',
    description: 'Minify or magnify the image with pixel block averaging and pixel replication, respectively.',
    params: [
      { name: 'ratio', type: 'number', default: 50 }
    ],
    getCmd: (step) => ['-scale', `${step.params[0]}%`]
  },
  'resize': {
    name: 'Resize',
    description: 'Resize the image to the specified width and height, preserving the aspect ratio.',
    params: [
      { name: 'width', type: 'number', default: 900 },
      { name: 'height', type: 'number', default: 450 }
    ],
    getCmd: (step) => ['-resize', `${step.params[0]}x${step.params[1]}`]
  },
  'resize-exactly': {
    name: 'Resize (no aspect ratio)',
    description: 'Resize the image to the specified width and height, irrespective of the aspect ratio.',
    params: [
      { name: 'width', type: 'number', default: 900 },
      { name: 'height', type: 'number', default: 450 }
    ],
    getCmd: (step) => ['-resize', `${step.params[0]}x${step.params[1]}!`]
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
  'rotate': {
    name: 'Rotate',
    description: 'Rotate the image by the specified number of degrees.',
    params: [
      { name: 'angle', type: 'number', default: 0 }
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
  'flip': {
    name: 'Flip',
    description: 'Create a mirror image in the vertical direction.'
  },
  'flop': {
    name: 'Flop',
    description: 'Create a mirror image in the horizontal direction.'
  },
  'colorize': {
    name: 'Colorize',
    description: 'Colorize the image by an amount specified by value, using a specified color.',
    params: [
      { name: 'color', type: 'color', default: '#00FF59' },
      { name: 'value', type: 'number', default: 0 }
    ],
    getCmd: (step) => ['-fill', step.params[0], '-colorize', step.params[1]]
  },
  'grayscale': {
    name: 'Grayscale',
    description: 'Convert image to grayscale.',
    params: [
      { name: 'method', type: 'select', default: 'Rec709Luma', options: ['Rec601Luma', 'Rec601Luminance', 'Rec709Luma', 'Rec709Luminance', 'Brightness', 'Lightness'] }
    ]
  },
  'brightness-contrast': {
    name: 'Brightness/Contrast',
    description: 'Adjust the brightness and contrast of the image. The range of value is -100 to 100. A value of 0 means no change.',
    params: [
      { name: 'brightness', type: 'number', default: 0 },
      { name: 'contrast', type: 'number', default: 0 }
    ],
    getCmd: (step) => ['-brightness-contrast', `${step.params[0]}x${step.params[1]}`]
  },
  'negate': {
    name: 'Negate',
    description: 'Replace each pixel with its complementary color.'
  },
  'clone': {
    name: 'Clone',
    description: 'Make a clone of an image, referenced by its index. The position of this step in a flow has no effect, the input image is cloned first and then the other steps are run.',
    params: [
      { name: 'index', type: 'number', default: 0 }
    ]
  },
  'border': {
    name: 'Border',
    description: 'Add a border of the given size and color to the image. The border size will be added to the width and height of the image.',
    params: [
      { name: 'width', type: 'number', default: 10 },
      { name: 'color', type: 'color', default: '#FF0066' }
    ],
    getCmd: (step) => ['-bordercolor', step.params[1], '-border', step.params[0]]
  },
  'blur': {
    name: 'Blur',
    description: 'Blur the image with a Gaussian operator. The sigma value determines the actual mount of blurring that will take place.',
    params: [
      { name: 'sigma', type: 'number', default: 1 }
    ],
    getCmd: (step) => ['-gaussian-blur', `0x${step.params[0]}`]
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
  'sepia-tone': {
    name: 'Sepia Tone',
    description: 'Simulate a sepia tone effect. Specify a threshold between 0 and 99.9%',
    params: [
      { name: 'threshold', type: 'number', default: 80 }
    ],
    getCmd: (step) => ['-sepia-tone', `${step.params[0]}%`]
  },
  'paint': {
    name: 'Paint',
    description: 'Simulate an oil painting.',
    params: [
      { name: 'radius', type: 'number', default: 5 },
    ]
  },
  'polaroid': {
    name: 'Polaroid',
    description: 'Simulate a Polaroid picture.',
    getCmd: () => ['+polaroid']
  },
  'posterize': {
    name: 'Posterize',
    description: 'Reduce the number of colors in the image to the number of colors given by levels. Very low values of levels like 2, 3, 4 have the most visible effect.',
    params: [
      { name: 'levels', type: 'number', default: 2 }
    ]
  },
  'edge': {
    name: 'Edge',
    description: 'Detect edges within the image and highlight the edges in the resulting image.',
    params: [
      { name: 'radius', type: 'number', default: 5 }
    ]
  }
};
