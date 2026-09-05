import { expect, test, type Page } from "@playwright/test";

async function imageOf(page: Page, selector: string) {
  return page
    .locator(selector)
    .first()
    .evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL());
}

async function moves(page: Page, selector: string) {
  const previous = await imageOf(page, selector);
  await expect
    .poll(() => imageOf(page, selector), { timeout: 4000 })
    .not.toBe(previous);
}

async function freezes(page: Page, selectors: string[]) {
  const before = await Promise.all(
    selectors.map((selector) => imageOf(page, selector)),
  );
  await page.waitForTimeout(450);
  const after = await Promise.all(
    selectors.map((selector) => imageOf(page, selector)),
  );
  expect(after).toEqual(before);
}

test("character headings and background move and obey the shared pause control", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Aleem Azhar.",
  );
  const heading = ".hero h1 canvas";
  await moves(page, heading);
  await moves(page, ".ascii-atmosphere");
  await page.getByRole("button", { name: "Motion on", exact: true }).click();
  await freezes(page, [heading, ".ascii-atmosphere", ".ascii-garden"]);
  await page.getByRole("button", { name: "Motion off", exact: true }).click();
  await moves(page, heading);
});

test("every project sculpture animates and freezes with motion disabled", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  for (const slug of [
    "agentwarehouse",
    "rgan-research",
    "findmyjob",
    "rhok-sat",
  ]) {
    const selector = `#${slug} .project-visual canvas`;
    await page.locator(selector).scrollIntoViewIfNeeded();
    await moves(page, selector);
    await page.getByRole("button", { name: "Motion on", exact: true }).click();
    await freezes(page, [selector]);
    await page.getByRole("button", { name: "Motion off", exact: true }).click();
  }
});

test("lab rows have visible animated studies and no unused metadata column", async ({
  page,
}) => {
  await page.goto("/");
  await page.locator(".lab-row").first().scrollIntoViewIfNeeded();
  await expect(page.locator(".lab-row-preview")).toHaveCount(8);
  await moves(page, ".lab-row .ascii-signal");
  const row = await page
    .locator(".lab-row")
    .first()
    .evaluate((element) => {
      const content = element
        .querySelector(".lab-row-content")!
        .getBoundingClientRect();
      const art = element
        .querySelector(".lab-row-preview")!
        .getBoundingClientRect();
      const row = element.getBoundingClientRect();
      return {
        gap: art.left - content.right,
        artWithinRow: art.right <= row.right + 1,
        artWidth: art.width,
      };
    });
  expect(row.gap).toBeLessThanOrEqual(24);
  expect(row.artWithinRow).toBe(true);
  expect(row.artWidth).toBeGreaterThan(50);
});

test("reduced motion still renders readable headings and static artwork", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const painted = await page.locator(".hero h1 canvas").evaluate((element) => {
    const canvas = element as HTMLCanvasElement;
    const data = canvas
      .getContext("2d")!
      .getImageData(0, 0, canvas.width, canvas.height).data;
    let visible = 0;
    for (let i = 3; i < data.length; i += 4) if (data[i] > 50) visible++;
    return visible;
  });
  expect(painted).toBeGreaterThan(500);
  await freezes(page, [
    ".hero h1 canvas",
    ".ascii-atmosphere",
    ".ascii-garden",
  ]);
  await page
    .locator("#agentwarehouse .project-visual canvas")
    .scrollIntoViewIfNeeded();
  await freezes(page, ["#agentwarehouse .project-visual canvas"]);
});
