import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const gardenSelector = "canvas.ascii-garden";

async function gardenSignature(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  return page
    .locator(gardenSelector)
    .first()
    .evaluate((element) => (element as HTMLCanvasElement).toDataURL());
}

async function expectGardenToMove(page: Page) {
  const previous = await gardenSignature(page);
  await page.waitForFunction(
    ({ selector, previous }) =>
      document.querySelector<HTMLCanvasElement>(selector)?.toDataURL() !==
      previous,
    { selector: gardenSelector, previous },
    { polling: 100, timeout: 5_000 },
  );
}

async function expectGardenToStayStill(page: Page) {
  const previous = await gardenSignature(page);
  await page.waitForFunction(
    ({ selector, previous, started }) => {
      if (
        document.querySelector<HTMLCanvasElement>(selector)?.toDataURL() !==
        previous
      ) {
        throw new Error(
          "The ASCII garden changed while decorative motion was paused.",
        );
      }
      return Date.now() - started >= 450;
    },
    { selector: gardenSelector, previous, started: Date.now() },
    { polling: 75, timeout: 2_000 },
  );
}

test("home tells the story and stays within the viewport", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Aleem Azhar.",
  );
  await expect(page.locator(".hero-intro")).toHaveText(
    "I build AI tools, study noisy signals, and turn complicated workflows into software people can use.",
  );
  await expect(
    page.getByRole("img", {
      name: /A three-dimensional garden rendered in white ASCII/,
    }),
  ).toBeVisible();
  await expect(
    page
      .locator("#work .section-title")
      .getByText("Selected work", { exact: true }),
  ).toBeVisible();
  await expect(page.locator(".case-open")).toHaveCount(4);
  await expect(
    page.getByText("Best Data Visualization", { exact: true }).first(),
  ).toBeVisible();

  const horizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
});

test("primary navigation reaches aligned home sections and exits case files", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const desktopNav = page.locator(".desktop-nav");
  if (!(await desktopNav.isVisible())) return;

  const heroWork = page.locator(".hero-actions a[href='#work']");
  await expect(heroWork).toHaveCount(1);
  await heroWork.click();
  await expect(page).toHaveURL(/#work$/);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  const brand = page.locator(".site-brand[href='#top']");
  await expect(brand).toHaveCount(1);
  await brand.click();
  await expect(page).toHaveURL(/#top$/);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  for (const label of ["Work", "Experience", "Lab", "About", "Contact"]) {
    const link = desktopNav.getByRole("link", { name: label, exact: true });
    await expect(link).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`#${label.toLowerCase()}$`));

    const position = await page.evaluate((id) => {
      const target = document.getElementById(id);
      const header = document.querySelector(".site-header");
      return {
        scrollY: window.scrollY,
        targetTop: target?.getBoundingClientRect().top ?? -1,
        headerBottom: header?.getBoundingClientRect().bottom ?? -1,
      };
    }, label.toLowerCase());
    expect(position.scrollY).toBeGreaterThan(0);
    expect(position.targetTop).toBeGreaterThanOrEqual(
      position.headerBottom + 8,
    );
  }

  await page.goBack();
  await expect(page).toHaveURL(/#about$/);
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  const footerTop = page.locator(".site-footer a[href='#top']");
  await expect(footerTop).toHaveCount(1);
  await footerTop.click();
  await expect(page).toHaveURL(/#top$/);
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  await page.goto("/?case=agentwarehouse");
  const caseWork = page.locator(".desktop-nav a[href$='#work']");
  await expect(caseWork).toHaveCount(1);
  await caseWork.click();
  await expect(page).toHaveURL(/#work$/);
  expect(
    await page.evaluate(() =>
      new URLSearchParams(window.location.search).has("case"),
    ),
  ).toBe(false);
});

test("case files have durable URLs and deterministic home restoration", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("button", { name: "Open AgentWarehouse case file" })
    .click();

  await expect(page).toHaveURL(/\?case=agentwarehouse$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Keeping humans in control/,
  );
  await expect(
    page.getByText("Release candidate", { exact: true }).first(),
  ).toBeVisible();

  await page.locator(".next-case button").click();
  await expect(page).toHaveURL(/\?case=rgan-research$/);

  await page.getByRole("button", { name: "Back to selected work" }).click();
  await expect(page).not.toHaveURL(/\?case=/);
  await expect(
    page
      .locator("#work .section-title")
      .getByText("Selected work", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open AgentWarehouse case file" }),
  ).toBeFocused();

  await page
    .getByRole("button", { name: "Open AgentWarehouse case file" })
    .click();
  await page.getByRole("link", { name: "Discuss the system" }).click();
  await expect(page).not.toHaveURL(/\?case=/);
  await expect(
    page.getByRole("heading", { name: "Let’s talk.", exact: true }),
  ).toBeInViewport();
  await expect(
    page.getByRole("heading", { name: "Let’s talk.", exact: true }),
  ).toBeFocused();
});

test("a direct case URL can traverse cases and still return home", async ({
  page,
}) => {
  await page.goto("/?case=agentwarehouse");
  await page.locator(".next-case button").click();
  await expect(page).toHaveURL(/\?case=rgan-research$/);

  await page.getByRole("button", { name: "Back to selected work" }).click();
  await expect(page).not.toHaveURL(/\?case=/);
  await expect(
    page
      .locator("#work .section-title")
      .getByText("Selected work", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Open RGAN Research case file" }),
  ).toBeFocused();
});

test("lab filters keep every selected project visibly rendered", async ({
  page,
}) => {
  await page.goto("/#lab");

  const filters = [
    { label: "All", count: 8, firstProject: "AgentClassroom" },
    { label: "AI tools", count: 2, firstProject: "AgentClassroom" },
    { label: "ML & data", count: 3, firstProject: "City Pulse" },
    { label: "Product systems", count: 3, firstProject: "Joby" },
    { label: "AI tools", count: 2, firstProject: "AgentClassroom" },
  ];

  for (const filter of filters) {
    await page.getByRole("button", { name: filter.label, exact: true }).click();
    const rows = page.locator(".lab-row");
    await expect(rows).toHaveCount(filter.count);
    await expect(
      page.getByRole("heading", { name: filter.firstProject, exact: true }),
    ).toBeVisible();
    expect(
      await rows.evaluateAll((items) =>
        items.every((item) => getComputedStyle(item).opacity === "1"),
      ),
    ).toBe(true);
  }
});

test("mobile navigation closes after selection and on Escape", async ({
  page,
}) => {
  await page.goto("/");
  const summary = page.locator(".mobile-nav summary");
  if (!(await summary.isVisible())) return;

  const menu = page.locator(".mobile-nav");
  await summary.click();
  await expect(menu).toHaveAttribute("open", "");
  await menu.getByRole("link", { name: "Lab" }).click();
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(page).toHaveURL(/#lab$/);
  await expect
    .poll(() => page.evaluate(() => window.scrollY), {
      message: "mobile navigation should reach the Lab section",
    })
    .toBeGreaterThan(0);

  await summary.click();
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(summary).toBeFocused();
});

test("system reduced-motion preference is honored", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const motionButton = page.getByRole("button", { name: /Motion reduced/i });
  await expect(motionButton).toBeDisabled();
  await expect(page.locator("html")).toHaveClass(/motion-paused/);
  await expect(page.locator(".hero-garden figcaption")).toContainText(
    "[ STILL ]",
  );
  await expectGardenToStayStill(page);
});

test("motion controls freeze the garden and persist across reloads", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".hero-garden figcaption")).toContainText(
    "[ LIVE ]",
  );
  await expectGardenToMove(page);

  await page.getByRole("button", { name: /Motion on/i }).click();
  await expect(
    page.getByRole("button", { name: /Motion off/i }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator(".hero-garden figcaption")).toContainText(
    "[ STILL ]",
  );
  await expectGardenToStayStill(page);
  expect(
    await page.evaluate(() => localStorage.getItem("portfolio-motion")),
  ).toBe("paused");

  await page.reload();
  await expect(
    page.getByRole("button", { name: /Motion off/i }),
  ).toHaveAttribute("aria-pressed", "true");
  await expectGardenToStayStill(page);

  await page.getByRole("button", { name: /Motion off/i }).click();
  await expectGardenToMove(page);
  await page.reload();
  await expect(
    page.getByRole("button", { name: /Motion on/i }),
  ).toHaveAttribute("aria-pressed", "false");
  await expectGardenToMove(page);
});

test("live reduced-motion changes override the saved preference", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expectGardenToMove(page);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(
    page.getByRole("button", { name: /Motion reduced/i }),
  ).toBeDisabled();
  await expect(page.locator("html")).toHaveClass(/motion-paused/);
  await expectGardenToStayStill(page);

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(page.getByRole("button", { name: /Motion on/i })).toBeEnabled();
  await expectGardenToMove(page);
});

test("the disclosed system map remains interactive and keyboard accessible", async ({
  page,
}) => {
  await page.goto("/#about");
  const disclosure = page.locator(".approach-disclosure");
  await expect(disclosure).not.toHaveAttribute("open", "");
  await disclosure.locator("summary").click();
  await expect(disclosure).toHaveAttribute("open", "");
  await expect(
    disclosure.getByText("Human control path", { exact: true }),
  ).toBeVisible();
  await expect(
    disclosure.getByText("System state", { exact: true }),
  ).toBeVisible();
  const dataLayer = disclosure.getByRole("button", { name: /02 Data/ });
  await dataLayer.focus();
  await expect(dataLayer).toHaveAttribute("aria-pressed", "true");
  await expect(
    disclosure.getByText("Make the inputs defensible.", { exact: true }),
  ).toBeVisible();
});

test("unknown cases and malformed hashes recover without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));

  await page.goto("/?case=missing-project");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "This case file does not exist.",
  );
  await expect(page).toHaveTitle("Case file not found | Aleem Azhar");
  await page.getByRole("button", { name: /Return home/ }).click();
  await expect(page).not.toHaveURL(/\?case=/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Aleem Azhar.",
  );

  await page.goto("/#%5Binvalid-selector");
  await page.locator(".hero-actions a[href='#work']").click();
  await page.goBack();
  await expect(page).toHaveURL(/#%5Binvalid-selector$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Aleem Azhar.",
  );
  await page.locator(".site-brand").click();
  await expect(page).toHaveURL(/#top$/);
  expect(errors).toEqual([]);
});

test("narrow phones and tablet layouts stay within the viewport", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    const homeOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(homeOverflow, `home overflow at ${width}px`).toBeLessThanOrEqual(1);

    await page.goto("/?case=rgan-research");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Forecasting/,
    );
    const caseOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(caseOverflow, `case overflow at ${width}px`).toBeLessThanOrEqual(1);
  }
});

test("home and flagship case have no serious automated accessibility violations", async ({
  page,
}) => {
  await page.goto("/");
  let scan = await new AxeBuilder({ page }).analyze();
  expect(
    scan.violations.filter(
      (item) => item.impact === "serious" || item.impact === "critical",
    ),
  ).toEqual([]);

  await page.goto("/?case=rgan-research");
  scan = await new AxeBuilder({ page }).analyze();
  expect(
    scan.violations.filter(
      (item) => item.impact === "serious" || item.impact === "critical",
    ),
  ).toEqual([]);
});
