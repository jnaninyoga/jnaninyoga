import { collectionDB } from ".";

export const names = {
    classes: "classes",
    contacts: "contacts",
    reviews: "reviews",
    auth: "auth",
}

export const collections = {
    classes: collectionDB(names.classes),
    contacts: collectionDB(names.contacts),
    reviews: collectionDB(names.reviews),
    auth: collectionDB(names.auth),
}

export default collections;