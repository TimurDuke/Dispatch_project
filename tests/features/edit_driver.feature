# language: ru

Функционал: Редактирование водителя
  Как пользователь user или админ
  Я должен иметь возможность редактировать водителя
  После ввода данных и отправки данных


  @driverEdit
  Сценарий: Успешное редактирование данных водителя
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"

    Допустим я открываю страницу "drivers"
    То я нажимаю на кнопку открытия модального окна для формы редактирования водителя
    Если я введу новые данные:
      | name        | Petr                   |
      | address     | US, IL, Chicago c., 75 |
      | DOB         | 07.09.1988             |
      | info        | Some driver info       |
      | reference   | Communicative          |

    Затем нажимаю на "Save"
    То я вижу "You have successfully updated a driver!"


  @editDriverFailed
  Сценарий: Неуспешное редактирование данных водителя
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"

    Допустим я открываю страницу "drivers"
    То я нажимаю на кнопку открытия модального окна для формы редактирования водителя
    Если я введу новые данные:
      | phoneNumber | 9999999999999999 |

    Затем нажимаю на "Save"
    То я вижу "Driver update failed!"
