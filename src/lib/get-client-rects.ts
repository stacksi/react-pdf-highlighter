import type { LTWHP, Page } from "../types.js";

import optimizeClientRects from "./optimize-client-rects";
import { getPageFromElement, isHTMLElement } from './pdfjs-dom.js';

const isClientRectInsidePageRect = (clientRect: DOMRect, pageRect: DOMRect) => {
  if (clientRect.top < pageRect.top) {
    return false;
  }
  if (clientRect.bottom > pageRect.bottom) {
    return false;
  }
  if (clientRect.right > pageRect.right) {
    return false;
  }
  if (clientRect.left < pageRect.left) {
    return false;
  }

  return true;
};

const getPageBorders = (page: Page) => {
  const style = getComputedStyle(page.node);
  return {
    borderTop: parseFloat(style.borderTopWidth.replace('px', '')),
    borderLeft: parseFloat(style.borderLeftWidth.replace('px', '')),
    borderBottom: parseFloat(style.borderBottomWidth.replace('px', '')),
    borderRight: parseFloat(style.borderRightWidth.replace('px', '')),
  }
}

const getLimitsY = (range: Range) => {
  const limits = {
    start: { y: 0, page: -1 },
    end: { y: 99999, page: -1 }
  }

  const startEl = range.startContainer.parentElement
  const endEl = range.endContainer.parentElement

  if (isHTMLElement(startEl)) {
    limits.start = {
      y: startEl!.offsetTop - startEl!.offsetHeight,
      page: getPageFromElement(startEl!)?.number || -1
    }
  }

  if (isHTMLElement(endEl)) {
    limits.end = {
      y: endEl!.offsetTop + endEl!.offsetHeight,
      page: getPageFromElement(endEl!)?.number || -1
    }
  }

  return limits
}

const getClientRects = (
  range: Range,
  pages: Page[],
  shouldOptimize: boolean = true
): Array<LTWHP> => {
  const limits = getLimitsY(range)
  const clientRects = Array.from(range.getClientRects());
  const rects: LTWHP[] = [];

  for (const clientRect of clientRects) {
    for (const page of pages) {
      const pageRect = page.node.getBoundingClientRect();
      const { borderTop, borderBottom, borderLeft, borderRight } = getPageBorders(page);

      if (
        isClientRectInsidePageRect(clientRect, pageRect) &&
        clientRect.top >= 0 &&
        clientRect.bottom >= 0 &&
        clientRect.width > 0 &&
        clientRect.height > 0 &&
        clientRect.width < pageRect.width - borderLeft - borderRight &&
        clientRect.height < pageRect.height - borderTop - borderBottom
      ) {
        const rect = {
          top: clientRect.top + page.node.scrollTop - pageRect.top - borderTop,
          left: clientRect.left + page.node.scrollLeft - pageRect.left - borderLeft,
          width: clientRect.width,
          height: clientRect.height,
          pageNumber: page.number,
        } as LTWHP;

        if (rect.top >= borderTop && rect.left >= borderLeft
          && (page.number === limits.start.page && rect.top >= limits.start.y
            || page.number !== limits.start.page)
          && (page.number === limits.end.page && rect.top <= limits.end.y
            || page.number !== limits.end.page)
        ) {
          rects.push(rect);
        }
      }
    }
  }

  return shouldOptimize ? optimizeClientRects(rects) : rects;
};

export default getClientRects;
