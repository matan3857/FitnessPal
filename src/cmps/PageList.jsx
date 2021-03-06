import React from "react";
import { PagePreview } from "./PagePreview";

export function PageList(props) {
  const { pages } = props;
  return (
    <div className="page-list flex column">
      {pages &&
        pages.map((page, idx) => (
          <PagePreview
            page={page}
            key={idx}
          />
        ))}
    </div>
  );
}
