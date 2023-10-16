import { collectionDB } from ".";

export const names = {
    auth: import.meta.env.VITE_COLLECTION_AUTH,
    users: import.meta.env.VITE_COLLECTION_USERS,
    carnets: import.meta.env.VITE_COLLECTION_CARNETS,
    classes: import.meta.env.VITE_COLLECTION_CLASSES,
    contacts: import.meta.env.VITE_COLLECTION_CONTACTS,
    books: import.meta.env.VITE_COLLECTION_BOOKS,
    reviews: import.meta.env.VITE_COLLECTION_REVIEWS,
    emails: import.meta.env.VITE_COLLECTION_EMAILS,
    // collection configuations:
    configurations: import.meta.env.VITE_COLLECTION_CONFIGURATIONS,
}

export const collections = Object.keys(names).reduce((collection, name) => {
    collection[name] = collectionDB(names[name]);
    return collection;
}, {});

export default collections;