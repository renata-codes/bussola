from pathlib import Path
import pandas as pd

CAMINHO = Path(__file__).parent / "data" / "procon_sp_ranking_2025.csv"
LINK_CONSUMIDOR = "https://www.consumidor.gov.br/pages/indicador/geral/abrir"

def carregar_procon():
    if not CAMINHO.exists() or CAMINHO.stat().st_size == 0:
        raise FileNotFoundError(f"Base ausente ou vazia: {CAMINHO}")
    return pd.read_csv(CAMINHO, sep=";", encoding="utf-8")

def buscar_empresa(query: str):
    df = carregar_procon()
    achados = df[df["fornecedor"].str.contains(query, case=False, na=False, regex=False)]
    return {
        "empresa": query,
        "procon_sp": {
            "fonte": "Cadastro de Reclamações Fundamentadas 2025 (Procon SP)",
            "resultados": achados.to_dict(orient="records"),
            "aviso": None if len(achados) else "Fora do top 50 do Procon SP",
        },
        "consumidor_gov": {
            "fonte": "Consumidor.gov.br - Indicadores",
            "link": LINK_CONSUMIDOR,
            "como_consultar": "Aba 'Por Empresa' e busque pelo nome",
        },
    }