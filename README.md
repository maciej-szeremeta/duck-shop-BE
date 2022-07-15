# Aplikacje backendowa sklepu z gumowymi kaczkami dla programistów **`www.duck-shop.pl`**

## ![Duck](https://duck-shop.pl/api/superduck600x600.png "duck-shop.pl")

> Pierwszy raz gumowa kaczka w świecie IT pojawiła się za sprawą legendarnej książki pt. “The Pragmatic Programmer” autorstwa Andrew Hunta i Davida Thomasa z 1999 roku, która do dziś otwiera głowy przyszłych adeptów sztuki codingu. To właśnie tam pierwszy raz padło pojęcie rubber duck debuggingu, czyli metoda gumowej kaczki dla programistów. Od tamtej pory żółty ptak stał się najlepszym przyjacielem programistów i świetnym pomysłem na prezent dla miłośników IT.

---

---

## Stos technologiczny

- [x] ExpressJS
- [x] MySql
- [x] TypeScript

### _Aplikacje można testować pobierając oraz importując plik `.json` do Insomni lub Postamana_ [Link](https://duck-shop.pl/api/insomnia/DuckShop.postman_insomnia.json "MySql")🦆

---

## Skills

- [x] `Obsługa błędów` 😊
- [x] `Tworzenie tokena z rolami (Admin,User)`😊
- [x] `Weryfikacja użytkownika JWT (Admin,User)`😊
- [x] `TypeScript`😟
- [ ] `Testy`😮

---

## Endpointy

---

USERS

  <details>
<summary> Tabela Users </summary>

| id     | username | email             | password       | isAdmin |
| ------ | -------- | ----------------- | -------------- | ------- |
| uuid() | user     | user@duck-shop.pl | hashedPassword | 1       |

</details>

### `api/auth`

- POST **auth/register**

Rejestracja użytkownika.

- POST **auth/login**

Logowanie użytkownika - informacją zwrotną jest TOKEN wykorzystywana z w celu autoryzacji i autentykacji ( _dziwnie to brzmi po polsku_ 😉).

### `api/user`

- GET **user/find/:id** (@User)

Pobranie jednego użytkownika.

- GET **user?top=100** (@Admin)

Pobranie wielu użytkowników z możliwością ograniczenia ilości w parametrze.

- GET **user/stats** (@Admin)

Prosta statystyka ilość zarejestrowanych użytkowników w miesiącach.

- PATCH **user/** (@User)

Aktualizacja danych użytkownika.

- DELETE **user/:id** (@Admin)

Usówanie użytkownika.

---

PRODUCTS

  <details>
<summary> Tabela Products </summary>

| id     | title       | description        | img                                                           | size | colorId                              | price | inStock |
| ------ | ----------- | ------------------ | ------------------------------------------------------------- | ---- | ------------------------------------ | ----- | ------- |
| uuid() | Batman Duck | Najlepsza kaczucha | [batmanduck](https://duck-shop.pl/api/batmanduck600x600t.png) | M    | 211ae6be-238d-4334-bdac-ae0747fbc7a7 | 12,33 | 1       |

`colorId relacja wiele-do-jednego`

</details>

  <details>
<summary> Tabela Products_categories </summary>

| id             | productId                            | categoryName |
| -------------- | ------------------------------------ | ------------ |
| auto_increment | f9d4cb5f-1ac5-4ef5-915d-d10ce0d1841c | Junior       |
| auto_increment | f9d4cb5f-1ac5-4ef5-915d-d10ce0d1841c | Senior       |

`products_categories relacja wiele-do-wielu`

</details>

  <details>
<summary> Tabela Categories </summary>

| id     | name   | title            | img                                                          |
| ------ | ------ | ---------------- | ------------------------------------------------------------ |
| uuid() | Senior | Senior developer | [Senior Duck](https://duck-shop.pl/api/oldduck600x600.png)   |
| uuid() | Junior | Junior developer | [Junior Duck](https://duck-shop.pl/api/childduck600x600.png) |
| uuid() | Mid    | Mid developer    | [Mid Duck](https://duck-shop.pl/api/superduck600x600.png)    |

</details>
  <details>
<summary> Tabela Colors </summary>

| id     | name     |
| ------ | -------- |
| uuid() | Czarna   |
| uuid() | Czerwona |

</details>

### `api/product`

- POST **product/** (@Admin)

Tworzenie produktu oraz aktualizacja tabeli products_categories (relacja wiele-do-wielu).

- PATCH **product/:id** (@Admin)

Aktualizacja produktu oraz aktualizacja tabeli products_categories (relacja wiele-do-wielu).

- GET **product/find/:id** (@All)

Pobranie jednego produktu.

- GET **product?top=10&category=Mid** (@All)

Pobranie wszystkich produktów w możliwością ograniczenia ilości oraz filtrowaniem po kategorii.

- DELETE **product/:id** (@Admin)

Usówanie produktu oraz aktualizacja tabeli products_categories (relacja wiele-do-wielu).

### `api/colors`

- GET, POST, PATCH, DELETE (CRUD) (@Admin)

### `api/categories`

- GET, POST, PATCH, DELETE (CRUD) (@Admin)

---

CART

  <details>
<summary> Tabela Carts </summary>

| id     | title  |
| ------ | ------ |
| uuid() | userId |

</details>

  <details>
<summary> Tabela Carts_products </summary>

| id             | cartID                               | productId                            | quantity |
| -------------- | ------------------------------------ | ------------------------------------ | -------- |
| auto_increment | 20116395-de80-44fd-b0e3-c56fcc329b4b | f089f588-3e84-4c46-8cc0-ab95e7ba9bcb | 1        |

</details>

### `api/cart`

- POST **cart/** (@User)

Dodawanie do koszyka przez tworzenie nowego koszyka oraz relacji z przedmiotami w tabeli carts_products.

- PATCH **product/:cartId** (@User)

Aktualizacja ilości produktu (produkt podawany w parametrze).

- DELETE **product/:cartId/:productId** (@User)

Usówanie produktu z koszyka.

- DELETE **product/:cartId** (@User)

Usówanie całego koszyka.

- GET **product/:userId** (@User)

Pobranie koszyka użytkownika z informacja zwrotną z listą produktów, ilością pozycji w koszyku oraz wartością koszyka.

- GET **product/** (@Admin)

Poranie wszystkich koszyków.

---

## 🦆🦆🦆🦆🦆🦆🦆🦆🦆🦆🦆🦆🦆🦆🦆🦆🦆🦆
