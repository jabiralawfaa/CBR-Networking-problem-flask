"""
Flask App untuk CBR Diagnosis BTS
"""
from flask import Flask, render_template, request, jsonify, redirect, url_for
from datetime import datetime
from urllib.parse import quote

from cbr import get_gejala_list, get_diagnosis_list, dapatkan_rekomendasi, tambah_gejala, tambah_diagnosis

app = Flask(__name__)


@app.context_processor
def inject_counts():
    return {
        "gejala_count": len(get_gejala_list()),
        "diagnosis_count": len(get_diagnosis_list()),
    }


@app.route("/")
def welcome():
    diagnosis_list = get_diagnosis_list()
    # Get gejala count for each diagnosis
    from data import DATA_DIAGNOSIS, DATA_GEJALA
    for d in diagnosis_list:
        idx = int(d["kode"][1:]) - 1
        d["gejala"] = [DATA_GEJALA[i] for i, v in enumerate(DATA_DIAGNOSIS[idx]) if v == 1]
    return render_template("welcome.html", diagnosis_list=diagnosis_list)


@app.route("/diagnosa")
def diagnosa_form():
    gejala = get_gejala_list()
    return render_template("diagnosa.html", gejala=gejala)


@app.route("/diagnosa", methods=["POST"])
def diagnosa():
    gejala = get_gejala_list()
    # Ambil nilai checkbox dari form (1 jika checked, 0 jika tidak)
    kasus_baru = []
    for g in gejala:
        val = request.form.get(g)
        kasus_baru.append(1 if val == "on" else 0)

    hasil = dapatkan_rekomendasi(kasus_baru)
    now = datetime.now().strftime("%d/%m/%Y, %H.%M")
    posisi = request.form.get("pos", "").strip()
    return render_template("result.html", hasil=hasil, kasus_baru=kasus_baru, gejala=gejala, now=now, posisi=posisi)


@app.route("/api/gejala")
def api_gejala():
    return jsonify(get_gejala_list())


@app.route("/api/diagnosis")
def api_diagnosis():
    return jsonify(get_diagnosis_list())


@app.route("/api/diagnosa", methods=["POST"])
def api_diagnosa():
    data = request.get_json()
    if not data or "gejala" not in data:
        return jsonify({"error": "Field 'gejala' required"}), 400

    kasus_baru = data["gejala"]
    if len(kasus_baru) != len(get_gejala_list()):
        return jsonify({"error": f"Gejala harus {len(get_gejala_list())} item"}), 400

    hasil = dapatkan_rekomendasi(kasus_baru)
    return jsonify(hasil)


@app.route("/kelola")
def kelola():
    msg = request.args.get("msg", "")
    ok = request.args.get("ok", "true") == "true"
    return render_template(
        "kelola.html",
        gejala=get_gejala_list(),
        diagnosis_list=get_diagnosis_list(),
        msg=msg,
        ok=ok,
    )


@app.route("/riwayat")
def riwayat():
    return render_template("riwayat.html")


@app.route("/kelola/gejala", methods=["POST"])
def kelola_gejala():
    nama = request.form.get("nama", "")
    ok, message = tambah_gejala(nama)
    return redirect(f"/kelola?msg={quote(message)}&ok={'true' if ok else 'false'}")


@app.route("/kelola/diagnosis", methods=["POST"])
def kelola_diagnosis():
    nama = request.form.get("nama", "")
    gejala_terpili = request.form.getlist("gejala")
    gejala_baru_raw = request.form.get("gejala_baru", "")

    daftar_gejala = list(gejala_terpili)
    if gejala_baru_raw.strip():
        for g in gejala_baru_raw.split(","):
            g = g.strip()
            if g:
                daftar_gejala.append(g)

    ok, message = tambah_diagnosis(nama, daftar_gejala)
    return redirect(f"/kelola?msg={quote(message)}&ok={'true' if ok else 'false'}")


if __name__ == "__main__":
    app.run(debug=True)