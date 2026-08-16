import { describe, expect, it } from "vitest";

import { lockDocumentScroll } from "../sheet-scroll-lock";

describe("sheet scroll lock", () => {
  it("locks the page while a sheet is open and restores the previous value", () => {
    const documentLike = { body: { style: { overflow: "auto" } } };

    const restore = lockDocumentScroll(documentLike);

    expect(documentLike.body.style.overflow).toBe("hidden");

    restore();
    expect(documentLike.body.style.overflow).toBe("auto");
  });
});
