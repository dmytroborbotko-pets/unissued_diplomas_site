import { Fragment } from "react";

const renderChildren = (children, strongClassName) =>
  children.map((child, i) => {
    if (child.type === "link") {
      return (
        <a key={i} href={child.url} target="_blank" rel="noopener noreferrer" className="underline">
          {renderChildren(child.children, strongClassName)}
        </a>
      );
    }
    let node = child.text;
    if (child.bold) node = <strong className={strongClassName}>{node}</strong>;
    if (child.italic) node = <em>{node}</em>;
    return <Fragment key={i}>{node}</Fragment>;
  });

// Strapi "blocks" rich text → <p> elements; `strongClassName` styles bold runs (each section highlights differently)
export const RichText = ({ blocks = [], className, strongClassName }) =>
  blocks.map((block, i) =>
    block.type === "paragraph" ? (
      <p key={i} className={className}>
        {renderChildren(block.children, strongClassName)}
      </p>
    ) : null,
  );
