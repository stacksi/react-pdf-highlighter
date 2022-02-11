import React, { Component } from "react";
import clsx from 'clsx';

import "../style/Highlight.css";

import type { LTWHP } from "../types.js";

interface Props {
  position: {
    boundingRect: LTWHP;
    rects: Array<LTWHP>;
  };
  isScrolledTo: boolean;
  onClick?: () => void;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  comment?: {
    emoji: string;
    text: string;
  };
  className?: string;
}

export class Highlight extends Component<Props> {
  render() {
    const {
      position,
      isScrolledTo,
      onClick,
      onMouseOver,
      onMouseOut,
      comment,
      className
    } = this.props;

    const { rects, boundingRect } = position;

    return (
      <div
        className={`Highlight ${isScrolledTo ? "Highlight--scrolledTo" : ""}`}
      >
        {comment ? (
          <div
            className="Highlight__emoji"
            style={{
              left: 20,
              top: boundingRect.top,
            }}
          >
            {comment.emoji}
          </div>
        ) : null}
        <div className="Highlight__parts">
          {rects.map((rect, index) => (
            <div
              onMouseOver={onMouseOver}
              onMouseOut={onMouseOut}
              onClick={onClick}
              key={index}
              style={rect}
              className={clsx('Highlight__part', className)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default Highlight;
