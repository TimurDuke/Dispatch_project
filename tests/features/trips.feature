# language: ru

Функционал: Регистрация груза
  Как пользователь user или админ
  Я должен иметь возможность регистрировать новый груз
  После ввода данных и отправки данных

  @tripRegister
  Сценарий: Регистрация нового груза
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"
    Допустим я открываю страницу "loads/?status=upcoming"
    И я нажимаю на кнопку "add"
    Если я напишу данные:
      | datePU    | 11/24/2022   |
      | dateDEL   | 11/25/2022   |
      | timeToPU  | 11:20        |
      | timeToDel | 20:35        |
      | loadCode  | T-D1A38SR1C  |
      | pu        | Boston, MA   |
      | del       | New-York, NY |
      | miles     | 235          |
      | rpm       | 3,3          |
      | price     | 775,5        |
      | comment   | some comment |

    Затем нажимаю на поле, чтобы выбрать "Broker"
    И нажимаю на элемент списка с текстом "Aibek"
    Затем нажимаю на селект с надписью "Driver"
    И нажимаю на элемент списка с текстом "Kuba"

    Также прикрепляю в поле "RC" файл "images/rc.pdf"
    Также прикрепляю в поле "BOL" файл "images/bol.pdf"

    Когда нажимаю на "Save"
    То я вижу "Trip created!"


  @registerTripFailed
  Сценарий: Регистрация нового груза не прошла
    Допустим я захожу на страницу "login"
    Если я введу данные:
      | email    | admin@gmail.com |
      | password | admin           |
    И нажимаю на кнопку "Sign In"
    То я вижу текст "HELLO, ADMIN"
    Допустим я открываю страницу "loads/?status=upcoming"
    И я нажимаю на кнопку "add"
    Если я напишу данные:
      | datePU    | 11/20/2022    |
      | dateDEL   | 11/18/2022    |
      | timeToPU  | 22:00         |
      | timeToDel | 11:05         |
      | loadCode  | T-12FEF4E5F   |
      | pu        | Chicago, IL   |
      | del       | Lafayette, LA |
      | miles     | 500           |
      | rpm       | 5             |
      | price     | 2500          |
      | comment   | some comment  |

    Затем нажимаю на поле, чтобы выбрать "Broker"
    И нажимаю на элемент списка с текстом "Aibek"
    Затем нажимаю на селект с надписью "Driver"
    И нажимаю на элемент списка с текстом "Kuba"

    Также прикрепляю в поле "RC" файл "images/rc.pdf"
    Также прикрепляю в поле "BOL" файл "images/bol.pdf"

    Когда нажимаю на "Save"
    То я вижу "Trip creation failed!"
