import { writable } from 'svelte/store';

export const userLoggedIn = writable(false);
export const currentUser = writable(null);
export const loading = writable(true);

export const setUser = newUser => {
    console.log("setUser called");
    currentUser.set(newUser);
  };
  
export const setLoading = newLoading => {
    console.log("setLoading called");
    loading.set(newLoading);
  };