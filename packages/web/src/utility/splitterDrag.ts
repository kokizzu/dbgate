export default function splitterDrag(node, axes) {
  let resizeStart = null;

  const handleResizeDown = e => {
    if (e.button !== 0) return;
    e.preventDefault();
    resizeStart = e[axes];
    document.addEventListener('mousemove', handleResizeMove, true);
    document.addEventListener('mouseup', handleResizeEnd, true);
    document.body.style.cursor = axes === 'clientX' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  };

  const handleResizeMove = e => {
    e.preventDefault();
    const diff = e[axes] - resizeStart;
    resizeStart = e[axes];
    node.dispatchEvent(
      new CustomEvent('resizeSplitter', {
        detail: diff,
      })
    );
  };
  const handleResizeEnd = e => {
    e.preventDefault();
    resizeStart = null;
    document.removeEventListener('mousemove', handleResizeMove, true);
    document.removeEventListener('mouseup', handleResizeEnd, true);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  };

  node.addEventListener('mousedown', handleResizeDown);

  return {
    destroy() {
      node.removeEventListener('mousedown', handleResizeDown);
      if (resizeStart != null) {
        document.removeEventListener('mousemove', handleResizeMove, true);
        document.removeEventListener('mouseup', handleResizeEnd, true);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    },
  };
}
