const {I} = inject();

Given('я захожу на страницу {string}', (page) => {
  I.amOnPage('/' + page);
});

Given('я введу данные:', (table) => {
  table.rows.forEach(row => {
    const name = row.cells[0].value;
    const value = row.cells[1].value;

    I.fillField(name, value);

  });
});

When('нажимаю на кнопку {string}', buttonText => {
  I.click(`//form//button[contains(text(), "${buttonText}")]`);

  I.wait(4);
});

Then('я вижу текст {string}', text => {
 I.see(text);
});

/* Carriers registration test */

Given('я открываю страницу {string}', page => {
  I.amOnPage('/' + page);
  I.wait(2);
});

Then('я нажимаю на кнопку {string}', add => {
  I.click(`[alt="${add}"]`);
});

When('я напишу данные:', table => {
  table.rows.forEach(row => {
    const name = row.cells[0].value;
    const value = row.cells[1].value;
    I.fillField(name, value);
  });
});

Then('нажму на кнопку выбора документа {string}', buttonText => {
  I.click(`//form//button[contains(text(), "${buttonText}")]`);
});

Then('выбираю нужный файл для документа {string}', file => {
  I.attachFile("input[type='file']", file);
  I.wait(1);
});

Then('нажимаю на {string}', buttonText => {
  I.click(`//form//button[contains(text(), "${buttonText}")]`);

  I.wait(3);
});

Then('я вижу {string}', text => {
  I.see(text);
});

/* Drivers registration test */

Given('я открываю страницу водителей {string}', page => {
  I.amOnPage('/' + page);
});

Then('я нажимаю на кнопку открытия модального окна для формы регистрации водителя {string}', buttonText => {
  I.click(`[alt="${buttonText}"]`);
});

When('я введу данные в форму регистрации водителя:', table => {
  table.rows.forEach(row => {
    const name = row.cells[0].value;
    const value = row.cells[1].value;
    I.fillField(name, value);
  });
});

Then('нажимаю на выбор компании {string}', text => {
  I.click(`//div//label[contains(text(), "${text}")]`);
});

Then('нажимаю на компанию {string}', companyName => {
  I.click(`//ul//li[contains(text(), "${companyName}")]`);
  I.wait(1);
});

Then('нажимаю на выбор статуса {string}', text => {
  I.click(`//div//label[contains(text(), "${text}")]`);
});

Then('нажимаю на статус {string}', statusName => {
  I.click(`//ul//li[contains(text(), "${statusName}")]`);
  I.wait(1);
});

Then('нажму на кнопку выбора лицензии {string}', buttonText => {
  I.click(`//form//button[contains(text(), "${buttonText}")]`);
});

Then('выбираю нужный файл для лицензии {string}', file => {
  I.attachFile("input[type='file']", file);
  I.wait(1);
});

Then('нажимаю на кнопку регистрации водителя {string}', buttonText => {
  I.click(`//form//button[contains(text(), "${buttonText}")]`);
  I.wait(1);
});

Then('я вижу текст о успешной регистрации водителя {string}', text => {
  I.see(text);
  I.wait(1);
});

Then('я вижу текст о ошибке регистрации водителя {string}', text => {
  I.see(text);
  I.wait(1);
});

/* Driver editing test */

Then('я нажимаю на кнопку открытия модального окна для формы редактирования водителя', () => {
  I.click('//td//div');
});

When('я введу данные в форму редактирования водителя:', table => {
  table.rows.forEach(row => {
    const name = row.cells[0].value;
    const value = row.cells[1].value;
    I.clearField(name);
    I.fillField(name, value);
  });
});

Then('нажимаю на выбор компании для редактирования {string}', text => {
  I.click(`//div[contains(text(), "${text}")]`);

});

Then('нажимаю на выбор статуса для редактирования {string}', text => {
  I.click(`//div[contains(text(), "${text}")]`);
});

Then('нажимаю на кнопку редактирования водителя {string}', buttonText => {
  I.click(`//form//button[contains(text(), "${buttonText}")]`);
  I.wait(1);
});

Then('я вижу текст о успешном редактировании водителя {string}', text => {
  I.see(text);
});

Then('я вижу текст об ошибке почты {string}', text => {
  I.see(text);
});

Then('я вижу текст об ошибке номера {string}', text => {
  I.see(text);
});

Then('я вижу текст о ошибке редактирования {string}', text => {
  I.see(text);
  I.wait(1);
});

/* Carrier editing test */
Then('я нажимаю на кнопку открытия модального окна для формы редактирования перевозчика', () => {
  I.click('//td//div');
});

When('я введу данные в форму редактирования перевозчика:', table => {
  table.rows.forEach(row => {
    const name = row.cells[0].value;
    const value = row.cells[1].value;
    I.clearField(name);
    I.fillField(name, value);
  })
});

Then('нажимаю на кнопку редактирования перевозчика {string}', buttonText => {
  I.click(`//form//button[contains(text(), "${buttonText}")]`);
  I.wait(4);
});

Then('я вижу текст о успешном редактировании перевозчика{string}', text => {
  I.see(text);
});


/* Trips registration test */
Then('нажимаю на поле с надписью {string}', text => {
  I.click(`//div//label[contains(text(), "${text}")]`);
});
Then('нажимаю на поле, чтобы выбрать {string}', brokerName => {
  I.click(`//div/div//*[@id="demo-simple-select"]`);
  I.wait(1);
});
Then('нажимаю на элемент списка с текстом {string}', driverName => {
  I.click(`//ul//li[contains(text(), "${driverName}")]`);
  I.wait(1);
});
Then('нажимаю на селект с надписью {string}', driverName => {
  I.click(`//div//label[contains(text(), "${driverName}")]`);
  I.wait(1);
});

Then('прикрепляю в поле {string} файл {string}', (fieldName, file) => {
  I.attachFile(`input[name=${fieldName}]`, file);
  I.wait(5);
});

/* Trips upcoming/transit/history edit test */

Then('нажимаю на кнопку, чтобы открыть форму редактирования данных о грузе', () => {
  I.click('//td//div//button');
  I.wait(1);
});
Then('я нажимаю на кнопку из списка {string}', edit => {
  I.click(`//div//li[contains(text(), "${edit}")]`);
  I.wait(1);
});
When('я напишу данные о грузе:', table => {
  table.rows.forEach(row => {
    const name = row.cells[0].value;
    const value = row.cells[1].value;
    I.clearField(name);
    I.fillField(name, value);
  });
});

Then('нажимаю на выбор водителя {string}', text => {
  I.click(`//div[contains(text(), "${text}")]`);
  I.wait(1);
});
Then('нажимаю на водителя {string}', text => {
  I.click(`//ul//li[contains(text(), "${text}")]`);
  I.wait(1);
});

Then('я вижу текст об ошибке некорректной даты {string}', text => {
  I.see(text);
  I.wait(1);
});

Then('я вижу текст об ошибке редактирования {string}', text => {
  I.see(text);
  I.wait(1);
});

/* Filter drivers/dispatchers/carriers/statusUpdate/LearningCategory */

Then('я ввожу данные в поле поиска', () => {
  I.click(`//input[@placeholder="Search"]`);
});

When('я введу следующие данные {string}', text => {
  I.fillField('search', text);
});

Then('я вижу сущность с данными {string}', text => {
  I.see(text);
  I.wait(1);
});

/* Brokers registration and editing tests */
Then('нажимаю на кнопку редактирования брокера', () => {
  I.click('//tr[1]/td[6]/div');
  I.wait(1);
});
Then('нажимаю на кнопку добавления компании брокеру', () => {
  I.click('//form/div/div[3]/div[2]/button');
  I.wait(1);
});
Then('нажимаю на кнопку выбора компании брокеру', () => {
  I.click('//form/div/div[4]/div/div');
  I.wait(1);
});
Then('я не вижу текст {string}', text => {
  I.dontSee(text, '//ul//li');
  I.wait(1);
});

/* Learning Category adding tests */
Given('я открываю страницу базы знаний {string}', page => {
  I.amOnPage('/' + page);
});

Then('я нажимаю на кнопку открытия модального окна для формы добавления новой категории базы знаний {string}', buttonText => {
  I.click(`[alt="${buttonText}"]`);
});

When('я введу данные в форму добавления новой категории:', table => {
  table.rows.forEach(row => {
    const name = row.cells[0].value;
    const value = row.cells[1].value;
    I.fillField(name, value);
  });
});

Then('нажимаю на кнопку добавления новой категории {string}', buttonText => {
  I.click(`//form//button[contains(text(), "${buttonText}")]`);
  I.wait(1);
});

Then('я вижу текст о успешном добавлении новой категории {string}', text => {
  I.see(text);
  I.wait(1);
});

Then('я вижу текст о ошибке добавления новой категории {string}', text => {
  I.see(text);
  I.wait(1);
});