export function normalizeQuillHtml(content: string): string {
  const container = document.createElement('div');
  container.innerHTML = content;

  // Convert NBSP characters to regular spaces.
  container.querySelectorAll('*').forEach((element) => {
    element.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        node.textContent = node.textContent.replace(/\u00a0/g, ' ');
      }
    });
  });

  // Set explicit list types based on nesting depth.
  container.querySelectorAll<HTMLOListElement>('ol').forEach((list) => {
    const level = getListDepth(list);

    const types = ['1', 'a', 'i'];

    list.setAttribute(
      'type',
      types[level % types.length]
    );
  });

  // Preserve ql-indent classes because paragraphs may rely on them.

  // Keep empty lines visible.
  container.querySelectorAll('p').forEach((p) => {
    if (!p.textContent?.trim() && !p.querySelector('br, img, video')) {
      p.innerHTML = '<br>';
    }
  });

  return container.innerHTML;
}

function getListDepth(list: HTMLOListElement): number {
  let depth = 0;
  let parent = list.parentElement;

  while (parent) {
    if (parent.tagName === 'OL') {
      depth++;
    }

    parent = parent.parentElement;
  }

  return depth;
}
