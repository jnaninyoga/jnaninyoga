import { collectionDB } from ".";

export const names = {
    classes: "classes",
    contacts: "contacts",
    books: "books",
    reviews: "reviews",
    auth: "auth",
    users: "users",
    carnets: "carnets",
}

export const collections = {
    classes: collectionDB(names.classes),
    contacts: collectionDB(names.contacts),
    books: collectionDB(names.books),
    reviews: collectionDB(names.reviews),
    auth: collectionDB(names.auth),
    users: collectionDB(names.users),
    carnets: collectionDB(names.carnets),
}

export default collections;