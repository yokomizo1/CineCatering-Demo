const formatCurrency = (value) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const demoData = {
  dashboard: {
    metrics: [
      ["Receita prevista", 48200, "+18% no mes"],
      ["Margem operacional", "31%", "simulacao comercial"],
      ["Ordens ativas", 6, "3 em filmagem"],
      ["Alertas de estoque", 4, "itens abaixo do minimo"],
    ],
    agenda: [
      ["Longa Horizonte", "Diaria externa - 82 pessoas", "Hoje"],
      ["Serie Cidade Alta", "Cafe, almoco e ceia - 46 pessoas", "Amanha"],
      ["Comercial Aurora", "Cardapio vegetariano - 28 pessoas", "Sex"],
    ],
    insights: [
      ["Compras consolidadas", "Ingredientes agrupados por ficha tecnica e ordem do dia."],
      ["Controle financeiro", "Saldos, cartoes e fluxo projetado em uma unica visao."],
      ["Equipe por ordem", "Alocacao de cozinheiras, motoristas e apoio por diaria."],
    ],
  },
  financeiro: {
    contas: [
      ["Conta Operacao", 18420.5, "entrada de pagamentos"],
      ["Conta Reserva", 7200, "capital de giro"],
      ["Caixa Pequeno", 860.25, "despesas de set"],
    ],
    cartoes: [
      ["Cartao Producao", 1250.45, 6000, 21],
      ["Cartao Compras", 3890.12, 8000, 49],
      ["Cartao Apoio", 640, 2500, 26],
    ],
    fluxo: [
      ["7 dias", 11240],
      ["15 dias", 18680],
      ["30 dias", 27450],
    ],
  },
  ordens: [
    {
      nome: "Longa Horizonte",
      status: "Em preparo",
      data: "28/04",
      pessoas: 82,
      cardapio: ["Arroz carreteiro", "Frango grelhado", "Salada fresca", "Bolo de laranja"],
      equipe: ["Lili - coordenacao", "Marina - cozinha", "Renato - logistica"],
    },
    {
      nome: "Serie Cidade Alta",
      status: "Aguardando compras",
      data: "29/04",
      pessoas: 46,
      cardapio: ["Escondidinho", "Legumes assados", "Brownie", "Cafe reforcado"],
      equipe: ["Paula - cozinha", "Iara - apoio", "Davi - entrega"],
    },
    {
      nome: "Comercial Aurora",
      status: "Cardapio aprovado",
      data: "02/05",
      pessoas: 28,
      cardapio: ["Risoto de cogumelos", "Quiche de alho-poro", "Salada de graos"],
      equipe: ["Lili - atendimento", "Bianca - cozinha"],
    },
  ],
  estoque: [
    ["Arroz agulhinha", "42 kg", "ok"],
    ["Peito de frango", "18 kg", "comprar"],
    ["Cafe especial", "4 kg", "risco"],
    ["Leite sem lactose", "12 L", "ok"],
    ["Embalagem marmita", "130 un", "comprar"],
  ],
};

const titles = {
  dashboard: "Dashboard",
  financeiro: "Financeiro",
  ordens: "Ordens do Dia",
  estoque: "Estoque",
};

const root = document.querySelector("#view-root");
const title = document.querySelector("#page-title");
const toast = document.querySelector("#toast");

function metric(label, value, helper) {
  const display = typeof value === "number" && label.toLowerCase().includes("receita")
    ? formatCurrency(value)
    : value;
  return `<article class="metric"><span>${label}</span><strong>${display}</strong><small>${helper}</small></article>`;
}

function row(title, meta, badge, badgeClass = "") {
  return `
    <div class="row">
      <div>
        <div class="row-title">${title}</div>
        <div class="row-meta">${meta}</div>
      </div>
      <span class="badge ${badgeClass}">${badge}</span>
    </div>
  `;
}

function renderDashboard() {
  const metrics = demoData.dashboard.metrics.map((m) => metric(...m)).join("");
  const agenda = demoData.dashboard.agenda.map((a) => row(a[0], a[1], a[2], a[2] === "Hoje" ? "info" : "")).join("");
  const insights = demoData.dashboard.insights
    .map((i) => `<div class="split-row"><strong>${i[0]}</strong><span class="row-meta">${i[1]}</span></div>`)
    .join("");

  root.innerHTML = `
    <section class="grid cols-4">${metrics}</section>
    <section class="grid cols-2">
      <article class="panel">
        <div class="panel-header"><div><h2>Agenda operacional</h2><p>Proximas entregas simuladas.</p></div></div>
        <div class="list">${agenda}</div>
      </article>
      <article class="panel">
        <div class="panel-header"><div><h2>Valor do produto</h2><p>Principais fluxos exibidos na demo.</p></div></div>
        <div class="list">${insights}</div>
      </article>
    </section>
  `;
}

function renderFinanceiro() {
  const contas = demoData.financeiro.contas
    .map((c) => row(c[0], c[2], formatCurrency(c[1]), c[1] < 1000 ? "warn" : ""))
    .join("");
  const cartoes = demoData.financeiro.cartoes
    .map((c) => `
      <div class="split-row">
        <div>
          <strong>${c[0]}</strong>
          <div class="row-meta">${formatCurrency(c[1])} usados de ${formatCurrency(c[2])}</div>
        </div>
        <div class="progress" aria-label="${c[3]} por cento usado"><span style="width:${c[3]}%"></span></div>
      </div>
    `)
    .join("");
  const fluxo = demoData.financeiro.fluxo.map((f) => metric(f[0], formatCurrency(f[1]), "saldo projetado")).join("");

  root.innerHTML = `
    <section class="grid cols-3">${fluxo}</section>
    <section class="grid cols-2">
      <article class="panel"><div class="panel-header"><div><h2>Contas</h2><p>Saldos ficticios para apresentacao.</p></div></div>${contas}</article>
      <article class="panel"><div class="panel-header"><div><h2>Cartoes</h2><p>Uso por limite e ciclo de fatura.</p></div></div>${cartoes}</article>
    </section>
  `;
}

function renderOrdens() {
  const cards = demoData.ordens
    .map((ordem) => `
      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>${ordem.nome}</h2>
            <p>${ordem.data} - ${ordem.pessoas} pessoas</p>
          </div>
          <span class="badge info">${ordem.status}</span>
        </div>
        <h3>Cardapio</h3>
        <div class="tag-list">${ordem.cardapio.map((item) => `<span class="tag">${item}</span>`).join("")}</div>
        <h3 style="margin-top:18px">Equipe</h3>
        <div class="tag-list">${ordem.equipe.map((item) => `<span class="tag">${item}</span>`).join("")}</div>
      </article>
    `)
    .join("");

  root.innerHTML = `<section class="grid cols-3">${cards}</section>`;
}

function renderEstoque() {
  const rows = demoData.estoque
    .map((e) => {
      const className = e[2] === "risco" ? "risk" : e[2] === "comprar" ? "warn" : "";
      return row(e[0], e[1], e[2], className);
    })
    .join("");

  root.innerHTML = `
    <section class="grid cols-2">
      <article class="panel">
        <div class="panel-header"><div><h2>Alertas de estoque</h2><p>Lista demonstrativa calculada a partir das ordens.</p></div></div>
        ${rows}
      </article>
      <article class="panel">
        <div class="panel-header"><div><h2>Compras sugeridas</h2><p>Itens agrupados por necessidade operacional.</p></div></div>
        ${row("Proteinas", "Frango, ovos e queijo para 3 diarias", "prioridade", "warn")}
        ${row("Hortifruti", "Reposicao para saladas e guarnicoes", "normal")}
        ${row("Descartaveis", "Marmitas e copos para sets externos", "comprar", "warn")}
      </article>
    </section>
  `;
}

const renderers = {
  dashboard: renderDashboard,
  financeiro: renderFinanceiro,
  ordens: renderOrdens,
  estoque: renderEstoque,
};

function setView(view) {
  title.textContent = titles[view];
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.view === view);
  });
  renderers[view]();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

document.querySelectorAll(".nav-item").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

document.querySelector("#simulate-action").addEventListener("click", () => {
  showToast("Acao simulada: nenhuma informacao foi gravada ou enviada.");
});

setView("dashboard");
