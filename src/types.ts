import type { PDFDocumentProxy } from "@stacksi/pdfjs-dist/types/display/api";
import { FIND_STATE } from './constants';

export interface LTWH {
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface Scaled {
  x1: number;
  y1: number;

  x2: number;
  y2: number;

  width: number;
  height: number;
}

export interface Position {
  boundingRect: LTWH;
  rects: Array<LTWH>;
  pageNumber: number;
}

export interface ScaledPosition {
  boundingRect: Scaled;
  rects: Array<Scaled>;
  pageNumber: number;
  usePdfCoordinates?: boolean;
}

export interface Content {
  text?: string;
  image?: string;
}

export interface HighlightContent {
  content: Content;
}

export interface Comment {
  text: string;
  emoji: string;
}

export interface HighlightComment {
  comment: Comment;
}

export interface NewHighlight extends HighlightContent, HighlightComment {
  position: ScaledPosition;
}

export interface IHighlight extends NewHighlight {
  id: string;
}

export interface ViewportHighlight extends HighlightContent, HighlightComment {
  position: Position;
}

export interface Viewport {
  convertToPdfPoint: (x: number, y: number) => Array<number>;
  convertToViewportRectangle: (pdfRectangle: Array<number>) => Array<number>;
  width: number;
  height: number;
}

export interface T_EventBus {
  on: (eventName: string, callback: (data: any) => void) => void;
  off: (eventName: string, callback: (data: any) => void) => void;
}

export interface T_PDFJS_Viewer {
  container: HTMLDivElement;
  viewer: HTMLDivElement;
  getPageView: (page: number) => {
    textLayer: { textLayerDiv: HTMLDivElement };
    viewport: Viewport;
    div: HTMLDivElement;
    canvas: HTMLCanvasElement;
  };
  setDocument: (document: PDFDocumentProxy) => Promise<void>;
  scrollPageIntoView: (options: {
    pageNumber: number;
    destArray: Array<any>;
  }) => void;
  currentScaleValue: string;
}

export interface T_PDFJS_LinkService {
  setDocument: (document: Object) => void;
  setViewer: (viewer: T_PDFJS_Viewer) => void;
}

export interface T_PDFJS_FindController {
  executeCommand: (cmd: 'find', options: {
    caseSensitive?: boolean,
    findPrevious?: undefined,
    highlightAll?: boolean,
    phraseSearch?: boolean,
    query: string
  }) => void
  get selected(): { pageIdx: number, matchIdx: number }
}

export interface FindResult {
  state: FIND_STATE
  text: string
  position: ScaledPosition | null
}
