import { expect, test } from '@playwright/test';

const devices = [
  {
    name: 'mobile',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  },
  {
    name: 'tablet',
    viewport: { width: 768, height: 1024 },
    isMobile: false,
    hasTouch: true,
  },
  {
    name: 'ipad',
    viewport: { width: 820, height: 1180 },
    isMobile: false,
    hasTouch: true,
  },
  {
    name: 'laptop',
    viewport: { width: 1366, height: 768 },
    isMobile: false,
    hasTouch: false,
  },
];

for (const device of devices) {
  test.describe(`homepage on ${device.name}`, () => {
    test.use({
      viewport: device.viewport,
      isMobile: device.isMobile,
      hasTouch: device.hasTouch,
    });

    test(`renders correctly on ${device.name}`, async ({ page }) => {
      await page.goto('/');

      await expect(page.getByRole('heading', { name: /Your Ride Secured in Seconds/i })).toBeVisible();
      await expect(page.getByText(/Download Latest Version Of The App From/i)).toBeVisible();

      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      const viewportWidth = page.viewportSize()?.width ?? 0;

      expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2);
    });
  });
}