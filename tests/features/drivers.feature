# language: ru

Функционал: Регистрация водителя
  Как пользователь user или админ
  Я должен иметь возможность регистрировать нового водителя
  После ввода данных и отправки данных

  @driverRegister
  Сценарий: Регистрация нового водителя
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"
    Допустим я открываю страницу водителей "drivers"
    То я нажимаю на кнопку открытия модального окна для формы регистрации водителя "add"
    Если я введу данные в форму регистрации водителя:
      | email       | jhondoe@gmail.com |
      | name        | Jhon Doe          |
      | phoneNumber | 3213213212        |
      | address     | test address      |
      | DOB         | test DOB          |
      | info        | test info         |
      | reference   | test reference    |
    Затем нажимаю на выбор компании "Carriers"
    И нажимаю на компанию "BAHAWAY"

    Затем нажму на кнопку выбора лицензии "Browse"
    И выбираю нужный файл для лицензии "images/license.jpg"

    Затем нажимаю на кнопку регистрации водителя "Save"
    То я вижу текст о успешной регистрации водителя "You have successfully added a driver!"


    @registerDriverFailed
  Сценарий: Регистрация нового водителя не прошла
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"
    Допустим я открываю страницу водителей "drivers"
    То я нажимаю на кнопку открытия модального окна для формы регистрации водителя "add"
    Если я введу данные в форму регистрации водителя:
      | email       | umot@gmail.com                   |
      | name        | Umot                             |
      | phoneNumber | +2675350802                      |
      | address     | US, LA, Avalon c., str. 1, h. 45 |
      | DOB         | 15.12.1980                       |
      | info        | Lorem ipsum dolor sit amet       |
      | reference   | Punctual, decent                 |
    Затем нажимаю на выбор компании "Carriers"
    И нажимаю на компанию "BAHAWAY"

    Затем нажму на кнопку выбора лицензии "Browse"
    И выбираю нужный файл для лицензии "images/license.jpg"

    Затем нажимаю на кнопку регистрации водителя "Save"
    То я вижу текст о ошибке регистрации водителя "Driver creation failed!"


