import { test, expect } from "@playwright/test";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const email = process.env.NEXT_PUBLIC_EMAIL || "email@email.com";
const token = process.env.NEXT_PUBLIC_TOKEN || "";

test.describe("Blog Post App", () => {
  test("Login Page", async ({ page }) => {
    await page.goto(BASE_URL);
    expect(await page.isVisible("text=Blog Post App")).toBeTruthy();
  });

  test("Credential Access to Blog Post", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByPlaceholder("Email").fill(email);
    await page.getByPlaceholder("Token").fill(token);
    await page.getByText("Login").click();
    expect(await page.isVisible("text=Blog Posts")).toBeTruthy();
  });

  test("Post List to be displayed", async ({ page }) => {
    await page.goto(BASE_URL);
    const postListCard = await page.waitForSelector("[test-id=post-list-card]");
    expect(postListCard).toHaveLength(10);
  });

  test("Pagination Post List", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForSelector("[test-id=post-list]");
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
    const postListCard = await page.waitForSelector("[test-id=post-list-card]");
    expect(postListCard).toHaveLength(20);
  });

  test("Filter Post List", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.getByRole("searchbox").fill("Lorem Ipsum");
    await page.waitForSelector("[test-id=post-list]");
    const postListCard = await page.locator("[test-id=post-list-card]");
    expect(postListCard).toHaveCount(1);
  });

  test("Detail Post", async ({ page }) => {
    await page.goto(BASE_URL);
    const postCard = await page.locator("[test-id=post-list-card]").first();
    const postTitle = await postCard
      .locator(".ant-card-head-title")
      .textContent();
    await postCard.locator("text=View Details").click();
    await page.waitForResponse("**/api/posts/*");
    const postDetailTitle = await page
      .locator(".post-detail")
      .locator("h1")
      .textContent();
    expect(postDetailTitle).toEqual(postTitle);
  });

  test("Create Post", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click("text=Create Post");
    await page.fill('input[name="title"]', "Post Title");
    await page.fill('textarea[name="body"]', "Post Body");
    await page.click('button:has-text("Submit")');
    await page.waitForSelector("text=Post created successfully");
  });

  test("Update Post", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click(".post-list-card-dropdown button");
    await page.click("text=Edit");
    await page.fill('input[name="title"]', "Post Title Updated");
    await page.fill('textarea[name="body"]', "Post Body Updated");
    await page.click('button:has-text("Submit")');
    await page.waitForSelector("text=Post updated successfully");
  });
  test("Delete Post", async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click(".post-list-card-dropdown button");
    await page.click('button:has-text("Delete")');
    await page.click('button:has-text("Confirm")');
    await page.waitForSelector("text=Post deleted");
  });
});
