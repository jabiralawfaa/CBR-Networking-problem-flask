"""
Flask App untuk CBR Diagnosis BTS
"""
from flask import Flask, render_template, request, jsonify

from cbr import get_gejala_list, get_diagnosis_list, dapatkan_rekomendasi

app = Flask(__name__)


@app.route("/")
def index():
    gejala = get_gejala_list()
    return render_template("index.html", gejala=gejala)


@app.route("/diagnosa", methods=["POST"])
def diagnosa():
    gejala = get_gejala_list()
    # Ambil nilai checkbox dari form (1 jika checked, 0 jika tidak)
    kasus_baru = []
    for g in gejala:
        val = request.form.get(g)
        kasus_baru.append(1 if val == "on" else 0)

    hasil = dapatkan_rekomendasi(kasus_baru)
    return render_template("result.html", hasil=hasil, kasus_baru=kasus_baru, gejala=gejala)


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
    if len(kasus_baru) != 24:
        return jsonify({"error": "Gejala harus 24 item"}), 400

    hasil = dapatkan_rekomendasi(kasus_baru)
    return jsonify(hasil)


if __name__ == "__main__":
    app.run(debug=True)