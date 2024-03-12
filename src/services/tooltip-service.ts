export function getTooltipPosition(clientX: number, clientY: number, tooltipElement: any) {
 
  const rect = tooltipElement?.$el?.getBoundingClientRect();
  const elWidth = rect?.width;
  const elHeight = rect?.height;
 
  const windowWidth = window.innerWidth;
  
  const offsetY = 20;
  const offsetX = 20;
  const isLeftBorder = clientX < elWidth
  const isTopBorder = clientY < elHeight

  const isRightBorder = (clientX + elWidth / 2 + offsetX + 30) > windowWidth
  
  const leftPosition = isLeftBorder ? (clientX + offsetX ) : ((clientX - elWidth / 2) + window.scrollX + offsetX);
  const topPosition = isTopBorder ? (clientY + offsetY) : (clientY - (elHeight + window.scrollY) - offsetY);

  const leftCorrect = isRightBorder ? (clientX - elWidth)  : leftPosition;
 
  return {
    left: leftCorrect,
    top: topPosition
  };
}

export function isPointOverText(event: any) {
  const x = event?.clientX;
  const y = event?.clientY;
  const element = document.elementFromPoint(x, y);
  if (element == null) return false;
  const nodes = element.childNodes;
  for (let i = 0, node; (node = nodes[i++]);) {
    if (node.nodeType === 3) {
      const range = document.createRange();
      range.selectNode(node);
      const rects = range.getClientRects();
      for (let j = 0, rect; (rect = rects[j++]);) {
        if (
          x > rect.left &&
          x < rect.right &&
          y > rect.top &&
          y < rect.bottom
        ) {
          if (node.nodeType === Node.TEXT_NODE) return true;
        }
      }
    }
  }
  return false;
}