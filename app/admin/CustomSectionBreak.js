// components/CustomSectionBreak.js
import Quill from 'quill';

const BlockEmbed = Quill.import('blots/block/embed');

class SectionBreak extends BlockEmbed {
  static create() {
    const node = super.create();
    node.setAttribute('class', 'section-break');
    node.innerHTML = '<hr>'; // Use <hr> or any other element to visualize the break
    return node;
  }
}

SectionBreak.blotName = 'sectionBreak';
SectionBreak.tagName = 'div';
SectionBreak.className = 'section-break';

Quill.register(SectionBreak);

export default SectionBreak;
