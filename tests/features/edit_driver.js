// ## language: ru
// #
// #Функционал: Редактирование водителя
// #  Как пользователь user или админ
// #  Я должен иметь возможность редактировать водителя
// #  После ввода данных и отправки данных
// #
// #
// #  @driverEdit
// #  Сценарий: Успешное редактирование данных водителя
// #    Допустим я захожу на страницу "login"
// #    Если я введу данные:
// #      | email    | admin@gmail.com |
// #      | password | admin           |
// #    И нажимаю на кнопку "Sign In"
// #    То я вижу текст "HELLO, ADMIN"
// #
// #    Допустим я открываю страницу водителей "drivers"
// #    То я нажимаю на кнопку открытия модального окна для формы редактирования водителя
// #    Если я введу данные в форму редактирования водителя:
// #      | email       | petr@gmail.com         |
// #      | name        | Petr                   |
// #      | phoneNumber | 3305772012             |
// #      | address     | US, IL, Chicago c., 75 |
// #      | DOB         | 07.09.1988             |
// #      | info        | Some driver info       |
// #      | reference   | Communicative          |
// #    Затем нажимаю на выбор компании для редактирования
// #    И нажимаю на компанию "TURAN EXPRESS"
// #
// #    Затем нажимаю на кнопку редактирования водителя "Save"
// #    То я вижу текст о успешном редактировании водителя "You have successfully updated a driver!"
// #
// #
// #  @editDriverFailed
// #  Сценарий: Неуспешное редактирование данных водителя
// #    Допустим я захожу на страницу "login"
// #    Если я введу данные:
// #      | email    | admin@gmail.com |
// #      | password | admin           |
// #    И нажимаю на кнопку "Sign In"
// #    То я вижу текст "HELLO, ADMIN"
// #
// #    Допустим я открываю страницу водителей "drivers"
// #    То я нажимаю на кнопку открытия модального окна для формы редактирования водителя
// #    Если я введу данные в форму редактирования водителя:
// #      | email       | mirbek@gmail.com |
// #      | phoneNumber | 9999999999999999 |
// #
// #    Затем нажимаю на кнопку редактирования водителя "Save"
// #    То я вижу текст об ошибке почты "Error, expected email to be unique."
// #    И я вижу текст об ошибке номера "Phone number is not valid!"
// #    И я вижу текст о ошибке редактирования "Driver update failed!"
