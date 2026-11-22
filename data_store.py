"""
Persistent data store for CBR - saves to JSON file for serverless compatibility.
"""
import json
import os
from pathlib import Path

# Path to JSON storage file
STORE_PATH = Path(__file__).parent / "data_store.json"


def _load_initial():
    """Load initial data from data.py"""
    from data import DATA_GEJALA as INIT_GEJALA, NAMA_DIAGNOSIS as INIT_DIAGNOSIS, DATA_DIAGNOSIS as INIT_DATA
    return {
        "gejala": list(INIT_GEJALA),
        "diagnosis": list(INIT_DIAGNOSIS),
        "data": [list(row) for row in INIT_DATA],
    }


def load_store():
    """Load data from JSON file, or initialize from data.py if not exists."""
    if STORE_PATH.exists():
        try:
            with open(STORE_PATH, "r", encoding="utf-8") as f:
                stored = json.load(f)
            # Validate structure
            if all(k in stored for k in ("gejala", "diagnosis", "data")):
                return stored
        except Exception:
            pass
    # Fallback: initialize from data.py and save
    initial = _load_initial()
    save_store(initial)
    return initial


def save_store(store):
    """Save data to JSON file."""
    with open(STORE_PATH, "w", encoding="utf-8") as f:
        json.dump(store, f, ensure_ascii=False, indent=2)


# Module-level cache (per process)
_store_cache = None


def get_store():
    """Get the data store, loading from file if needed."""
    global _store_cache
    if _store_cache is None:
        _store_cache = load_store()
    return _store_cache


def invalidate_cache():
    """Force reload from file on next access."""
    global _store_cache
    _store_cache = None


# --- Compatibility functions matching data.py structure ---

def get_DATA_GEJALA():
    return get_store()["gejala"]


def get_NAMA_DIAGNOSIS():
    return get_store()["diagnosis"]


def get_DATA_DIAGNOSIS():
    return get_store()["data"]


# --- Mutation functions ---

def tambah_gejala(nama_gejala_baru: str) -> tuple:
    """Add a new gejala, persisting to JSON."""
    store = get_store()
    gejala = store["gejala"]
    data = store["data"]

    nama_gejala_baru = nama_gejala_baru.strip().lower().replace(" ", "_")

    if nama_gejala_baru == "":
        return False, "Gagal: nama gejala tidak boleh kosong."

    if nama_gejala_baru in gejala:
        idx = gejala.index(nama_gejala_baru)
        return False, f"Gagal: gejala '{nama_gejala_baru}' sudah ada (indeks {idx})."

    gejala.append(nama_gejala_baru)
    for baris in data:
        baris.append(0)

    save_store(store)
    return True, f"Berhasil: gejala '{nama_gejala_baru}' ditambahkan (indeks {len(gejala) - 1})."


def tambah_diagnosis(nama_baru: str, daftar_gejala: list) -> tuple:
    """Add a new diagnosis, persisting to JSON."""
    store = get_store()
    gejala = store["gejala"]
    diagnosis = store["diagnosis"]
    data = store["data"]

    nama_baru = nama_baru.strip()

    if nama_baru == "":
        return False, "Gagal: nama diagnosis tidak boleh kosong."

    for nama in diagnosis:
        if nama.lower() == nama_baru.lower():
            return False, f"Gagal: diagnosis '{nama_baru}' sudah ada."

    if len(daftar_gejala) == 0:
        return False, "Gagal: diagnosis harus punya minimal satu gejala."

    # Register any new gejala first
    gejala_bersih = []
    for g in daftar_gejala:
        g = g.strip().lower().replace(" ", "_")
        if g not in gejala:
            ok, _ = tambah_gejala(g)
            if not ok:
                # Reload store in case it was modified
                store = get_store()
                gejala = store["gejala"]
        if g not in gejala_bersih:
            gejala_bersih.append(g)

    # Create binary vector for new diagnosis
    deret_biner = [0] * len(gejala)
    for g in gejala_bersih:
        deret_biner[gejala.index(g)] = 1

    diagnosis.append(nama_baru)
    data.append(deret_biner)

    save_store(store)
    return True, f"Berhasil: diagnosis D{len(diagnosis)} | {nama_baru} ditambahkan dengan {len(gejala_bersih)} gejala."


def reset_to_initial():
    """Reset store to initial data.py values (for testing)."""
    global _store_cache
    initial = _load_initial()
    save_store(initial)
    _store_cache = initial
    return initial


if __name__ == "__main__":
    # Test
    store = load_store()
    print(f"Loaded: {len(store['gejala'])} gejala, {len(store['diagnosis'])} diagnosis")
    ok, msg = tambah_gejala("test_gejala_baru")
    print(f"Add gejala: {ok} - {msg}")
    ok, msg = tambah_diagnosis("Test Diagnosis", ["sinyal_telepon_mati", "test_gejala_baru"])
    print(f"Add diagnosis: {ok} - {msg}")
    store = get_store()
    print(f"Now: {len(store['gejala'])} gejala, {len(store['diagnosis'])} diagnosis")
    print(f"Last diagnosis vector len: {len(store['data'][-1])}")