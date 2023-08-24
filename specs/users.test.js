jest.setTimeout(60000);

describe("Basic authentication e2e tests", () => {
  beforeAll(async () => {
    console.log("e2e tests running");
    // Set a definite size for the page viewport so view is consistent across browsers
    await page.setViewport({
      width: 1366,
      height: 768,
      deviceScaleFactor: 1,
    });

    await page.goto("http://localhost:8080/");
    await new Promise((r) => setTimeout(r, 5000));

    // await page.waitForTimeout(5000);
  });

  it("Should be truthy", async () => {
    expect(true).toBeTruthy();
  });
});
