# language: ru

Функционал: Логин пользователя
  Как анонимный пользователь
  Я должен иметь возможноость залогиниться в системе
  После ввода данных и отправки их

Сценарий:
  Допустим я захожу на страницу "login"
  Если я введу данные:
    | email | admin@gmail.com |
    | password | admin        |
  И нажимаю на кнопку "Sign In"
  То я вижу текст "HELLO, ADMIN"



