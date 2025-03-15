# Image Pixelator

A React component that allows users to upload images and apply an adjustable pixelation effect. This component provides a user-friendly interface for transforming images into a pixel art style with customizable pixel size.

![Image Pixelator Demo](placeholder-for-screenshot.png)

## Features

- **Drag-and-drop interface** for easy image uploading
- **File browser** option for selecting images
- **Adjustable pixel size** with real-time preview of the setting
- **Visual feedback** during processing
- **Download functionality** for saving pixelated images
- **Responsive design** that works on both desktop and mobile devices

## Installation

### Prerequisites

- React (16.8 or higher for Hooks support)
- Node.js and npm/yarn

### Setup

1. Copy the `ImagePixelator.jsx` file to your project's components directory.

2. Make sure your project has the required dependencies:
   ```
   npm install react react-dom
   ```

3. If you're using the Tailwind CSS classes as shown in the component, ensure it's installed:
   ```
   npm install tailwindcss
   ```

## Usage

Import and use the component in your React application:

```jsx
import React from 'react';
import ImagePixelator from './components/ImagePixelator';

function App() {
  return (
    <div className="App">
      <h1>My Image Pixelator App</h1>
      <ImagePixelator />
    </div>
  );
}

export default App;
```

## How It Works

1. The user uploads an image using drag-and-drop or the file browser
2. The image is loaded into the browser memory using FileReader API
3. When the user clicks "Pixelate Image", the component:
   - Draws the original image to a hidden canvas
   - Applies the pixelation algorithm, creating blocks of color based on the selected pixel size
   - Converts the pixelated canvas to a data URL
   - Displays the result to the user
4. The user can download the pixelated image or adjust the settings and try again

## Pixelation Algorithm

The pixelation effect works by:
1. Dividing the image into square blocks based on the pixel size
2. For each block, sampling the color of the top-left pixel
3. Filling the entire block with that sampled color

This creates the distinctive "blocky" pixelated appearance.

## Customization

### Styling

The component uses Tailwind CSS classes for styling. If you're not using Tailwind, you can replace these classes with your own CSS.

### Pixel Size Range

The default pixel size range is 2-50 pixels. You can adjust this by modifying the `min` and `max` values on the range input:

```jsx
<input
  type="range"
  min="2"  // Minimum pixel size
  max="50" // Maximum pixel size
  value={pixelSize}
  onChange={handlePixelSizeChange}
  className="..."
/>
```

### Output Format

By default, the pixelated image is saved as a PNG. You can change this by modifying the `toDataURL` parameter in the `pixelateImage` function:

```javascript
setPixelatedImage(canvas.toDataURL('image/jpeg', 0.9)); // For JPEG with 90% quality
```

## Browser Compatibility

This component should work in all modern browsers that support:
- HTML5 Canvas
- FileReader API
- Drag and Drop API

## Performance Considerations

For very large images or small pixel sizes, the pixelation process can be resource-intensive. The component uses `setTimeout` to ensure the UI remains responsive during processing.

## Future Improvements

Potential enhancements for this component:
- Add different pixelation algorithms
- Include image filters and effects
- Add options for color depth reduction
- Implement multi-pass processing for larger images
- Add ability to pixelate only specific areas of an image

## License

Feel free to use and modify as needed.

## Credits

Created by Rini Joy