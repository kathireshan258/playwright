import { test, expect } from '@playwright/test';

test.only(
    'Basic e2e shopping cart', async function ({ browser }) {
        const URL = 'https://rahulshettyacademy.com/client';
        const locators = {
            loginPage: {
                regLink: 'a.text-reset'
            },
            regPage: {
                regHeading: 'h1.login-title',
                fName: {
                    label: 'label[for="firstName"]',
                    input: 'input#firstName'
                },
                lName: {
                    label: 'label[for="lastName"]',
                    input: 'input#lastName'
                },
                email: {
                    label: 'label[for="email"]',
                    input: 'input#userEmail'
                },
                phoneNum: {
                    label: 'div.form-group:has(input#userEmail)+div>label[for="userPhone"]',
                    input: 'input#userMobile'
                },
                occupation: {
                    label: 'div.form-group:has(select[formcontrolname="occupation"]) label',
                    dropdown: 'div.form-group select[formcontrolname="occupation"]',
                    dropdownSelected: 'div.form-group select[formcontrolname="occupation"] option:checked'
                },
                gender: {
                    label: 'div.form-group:has(input[formcontrolname="gender"]) label[for="userPhone"]',
                    radioBtns: 'div.form-group input[formcontrolname="gender"]'
                },
                password: {
                    label: 'label[for="password"]',
                    input: 'input#userPassword'
                },
                confirmPass: {
                    label: 'label[for="confirmPassword"]',
                    input: 'input#confirmPassword'
                },
                ageInputCheckBox: 'input[type="checkbox"]',
                registerBtn: 'input#login'
            }
        }
        const expected = {
            loginPage: {
                regLinkTxt: 'Register here',
                urlEnd: '/#/auth/login'
            },
            regPage: {
                regHeading: 'Register',
                fNameLbl: 'First Name',
                lNameLbl: 'Last Name',
                emailLbl: 'Email',
                emailPlaceHolder: 'email@example.com',
                phoneNum: {
                    label: 'Phone Number',
                    placeHolder: 'enter your number'
                },
                occupation: {
                    label: 'Occupation',
                    placeHolder: 'Choose your occupation'
                },
                gender: {
                    label: 'Gender'
                },
                password: {
                    label: 'Password',
                    placeholder: 'Passsword'
                },
                confirmPassword: {
                    label: 'Confirm Password',
                    placeholder: 'Confirm Passsword'
                },
                registerBtn: 'Register',
                ageErrMsg: '*Please check above checkbox',
                ageCheckBox: ' I am 18 year or Older '
            }
        };
        const inputs = {
            regpage: {
                form: {
                    fName: 'Registration',
                    lName: 'Testing',
                    email: 'registrationtesting@yopmail.com',
                    phoneNum: '9123456789',
                    occupation: '3: Engineer',
                    gender: 'male',
                    password: 'Random@123'
                }
            }
        };


        const browserContext = await browser.newContext();
        const page = await browserContext.newPage();
        await page.goto(URL);
        expect(page).toHaveTitle('Let\'s Shop');
        expect(page).toHaveURL(`${URL}${expected.loginPage.urlEnd}`);
        const loginPageURL = page.url();
        expect(loginPageURL).toMatch(/\/#\/auth\/login$/);
        const regLink = page.locator(locators.loginPage.regLink);
        expect(regLink).toHaveText(expected.loginPage.regLinkTxt);
        await regLink.click();

        // Registration page
        expect(page.locator(locators.regPage.regHeading)).toHaveText(expected.regPage.regHeading);
        expect(page.locator(locators.regPage.fName.label)).toHaveText(expected.regPage.fNameLbl);
        expect(page.locator(locators.regPage.lName.label)).toHaveText(expected.regPage.lNameLbl);
        expect(page.locator(locators.regPage.fName.input)).toHaveAttribute('placeholder');
        expect(await page.locator(locators.regPage.fName.input).getAttribute('placeholder')).toEqual(expected.regPage.fNameLbl);
        expect(await page.locator(locators.regPage.lName.input).getAttribute('placeholder')).toEqual(expected.regPage.lNameLbl);
        expect(page.locator(locators.regPage.email.label)).toHaveText(expected.regPage.emailLbl);
        expect(await page.locator(locators.regPage.email.input).getAttribute('placeholder')).toEqual(expected.regPage.emailPlaceHolder);
        expect(page.locator(locators.regPage.phoneNum.label)).toHaveText(expected.regPage.phoneNum.label);
        expect(await page.locator(locators.regPage.phoneNum.input).getAttribute('placeholder')).toEqual(expected.regPage.phoneNum.placeHolder);
        expect(page.locator(locators.regPage.occupation.label)).toHaveText(expected.regPage.occupation.label);
        expect(await page.locator(locators.regPage.occupation.dropdownSelected).textContent()).toEqual(expected.regPage.occupation.placeHolder);
        expect(page.locator(locators.regPage.gender.label)).toHaveText(expected.regPage.gender.label);
        expect(page.locator(locators.regPage.password.label)).toHaveText(expected.regPage.password.label);
        expect(await page.locator(locators.regPage.password.input).getAttribute('placeholder')).toEqual(expected.regPage.password.placeholder);
        expect(page.locator(locators.regPage.confirmPass.label)).toHaveText(expected.regPage.confirmPassword.label);
        expect(await page.locator(locators.regPage.confirmPass.input).getAttribute('placeholder')).toEqual(expected.regPage.confirmPassword.placeholder);

        // Fill the details in the registration form
        await page.locator(locators.regPage.fName.input).fill(inputs.regpage.form.fName);
        await page.locator(locators.regPage.lName.input).fill(inputs.regpage.form.lName);
        await page.locator(locators.regPage.email.input).fill(inputs.regpage.form.email);
        await page.locator(locators.regPage.phoneNum.input).fill(inputs.regpage.form.phoneNum);
        await page.locator(locators.regPage.password.input).fill(inputs.regpage.form.password);
        await page.locator(locators.regPage.confirmPass.input).fill(inputs.regpage.form.password);
        await page.locator(locators.regPage.occupation.dropdown).selectOption(inputs.regpage.form.occupation);
        for (const radioBtn of await page.locator(locators.regPage.gender.radioBtns).all()) {
            const radioBtntxt= await radioBtn.inputValue();
            console.log(`radioBtnText: ${await radioBtn.inputValue()}`);
            if(radioBtntxt?.trim().toLowerCase() === inputs.regpage.form.gender) {
                await radioBtn.check();
                await page.waitForTimeout(5000);
                await expect(radioBtn).toBeChecked();
                console.log(`${await radioBtn.inputValue()} is checked`);
            } else {
                await expect(radioBtn).not.toBeChecked();
                console.log(`${await radioBtn.inputValue()} is not checked`);
            }
        }
        await expect(page.locator(locators.regPage.registerBtn)).toHaveText(expected.regPage.registerBtn);
        await page.locator(locators.regPage.registerBtn).click();
        await expect(page.locator(`text=${expected.regPage.ageErrMsg}`)).toHaveText(expected.regPage.ageErrMsg);

        // Issue: Issue with the div:has-text('${expected.regPage.ageCheckBox}') is:
        /**
         * Explanation:
         * In Playwright, "has:text(...)" matches any given element that contains the text either directly or inside the a child element. 
         * Because <div class="col-md-6"> sits inside <div class="row mb-2">, <div class="login-wrapper...">, etc., your div:has-text(...)
         * locator matches 5 elements, triggering Playwright's "strict mode violation error" (since "toHaveText(...)" expects a single element).
         * 
         * Descendants count as a match: ":hasText(...)" checks the element's entire subtree text, not just the text directly inside the tag. So any
         * outer <div> wrapping <div class="col-md-6"> I am 18 year or Older </div> also matches.
         */
        // await expect(page.locator(`div:has-text('${expected.regPage.ageCheckBox}')`)).toHaveText(expected.regPage.ageCheckBox);
        
        // Option A - match by text and no element tag provided
        await expect(page.getByText(expected.regPage.ageCheckBox, {exact: true})).toHaveText(expected.regPage.ageCheckBox);

        // Option B - Target the specific colmn div
        await expect(page.locator('div.col-md-6', {hasText: expected.regPage.ageCheckBox})).toHaveText(expected.regPage.ageCheckBox);

        // Option C - Filter to the innermost matching div
        await expect(page.locator('div', {hasText: expected.regPage.ageCheckBox}).filter({hasNot: page.locator('div')})).toHaveText(expected.regPage.ageCheckBox);

        // this div element is just for label, there is an input[type="checkbox"] element to handle the check
        await page.locator('div', {hasText: expected.regPage.ageCheckBox}).filter({hasNot: page.locator('div')}) .click();
        await page.locator(locators.regPage.ageInputCheckBox).check();
        await expect(page.locator(locators.regPage.ageInputCheckBox)).toBeChecked();
        console.log(`Is Age checkbox checked: ${await page.locator(locators.regPage.ageInputCheckBox).isChecked()}`);
        await expect(page.locator(locators.regPage.registerBtn)).toHaveText(expected.regPage.registerBtn);
        await page.locator(locators.regPage.registerBtn).click();
    }
);