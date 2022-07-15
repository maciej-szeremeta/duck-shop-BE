# Aplikacje backendowa sklepu z gumowymi kaczkami dla programistów **`www.duck-shop.pl`**

[![NPM Version][npm-version-image]][npm-url]
[![NPM Install Size][npm-install-size-image]][npm-install-size-url]
[![NPM Downloads][npm-downloads-image]][npm-downloads-url]

## ![Duck](https://duck-shop.pl/api/superduck600x600.png "duck-shop.pl")

> Pierwszy raz gumowa kaczka w świecie IT pojawiła się za sprawą legendarnej książki pt. “The Pragmatic Programmer” autorstwa Andrew Hunta i Davida Thomasa z 1999 roku, która do dziś otwiera głowy przyszłych adeptów sztuki codingu. To właśnie tam pierwszy raz padło pojęcie rubber duck debuggingu, czyli metoda gumowej kaczki dla programistów. Od tamtej pory żółty ptak stał się najlepszym przyjacielem programistów i świetnym pomysłem na prezent dla miłośników IT.

---

---

## Stos technologiczny

- [x] ExpressJS
- [x] MySql

### _Aplikacje można testować pobierając oraz importując plik `.json` do Insomni lub Postamana_ [Link](https://duck-shop.pl/api/insomnia/DuckShop.postman_insomnia.json "MySql")🦆

---

## Endpointy

  <details>
<summary> Tabela Users </summary>

| id     | username | email             | password       | isAdmin |
| ------ | -------- | ----------------- | -------------- | ------- |
| uuid() | user     | user@duck-shop.pl | hashedPassword | 1       |

</details>

---

### `api/auth`

- POST **auth/register**

Rejestracja użytkownika

- POST **auth/login**

Logowanie użytkownika - informacja zwrotną jest TOKEN wykorzystywana z w celu autoryzacji i autentykacji.

### `api/user`

- GET **user/find/:id** (@User)

Pobranie jednego użytkownika

- GET **user?top=100** (@Admin)

Pobranie wielu użytkowników z możliwością ograniczenia ilości w parametrze
