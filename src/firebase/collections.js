import { collectionDB } from ".";

export const names = {
    auth: import.meta.env.VITE_COLLECTION_AUTH,
    books: import.meta.env.VITE_COLLECTION_BOOKS,
    carnets: import.meta.env.VITE_COLLECTION_CARNETS,
    classes: import.meta.env.VITE_COLLECTION_CLASSES,
    clients: import.meta.env.VITE_COLLECTION_CLIENTS,
    configurations: import.meta.env.VITE_COLLECTION_CONFIGURATIONS,
    contacts: import.meta.env.VITE_COLLECTION_CONTACTS,
    emails: import.meta.env.VITE_COLLECTION_EMAILS,
    reviews: import.meta.env.VITE_COLLECTION_REVIEWS,
    // collection configurations:
}

export const configurations = {
    carnets: import.meta.env.VITE_COLLECTION_CARNETS,
}

export const collections = Object.keys(names).reduce((collection, name) => {
    collection[name] = collectionDB(names[name]);
    return collection;
}, {});

export default collections;