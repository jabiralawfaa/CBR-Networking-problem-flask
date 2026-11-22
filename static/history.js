/**
 * IndexedDB wrapper for diagnosis history
 * DB: "bts_diagnosa", Store: "history", keyPath: "id" (auto-increment), index: "timestamp"
 */
const HistoryDB = (function () {
  const DB_NAME = "bts_diagnosa";
  const STORE_NAME = "history";
  const DB_VERSION = 1;

  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error("IndexedDB not supported"));
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "id",
            autoIncrement: true,
          });
          store.createIndex("timestamp", "timestamp", { unique: false });
        }
      };
    });

    return dbPromise;
  }

  function withStore(mode, callback) {
    return openDB().then((db) => {
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, mode);
        const store = tx.objectStore(STORE_NAME);
        const result = callback(store);

        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error);
      });
    });
  }

  return {
    /**
     * Initialize the database (call on app start)
     */
    init() {
      return openDB();
    },

    /**
     * Save a diagnosis record
     * @param {Object} record - { kode, diagnosis, skor, gejala: [], posisi, timestamp, now }
     * @returns {Promise<number>} - resolves to the auto-incremented id
     */
    save(record) {
      const data = {
        ...record,
        timestamp: Date.now(),
      };
      return withStore("readwrite", (store) => store.add(data));
    },

    /**
     * Get all records sorted by timestamp descending
     * @returns {Promise<Array>}
     */
    getAll() {
      return withStore("readonly", (store) => {
        return new Promise((resolve, reject) => {
          const index = store.index("timestamp");
          const request = index.getAll();
          request.onsuccess = () => {
            // Sort by timestamp descending (newest first)
            const results = request.result.sort((a, b) => b.timestamp - a.timestamp);
            resolve(results);
          };
          request.onerror = () => reject(request.error);
        });
      });
    },

    /**
     * Get a single record by id
     * @param {number} id
     * @returns {Promise<Object|undefined>}
     */
    get(id) {
      return withStore("readonly", (store) => {
        return new Promise((resolve, reject) => {
          const request = store.get(id);
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
      });
    },

    /**
     * Delete a record by id
     * @param {number} id
     * @returns {Promise<void>}
     */
    delete(id) {
      return withStore("readwrite", (store) => {
        return new Promise((resolve, reject) => {
          const request = store.delete(id);
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      });
    },

    /**
     * Clear all records
     * @returns {Promise<void>}
     */
    clear() {
      return withStore("readwrite", (store) => {
        return new Promise((resolve, reject) => {
          const request = store.clear();
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        });
      });
    },
  };
})();

// Expose globally for inline script usage
window.HistoryDB = HistoryDB;