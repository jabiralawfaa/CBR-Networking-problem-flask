"""
Data CBR: Gejala, Diagnosis, dan Vektor Binary
"""

# Data gejala (24 gejala)
DATA_GEJALA = [
    "sinyal_telepon_mati",
    "bts_bad_performance",
    "sinyal_tidak_ke_antena_sektoral",
    "block_call_pelanggan",
    "sambungan_komunikasi_terputus",
    "transmisi_down",
    "error_rangkaian_digital",
    "sinyal_telepon_tidak_stabil",
    "service_link_pihak_ketiga_down",
    "sinyal_salah_satu_service_hilang",
    "sinyal_internet_tidak_stabil",
    "bts_terdeteksi_di_monitor_noc",
    "alarm_muncul_pada_hub_site",
    "suhu_shelter_di_ambang_batas",
    "suhu_recty_tinggi",
    "bts_down",
    "alarm_muncul_pada_modul",
    "power_modul_atau_psu_mati",
    "psu_tidak_beraturan",
    "lampu_indikator_daya_mati",
    "sinyal_tidak_ke_board",
    "board_tidak_terdeteksi",
    "board_tetap_tidak_terdeteksi_saat_pindah_slot",
    "rtwp_minus105dbm_tanpa_muatan",
]

# Nama diagnosis (9 diagnosis)
NAMA_DIAGNOSIS = [
    "VSWR",
    "Bad RSL",
    "Link 3rd party down",
    "Hub site down",
    "High temperature",
    "Modul power faulty",
    "Power off",
    "Board faulty",
    "RTWP",
]

# Data diagnosis: binary vectors (9 x 24)
DATA_DIAGNOSIS = [
    [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  # D1 VSWR
    [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  # D2 Bad RSL
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  # D3 Link 3rd party down
    [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  # D4 Hub site down
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],  # D5 High temperature
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0],  # D6 Modul power faulty
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0],  # D7 Power off
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0],  # D8 Board faulty
    [1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],  # D9 RTWP
]