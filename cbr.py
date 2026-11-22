"""
CBR Core Functions: Cosine Similarity & Recommendation Engine
"""

from data import DATA_GEJALA, NAMA_DIAGNOSIS, DATA_DIAGNOSIS


def hitung_cosine_similarity(vector_a: list, vector_b: list) -> float:
    """
    Menghitung cosine similarity antara dua vector biner.
    Return: persentase (0-100)
    """
    dot_product = 0.0
    sum_sq_a = 0.0
    sum_sq_b = 0.0

    for i in range(len(vector_a)):
        dot_product += vector_a[i] * vector_b[i]
        sum_sq_a += vector_a[i] ** 2
        sum_sq_b += vector_b[i] ** 2

    pembagi = (sum_sq_a ** 0.5) * (sum_sq_b ** 0.5)

    if pembagi != 0:
        return (dot_product / pembagi) * 100
    return 0.0


def dapatkan_rekomendasi(kasus_baru: list) -> list:
    """
    Menghitung similarity kasus baru terhadap semua diagnosis.
    Return: list of dict sorted by skor desc
    [
        {"kode": "D1", "diagnosis": "VSWR", "skor": 75.0, "gejala": [...]},
        ...
    ]
    """
    hasil_perhitungan = []

    for i in range(len(DATA_DIAGNOSIS)):
        skor = hitung_cosine_similarity(kasus_baru, DATA_DIAGNOSIS[i])

        # Ambil gejala yang aktif untuk diagnosis ini
        gejala_aktif = []
        for j in range(len(DATA_DIAGNOSIS[i])):
            if DATA_DIAGNOSIS[i][j] == 1:
                gejala_aktif.append(DATA_GEJALA[j])

        hasil_perhitungan.append({
            "kode": f"D{i + 1}",
            "diagnosis": NAMA_DIAGNOSIS[i],
            "skor": round(skor, 2),
            "gejala": gejala_aktif,
        })

    # Sort descending by skor
    hasil_perhitungan.sort(key=lambda x: x["skor"], reverse=True)

    # Tambahkan peringkat
    for peringkat, item in enumerate(hasil_perhitungan, 1):
        item["peringkat"] = peringkat

    return hasil_perhitungan


def tambah_gejala(nama_gejala_baru: str) -> tuple:
    """ tambah_gejala(nama_gejala_baru) -> (ok, message)

    Tambah satu gejala baru ke basis kasus.
    Semua kasus diagnosis lama otomatis diberi nilai 0 untuk gejala ini,
    supaya panjang vektor tetap sama dengan jumlah gejala.
    """
    nama_gejala_baru = nama_gejala_baru.strip().lower().replace(" ", "_")

    if nama_gejala_baru == "":
        return False, "Gagal: nama gejala tidak boleh kosong."

    if nama_gejala_baru in DATA_GEJALA:
        idx = DATA_GEJALA.index(nama_gejala_baru)
        return False, f"Gagal: gejala '{nama_gejala_baru}' sudah ada (indeks {idx})."

    DATA_GEJALA.append(nama_gejala_baru)
    for baris in DATA_DIAGNOSIS:
        baris.append(0)

    return True, f"Berhasil: gejala '{nama_gejala_baru}' ditambahkan (indeks {len(DATA_GEJALA) - 1})."


def tambah_diagnosis(nama_baru: str, daftar_gejala: list) -> tuple:
    """ tambah_diagnosis(nama_baru, daftar_gejala) -> (ok, message)

    Tambah satu diagnosis (penyakit) baru beserta gejalanya.
    daftar_gejala berisi nama gejala. Gejala yang belum ada di DATA_GEJALA
    otomatis didaftarkan lebih dulu lewat tambah_gejala().
    """
    nama_baru = nama_baru.strip()

    if nama_baru == "":
        return False, "Gagal: nama diagnosis tidak boleh kosong."

    for nama in NAMA_DIAGNOSIS:
        if nama.lower() == nama_baru.lower():
            return False, f"Gagal: diagnosis '{nama_baru}' sudah ada."

    if len(daftar_gejala) == 0:
        return False, "Gagal: diagnosis harus punya minimal satu gejala."

    # daftarkan gejala yang belum ada
    gejala_bersih = []
    for g in daftar_gejala:
        g = g.strip().lower().replace(" ", "_")
        if g not in DATA_GEJALA:
            tambah_gejala(g)
        if g not in gejala_bersih:
            gejala_bersih += [g]

    # buat deret biner untuk diagnosis baru
    deret_biner = [0] * len(DATA_GEJALA)
    for g in gejala_bersih:
        deret_biner[DATA_GEJALA.index(g)] = 1

    NAMA_DIAGNOSIS.append(nama_baru)
    DATA_DIAGNOSIS.append(deret_biner)

    return True, f"Berhasil: diagnosis D{len(NAMA_DIAGNOSIS)} | {nama_baru} ditambahkan dengan {len(gejala_bersih)} gejala."


def get_gejala_list() -> list:
    """Return list of all gejala for UI."""
    return DATA_GEJALA


def get_diagnosis_list() -> list:
    """Return list of all diagnosis with codes."""
    return [{"kode": f"D{i+1}", "nama": nama} for i, nama in enumerate(NAMA_DIAGNOSIS)]


if __name__ == "__main__":
    # Quick test
    new_case = [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
    hasil = dapatkan_rekomendasi(new_case)
    for h in hasil:
        print(f"Peringkat {h['peringkat']} -> Kode: {h['kode']} | Diagnosis: {h['diagnosis']} | Skor: {h['skor']:.2f}%")