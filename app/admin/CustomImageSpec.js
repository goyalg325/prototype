// CustomImageSpec.js

import ImageSpec from 'quill-blot-formatter/dist/specs/ImageSpec';

class CustomImageSpec extends ImageSpec {
  constructor(formatter) {
    super(formatter);
  }

  // Override the 'init' method to include a scroll event listener
  init() {
    super.init();
    this.formatter.quill.root.addEventListener('scroll', () => {
      this.formatter.repositionOverlay();
    });
  }
}

export default CustomImageSpec;
