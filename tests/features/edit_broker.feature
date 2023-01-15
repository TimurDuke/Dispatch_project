# language: ru

Функционал: Редактирование Broker
  Как пользователь user или админ
  Я должен иметь возможность редактировать существущего Broker
  После ввода данных и отправки данных

  @brokerEdit
  Сценарий: Успешное редактирование Broker
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"
    Допустим я открываю страницу "brokers"
    И нажимаю на кнопку редактирования брокера
    Если я введу данные в форму редактирования перевозчика:
      | name        | Ali          |
      | phoneNumber | 333333333    |
      | mc          | 123456       |
      | description | test broker  |
    Затем нажимаю на кнопку выбора компании брокеру
    То я не вижу текст "TURAN EXPRESS"
    И нажимаю на компанию "TUMAR EXPRESS"
    Затем нажимаю на "Save"
    То я вижу "You have successfully edited a broker!"

  @editBrokerFailed
  Сценарий: Ошибочное редактирование Broker
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"
    Допустим я открываю страницу "brokers"
    И нажимаю на кнопку редактирования брокера
    Если я введу данные в форму редактирования перевозчика:
      | name        | Ali          |
      | phoneNumber | 333333333    |
      | mc          | 238164       |
      | description | test broker  |
    Затем нажимаю на кнопку выбора компании брокеру
    То я не вижу текст "TURAN EXPRESS"
    И нажимаю на компанию "TUMAR EXPRESS"
    Затем нажимаю на "Save"
    То я вижу "Broker edit is failed!"