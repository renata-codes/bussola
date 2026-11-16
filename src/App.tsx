import { useState } from "react";

type Empresa = {
  posicao_2025: number;
  fornecedor: string;
  reclamacoes: number;
  indice_atendidas_pct: number;
  posicao_2024: number;
  indice_nao_atendidas_pct: number;
};

type Corpo = {
  procon_sp: { fonte: string; resultados: Empresa[]; aviso: string | null };
  consumidor_gov: { fonte: string; link: string; como_consultar: string };
};

const card = {
  background: "rgba(255,255,255,0.96)",
  borderRadius: "20px",
  padding: "24px",
  marginTop: "16px",
  textAlign: "left" as const,
  boxShadow: "0 25px 60px rgba(0,0,0,.25)",
  color: "#111827",
};

function App() {
  const [query, setQuery] = useState("");
  const [dados, setDados] = useState<Corpo | null>(null);
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function buscar() {
    if (!query.trim() || carregando) return;
    setCarregando(true);
    setErro("");
    setDados(null);
    try {
      const r = await fetch(`/search?query=${encodeURIComponent(query.trim())}`);
      if (!r.ok) throw new Error(`Servidor respondeu ${r.status}`);
      const json = await r.json();
      setDados(json.resultados?.procon_sp ? json.resultados : json);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao buscar");
    } finally {
      setCarregando(false);
    }
  }

  const temResultado = dados !== null || erro !== "";

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        fontFamily: "Inter, Segoe UI, sans-serif",
      }}
    >
      {/* GIF DE FUNDO (fixo, cobre a página toda mesmo com rolagem) */}
      <img
        src="/bussola.gif"
        alt=""
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
        }}
      />
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "linear-gradient(rgba(0,0,0,0.40), rgba(0,0,0,0.65))",
          zIndex: 1,
        }}
      />
      {/* Conteúdo */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          minHeight: "100vh",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          paddingTop: temResultado ? "6vh" : "12vh",
          paddingBottom: "48px",
          paddingLeft: "24px",
          paddingRight: "24px",
          transition: "padding-top .3s",
        }}
      >
        <div style={{ width: "100%", maxWidth: "900px", textAlign: "center" }}>
          <h1
            style={{
              fontSize: temResultado ? "56px" : "84px",
              fontWeight: 800,
              color: "#ffffff",
              margin: 0,
              letterSpacing: "-3px",
              transition: "font-size .3s",
            }}
          >
            Bússola
          </h1>
          <p
            style={{
              marginTop: temResultado ? "16px" : "32px",
              marginBottom: temResultado ? "32px" : "80px",
              fontSize: temResultado ? "18px" : "24px",
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.8,
            }}
          >
            Onde os clientes apontam problemas,
            <br />
            a Bússola mostra o caminho.
          </p>

          <div
            style={{
              background: "rgba(255,255,255,0.96)",
              borderRadius: "24px",
              padding: "12px",
              display: "flex",
              gap: "12px",
              boxShadow: "0 25px 60px rgba(0,0,0,.25)",
            }}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && buscar()}
              placeholder="O que você deseja descobrir hoje?"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                padding: "18px",
                fontSize: "16px",
              }}
            />
            <button
              onClick={buscar}
              disabled={carregando}
              style={{
                background: "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "16px",
                padding: "18px 32px",
                cursor: carregando ? "wait" : "pointer",
                fontWeight: 600,
                fontSize: "15px",
                opacity: carregando ? 0.7 : 1,
              }}
            >
              {carregando ? "Analisando..." : "Analisar"}
            </button>
          </div>

          {/* RESULTADOS */}
          {erro && (
            <div style={{ ...card, color: "#b91c1c" }}>Erro ao buscar: {erro}</div>
          )}

          {dados && (
            <>
              <div style={card}>
                <h3 style={{ margin: "0 0 12px", fontSize: "18px" }}>{dados.procon_sp.fonte}</h3>
                {dados.procon_sp.resultados.length === 0 ? (
                  <p style={{ margin: 0 }}>{dados.procon_sp.aviso ?? "Nenhum resultado."}</p>
                ) : (
                  dados.procon_sp.resultados.map((e) => (
                    <div
                      key={e.fornecedor}
                      style={{ borderTop: "1px solid #e5e7eb", padding: "14px 0" }}
                    >
                      <div style={{ fontWeight: 700, fontSize: "17px" }}>
                        {e.posicao_2025}º — {e.fornecedor}
                      </div>
                      <div style={{ marginTop: "6px" }}>
                        Reclamações fundamentadas: <strong>{e.reclamacoes.toLocaleString("pt-BR")}</strong>
                      </div>
                      <div>
                        Atendidas: <strong style={{ color: "#15803d" }}>{e.indice_atendidas_pct}%</strong>
                        {" | "}
                        Não atendidas: <strong style={{ color: "#b91c1c" }}>{e.indice_nao_atendidas_pct}%</strong>
                      </div>
                      <div style={{ color: "#6b7280", fontSize: "14px" }}>
                        Posição em 2024: {e.posicao_2024}º
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={card}>
                <h3 style={{ margin: "0 0 8px", fontSize: "18px" }}>{dados.consumidor_gov.fonte}</h3>
                <p style={{ margin: "0 0 12px" }}>{dados.consumidor_gov.como_consultar}</p>
                <a
                  href={dados.consumidor_gov.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#2563eb", fontWeight: 600 }}
                >
                  Abrir indicadores no Consumidor.gov.br
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;