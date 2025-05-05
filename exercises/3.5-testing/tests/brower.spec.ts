import { test, expect } from "@playwright/test";
import { getPath } from "./src/url";
import { database } from "../server/src/model";

test("Homepage was retrieved successfully!", async ({ page }) => {
	await page.goto("/");

	expect(await page?.title()).toBe("Welcome");

	/**
	 * The $ method is used to query for an element on the page.
	 * It's equivalent to document.querySelector in the browser which
	 * returns the first element that matches the specified CSS selector.
	 * @see https://playwright.dev/docs/api/class-page#page-queryselector
	 * @see https://playwright.dev/docs/locators
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
	 */

	const h1 = await page.$("h1");
	const homeNavLink = await page.locator(`nav a[href="/"]`); // @see https://www.w3schools.com/css/css_attribute_selectors.asp
	const aboutLink = await page.locator(`nav a[href="/about"]`);
	const newPokemonLink = await page.$(`nav a[href="/new"]`);
	const footer = await page.$("footer");

	expect(h1).not.toBeNull();
	expect(homeNavLink).not.toBeNull();
	expect(aboutLink).not.toBeNull();
	expect(newPokemonLink).not.toBeNull();
	expect(footer).not.toBeNull();

	expect(await h1?.innerText()).toBe("Welcome to the Pokedex!");
	expect(await homeNavLink?.innerText()).toBe("Home");
	expect(await aboutLink?.innerText()).toBe("About");
	expect(await newPokemonLink?.innerText()).toBe("Create Pokemon");
	expect(await footer?.innerText()).toBe("© Copyright 2024 JohnAbbott");
});

test("Invalid path returned error.", async ({ page }) => {
	await page.goto(getPath("digimon"));

	const h1 = await page.$("h1");
	const pbody = await page.$("p");

	expect(await h1?.innerText()).toMatch("Page not Found");
	expect(await pbody?.innerText()).toMatch("Route not Found");
});

test("Pokemon found by ID.", async ({ page }) => {
	const pokemon = { id: "1", name: "Bulbasaur", type: "Grass" };

	await page.goto(getPath("list-one"));
	//await page.goto(getPath("pokemon/:id", { id: pokemon.id })); You could do this if you have paramerters

	// Simulate user typing the ID into the input
	await page.fill('input[placeholder="Enter Pokemon id"]', pokemon.id);

	// Wait for the name and type to appear on the page
	const nameText = await page.textContent("text=Name:");
	const typeText = await page.textContent("text=Type:");

	expect(nameText).toContain("Name:");
	expect(await page.textContent("text=" + pokemon.name)).toBeTruthy();

	expect(typeText).toContain("Type:");
	expect(await page.textContent("text=" + pokemon.type)).toBeTruthy();
});

test("All Pokemon are displayed.", async ({ page }) => {
	await page.goto(getPath());
	await page.click(`a[href="/list-all"]`);

	const h1 = await page.locator("h1");
	const tableRows = await page.$$("tbody > tr");

	expect(await h1?.innerText()).toMatch("All Pokemon");

	// Just check that there's at least 1 Pokémon (if the previous test added one)
	expect(tableRows.length).toBeGreaterThan(0);

	for (let i = 0; i < database.length; i++) {
		expect(await tableRows[i].innerText()).toMatch(database[i].name);
		expect(await tableRows[i].innerText()).toMatch(database[i].type);
	}
});

test("User can add a new Pokémon and see it listed", async ({ page }) => {
	const pokemonData = { name: "Dragonite", type: "Flying" };
	// Go to homepage
	await page.goto(getPath());

	// Click link to /new form
	await page.click(`a[href="/new"]`);

	// Check form heading is present
	const h1 = await page.$("h1");

	expect(await h1?.innerText()).toMatch("Add New Pokemon");

	// Fill the form
	await page.fill('input[name="name"]', pokemonData.name);
	await page.fill('input[name="type"]', pokemonData.type);

	// Submit the form

	//await page.click("button");
	await page.click('button:has-text("Add Pokemon")'); // if you have multiple buttons.

	// Wait for the redirection after submission
	await page.waitForURL("/list-all");

	// Check if redirected to list-all page
	expect(page.url()).toBe(getPath("list-all"));

	// Check if new Pokemon name is in the list table (optional)
	const table = await page.$("table");
	expect(await table?.innerText()).toMatch(pokemonData.name);
	expect(await table?.innerText()).toMatch(pokemonData.type);
});
