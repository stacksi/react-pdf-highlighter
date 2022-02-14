import React, { Component } from "react";
import { PDFViewer } from "@stacksi/pdfjs-dist/web/pdf_viewer";
import type { Position } from "../types";

interface State {
  height: number;
  width: number;
}

interface Props {
  children: JSX.Element | null;
  position: Position;
  viewer: PDFViewer;
}

const clamp = (value: number, left: number, right: number) =>
  Math.min(Math.max(value, left), right);

export class TipContainer extends Component<Props, State> {
  state: State = {
    height: 0,
    width: 0,
  };

  node: HTMLDivElement | null = null;

  componentDidUpdate(nextProps: Props) {
    if (this.props.children !== nextProps.children) {
      this.updatePosition();
    }
  }

  componentDidMount() {
    setTimeout(this.updatePosition, 0);
  }

  updatePosition = () => {
    if (!this.node) {
      return;
    }

    const { offsetHeight, offsetWidth } = this.node;

    this.setState({
      height: offsetHeight,
      width: offsetWidth,
    });
  };

  render() {
    const { children, viewer, position } = this.props;
    const { height, width } = this.state;

    const isStyleCalculationInProgress = width === 0 && height === 0;

    const { boundingRect, pageNumber } = position;
    const page = {
      node: viewer.getPageView((boundingRect.pageNumber || pageNumber) - 1).div,
      pageNumber: boundingRect.pageNumber || pageNumber,
    };

    const pageBoundingClientRect = page.node.getBoundingClientRect();

    const pageBoundingRect = {
      bottom: pageBoundingClientRect.bottom,
      height: pageBoundingClientRect.height,
      left: pageBoundingClientRect.left,
      right: pageBoundingClientRect.right,
      top: pageBoundingClientRect.top,
      width: pageBoundingClientRect.width,
      x: pageBoundingClientRect.x,
      y: pageBoundingClientRect.y,
      pageNumber: page.pageNumber,
    };

    const style = {
      left:
        page.node.offsetLeft + boundingRect.left + boundingRect.width / 2,
      top: boundingRect.top + page.node.offsetTop,
      bottom: boundingRect.top + page.node.offsetTop + boundingRect.height,
    }

    const shouldMove = style.top - height - 5 < viewer.container.scrollTop;

    const top = shouldMove ? style.bottom + 5 : style.top - height - 5;

    const left = clamp(
      style.left - width / 2,
      0,
      pageBoundingRect.width - width
    );

    const childrenWithProps = React.Children.map(children, (child) =>
      // @ts-ignore
      React.cloneElement(child, {
        onUpdate: () => {
          this.setState(
            {
              width: 0,
              height: 0,
            },
            () => {
              setTimeout(this.updatePosition, 0);
            }
          );
        },
        popup: {
          position: shouldMove ? "below" : "above",
        },
      })
    );

    return (
      <div
        className="PdfHighlighter__tip-container"
        style={{
          visibility: isStyleCalculationInProgress ? "hidden" : "visible",
          top,
          left,
        }}
        ref={(node) => {
          this.node = node;
        }}
      >
        {childrenWithProps}
      </div>
    );
  }
}

export default TipContainer;
