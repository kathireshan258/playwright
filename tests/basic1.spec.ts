import {test, expect} from '@playwright/test';

test('Basic browser open and invalid sign in assertion', async ({browser}) => {
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const userNameLbl = await page.locator('label[for="username"]').textContent();
    expect (userNameLbl).toEqual('Username:');
    const passLbl = await page.locator('label[for="password"]').textContent();
    expect(passLbl).toBe('Password:');
    await page.locator('input#username').fill('rahul');
    await page.locator('input#password').fill('test');
    await page.locator('input#signInBtn').click();
    const errMsg = await page.locator('div[style *= "display"]').textContent();
    expect(errMsg?.trim()).toEqual('Incorrect username/password.');
});

test('basic browser open and valid signin', async function({page}) {
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const userName = await page.locator('div.form-group>p b:first-of-type i').textContent();
    await page.locator('input#username').fill(userName || '');
    const password = await page.locator('div.form-group>p b:last-of-type i').textContent();
    await page.locator('input#password').fill(password || '');
    await page.locator('input#signInBtn').click();
    const pageTitle = await page.title();
    console.log(`page title: ${pageTitle}`);
    expect(page).toHaveTitle('LoginPage Practise | Rahul Shetty Academy');
});


test('Waiting for network idle and network to load', async function({browser}) {
    const USEREMAIL = 'anshika@gmail.com';
    const PASSWORD = 'Iamking@000';
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    await page.goto('https://rahulshettyacademy.com/client');
    // await page.waitForURL('/client/#/auth/login', {waitUntil: 'domcontentloaded'});
    expect(page.url()).toBe('https://rahulshettyacademy.com/client/#/auth/login');
    await page.locator('#userEmail').fill(USEREMAIL);
    await page.locator('#userPassword').fill(PASSWORD);
    await page.locator('[value="Login"]').click();
    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();
    const titles = await page.locator('.card-body b').allTextContents();
    console.log(titles);
});


test('html select element', async function ({browser}) {
    const EMAIL = 'rahulshettyacademy', PASSWORD = 'Learning@830$3mK2';
    const MODAL_MSSG = 'You will be limited to only fewer functionalities of the app. Proceed?';
    const browserContext = await browser.newContext();
    const page = await browser.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await page.locator('input#username').fill(EMAIL);
    await page.locator('input#password').fill(PASSWORD);
    await page.locator('span.checkmark').last().click();
    expect(await page.locator('div.modal-body>p').textContent()).toEqual(MODAL_MSSG);
    await page.locator('button#okayBtn').click();
    await page.pause();
    // HTML Select element
    const selectElement = page.locator('select.form-control');
    selectElement.selectOption('consult');

    // verify the selected element
    expect(selectElement.locator('option:checked')).toHaveText('Consultant');
    await page.pause();
});

test('Handling checkbox and checking if the element is checked', async ({browser}) => {
    const EMAIL = 'rahulshettyacademy', PASSWORD = 'Learning@830$3mK2';
    const MODAL_MSSG = 'You will be limited to only fewer functionalities of the app. Proceed?';
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    await page.locator('input#username').fill(EMAIL);
    await page.locator('input#password').fill(PASSWORD);

    // Radio button
    await page.locator('span.radiotextsty').last().click();
    // Asserting/ Checking the radio button is clicked
    await expect(page.locator('span.radiotextsty').last()).toBeChecked();
    // Getting the state of radio button if it is checked or unchecked
    console.log(`User radio button is checked: ${await page.locator('span.radiotextsty').last().isChecked()}`);
    // Assserting/ Checking if the Admin radio button is **Not Checked**
    expect(await page.locator('span.radiotextsty').first().isChecked()).toBeFalsy();

    expect(await page.locator('div.modal-body>p').textContent()).toEqual(MODAL_MSSG);
    await page.locator('button#okayBtn').click();

    // HTML Select Element
    const dropDown = page.locator('select.form-control');
    await dropDown.selectOption('teach');
    await expect(dropDown.locator('option:checked')).toHaveText('Teacher');
    await expect(dropDown).toHaveValue('teach'); // .toHaveValue() to be used in the Select element not on the option element

    // CheckBox Handling
    const checkBox = page.locator('input#terms');
    console.log(`checkbox msg: ${await page.locator('span.termsText').textContent()}`);
    await checkBox.check();
    // Asserting/ checking if the checkbox is checked
    expect(checkBox).toBeChecked();
    // Retriving or Getting the status of the checkbox if it is checked
    console.log(`terms & condition checkbox is checked: ${await checkBox.isChecked()}`);
    // UnCheck the checkbox
    await checkBox.uncheck();
    // Asserting/ Checking if the radio button is unchecked
    expect(await checkBox.isChecked()).toBeFalsy();
});


test('New tab handle', async ({browser}) => {
    const browserContext = await browser.newContext();
    const page = await browserContext.newPage();
    await page.goto('https://rahulshettyacademy.com/loginpagePractise/');
    const documentRequestLink = page.locator('a[href*="documents-request"]');
    const [newPage] = await Promise.all([
        browserContext.waitForEvent('page'),
        documentRequestLink.click()
    ]);
    await newPage.waitForLoadState();
    console.log(`new page URL: ${newPage.url()}`);
    console.log(`email sentence in new page: ${await newPage.locator('p.red').textContent()}`);
    await expect(newPage).toHaveURL('https://rahulshettyacademy.com/documents-request');
    await expect(newPage.locator('p.red')).toContainText('mentor@rahulshettyacademy.com');
    const textContent = await newPage.locator(`p.red`).textContent(); // full text: Please email us at mentor@rahulshettyacademy.com with below template to receive response
    const domain = textContent?.split('@')[1].split(' ')[0] || '';
    await page.locator('input#username').fill(domain); // entering the text in the first opened page input element
    console.log(`Text inputed in the input box: ${await page.locator('input#username').inputValue()}`);
    await newPage.close();
});