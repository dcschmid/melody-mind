/**
 * Initializes local storage with a key-value pair if the key does not already exist.
 *
 * @param key - The key to check in local storage.
 * @param value - The value to set if the key does not exist.
 */
export function initLocalStorage(key: string, value: string) {
  // Check if the key does not exist in local storage
  // The getItem() method returns the value of the key if it exists, or null if it does not.
  if (!localStorage.getItem(key)) {
    // If the key does not exist, set the key-value pair in local storage
    // The setItem() method adds or updates an item with the specified key and value in the local storage.
    localStorage.setItem(key, value);
  }
}
