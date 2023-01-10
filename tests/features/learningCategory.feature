# language: ru

Функционал: Добавление новой категории базы знаний
  Как пользователь админ
  Я должен иметь возможность добавить новую категорию
  После ввода данных и отправки данных

  @addLearningCategory
  Сценарий: Добавление новой категории
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"
    Допустим я открываю страницу "learnings"
    То я нажимаю на кнопку "add"
    Если я напишу данные:
      | title    | Cancelled load  |
    Затем нажимаю на "Save"
    То я вижу "Learning Category is added!"

  @addLearningCategoryFailed
  Сценарий: Добавление новой категории не прошла
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"
    Допустим я открываю страницу "learnings"
    То я нажимаю на кнопку "add"
    Если я напишу данные:
      | title    | Cancelled load  |
    Затем нажимаю на "Save"
    То я вижу "Learning Category creation failed!"

  @filterLearningCategory
  Сценарий: Поиск Learning Category по введенным данным
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"
    Допустим я открываю страницу "learnings"
    То я ввожу данные в поле поиска
    Если я введу следующие данные "Dispatchers"
    То я вижу сущность с данными "Dispatchers Common Mistakes"
