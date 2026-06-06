import "@testing-library/jest-dom/vitest";

if (!document.elementFromPoint) {
  document.elementFromPoint = () => document.body;
}

if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

const rect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  toJSON: () => ({})
} as DOMRect;

const rectList = {
  0: rect,
  length: 1,
  item: () => rect,
  [Symbol.iterator]: function* () {
    yield rect;
  }
} as DOMRectList;

const nodePrototype = globalThis.Node?.prototype as
  | {
      getClientRects?: () => DOMRectList;
      getBoundingClientRect?: () => DOMRect;
    }
  | undefined;

if (nodePrototype && !nodePrototype.getClientRects) {
  nodePrototype.getClientRects = () => rectList;
}

if (nodePrototype && !nodePrototype.getBoundingClientRect) {
  nodePrototype.getBoundingClientRect = () => rect;
}

if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

if (globalThis.Range) {
  if (!Range.prototype.getClientRects) {
    Range.prototype.getClientRects = () => rectList;
  }

  if (!Range.prototype.getBoundingClientRect) {
    Range.prototype.getBoundingClientRect = () => rect;
  }
}
