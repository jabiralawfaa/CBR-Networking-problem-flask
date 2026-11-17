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