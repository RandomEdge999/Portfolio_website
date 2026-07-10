import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("home tells the story and stays within the viewport", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("heading", { level: 1 })).toContainText("I build AI systems");
  await expect(page.getByText("Human control path", { exact: true })).toBeVisible();
  await expect(page.getByText("System state", { exact: true })).toBeVisible();
  await expect(page.getByText("Selected systems", { exact: true })).toBeVisible();
  await expect(page.locator(".case-open")).toHaveCount(4);
  await expect(page.getByText("Best Data Visualization", { exact: true }).first()).toBeVisible();

  const horizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(horizontalOverflow).toBeLessThanOrEqual(1);
});

test("primary navigation reaches aligned home sections and exits case files", async ({ page }) => {
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
    expect(position.targetTop).toBeGreaterThanOrEqual(position.headerBottom + 8);
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
  expect(await page.evaluate(() => new URLSearchParams(window.location.search).has("case"))).toBe(false);
});

test("case files have durable URLs and deterministic home restoration", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open AgentWarehouse case file" }).click();

  await expect(page).toHaveURL(/\?case=agentwarehouse$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Keeping humans in control/);
  await expect(page.getByText("Release candidate", { exact: true }).first()).toBeVisible();

  await page.locator(".next-case button").click();
  await expect(page).toHaveURL(/\?case=rgan-research$/);

  await page.getByRole("button", { name: "Back to selected work" }).click();
  await expect(page).not.toHaveURL(/\?case=/);
  await expect(page.getByText("Selected systems", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open AgentWarehouse case file" })).toBeFocused();

  await page.getByRole("button", { name: "Open AgentWarehouse case file" }).click();
  await page.getByRole("link", { name: "Discuss the system" }).click();
  await expect(page).not.toHaveURL(/\?case=/);
  await expect(page.getByRole("heading", { name: /Let.s build/ })).toBeInViewport();
  await expect(page.getByRole("heading", { name: /Let.s build/ })).toBeFocused();
});

test("a direct case URL can traverse cases and still return home", async ({ page }) => {
  await page.goto("/?case=agentwarehouse");
  await page.locator(".next-case button").click();
  await expect(page).toHaveURL(/\?case=rgan-research$/);

  await page.getByRole("button", { name: "Back to selected work" }).click();
  await expect(page).not.toHaveURL(/\?case=/);
  await expect(page.getByText("Selected systems", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Open RGAN Research case file" })).toBeFocused();
});

test("lab filters change the visible project index", async ({ page }) => {
  await page.goto("/#lab");
  await page.getByRole("button", { name: "AI tools", exact: true }).click();

  await expect(page.getByRole("heading", { name: "AgentClassroom" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "AI Social Mirror" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Joby" })).toHaveCount(0);
  await expect(page.getByText("02 projects", { exact: true })).toBeVisible();
});

test("mobile navigation closes after selection and on Escape", async ({ page }) => {
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
    .poll(() => page.evaluate(() => window.scrollY), { message: "mobile navigation should reach the Lab section" })
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
  if (await motionButton.count()) {
    await expect(motionButton).toBeDisabled();
  }
  const reduced = await page.evaluate(() => document.documentElement.classList.contains("motion-paused"));
  expect(reduced).toBe(true);
});

test("home and flagship case have no serious automated accessibility violations", async ({ page }) => {
  await page.goto("/");
  let scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual([]);

  await page.goto("/?case=rgan-research");
  scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations.filter((item) => item.impact === "serious" || item.impact === "critical")).toEqual([]);
});
