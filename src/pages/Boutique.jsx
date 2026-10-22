
import { useRef, useState } from "react";

const capacetes = [
  {
    id: 101,
    nome: "Racing Pro Black",
    categoria: "Capacetes",
    estilo: "Esportivo",
    certificacoes: ["ECE", "DOT"],
    tamanhos: ["PP", "P", "M", "G", "GG"],
    preco: 599.90,
    imagem:
      "https://images.unsplash.com/photo-1513089722837-f10c05960a52?auto=format&fit=crop&w=800&q=80",
    descricao: "Design esportivo, viseira ampla e acabamento premium.",
  },
  {
    id: 102,
    nome: "Sport Blue",
    categoria: "Capacetes",
    estilo: "Esportivo",
    certificacoes: ["ECE"],
    tamanhos: ["P", "M", "G", "GG"],
    preco: 749.90,
    imagem:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    descricao: "Visual moderno para quem procura estilo e conforto.",
  },
  {
    id: 103,
    nome: "Street Graphite",
    categoria: "Capacetes",
    estilo: "Street",
    certificacoes: ["DOT"],
    tamanhos: ["PP", "P", "M", "G"],
    preco: 429.90,
    imagem:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    descricao: "Modelo versátil para o uso urbano e cotidiano.",
  },
  {
    id: 104,
    nome: "Touring Premium",
    categoria: "Capacetes",
    estilo: "Touring",
    certificacoes: ["ECE", "Snell"],
    tamanhos: ["P", "M", "G", "GG"],
    preco: 899.90,
    imagem:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80",
    descricao: "Conforto para viagens e percursos mais longos.",
  },
  {
    id: 105,
    nome: "Racing Carbon",
    categoria: "Capacetes",
    estilo: "Esportivo",
    certificacoes: ["ECE", "Snell"],
    tamanhos: ["P", "M", "G"],
    preco: 1299.90,
    imagem:
      "https://images.unsplash.com/photo-1513089722837-f10c05960a52?auto=format&fit=crop&w=800&q=80",
    descricao: "Visual inspirado nas pistas e acabamento sofisticado.",
  },
  {
    id: 106,
    nome: "Urban White",
    categoria: "Capacetes",
    estilo: "Street",
    certificacoes: ["ECE", "DOT"],
    tamanhos: ["PP", "P", "M", "G", "GG"],
    preco: 479.90,
    imagem:
      "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80",
    descricao: "Estilo clean e versátil para a rotina sobre duas rodas.",
  },
];

const outrosProdutos = [
  {
    id: 2,
    nome: "Luvas para Motociclista",
    categoria: "Vestuário",
    preco: 120,
    imagem:
      "https://images.unsplash.com/photo-1683183191020-cf86f3d45db3?auto=format&fit=crop&w=800&q=80",
    descricao: "Mais aderência e segurança ao pilotar.",
  },
  {
    id: 3,
    nome: "Jaqueta de Motociclismo",
    categoria: "Vestuário",
    preco: 380,
    imagem:
      "https://images.unsplash.com/photo-1770130697254-d965c05d2ee0?auto=format&fit=crop&w=800&q=80",
    descricao: "Resistência e conforto para o dia a dia.",
  },
  {
    id: 4,
    nome: "Óculos para Motociclista",
    categoria: "Acessórios",
    preco: 85,
    imagem:
      "https://images.unsplash.com/photo-1677030041879-24c9e2cc55e5?auto=format&fit=crop&w=800&q=80",
    descricao: "Proteção contra vento e poeira.",
  },
  {
    id: 5,
    nome: "Capa de Chuva",
    categoria: "Acessórios",
    preco: 150,
    imagem:
      "https://images.unsplash.com/photo-1781277495387-ec90b4ba7e3c?auto=format&fit=crop&w=800&q=80",
    descricao: "Proteção para pilotar em dias chuvosos.",
  },
  {
    id: 6,
    nome: "Kit de Ferramentas",
    categoria: "Manutenção",
    preco: 95,
    imagem:
      "https://images.unsplash.com/photo-1563090728-6f7cdbfb4d72?auto=format&fit=crop&w=800&q=80",
    descricao: "Ferramentas essenciais para sua moto.",
  },
];

const categorias = [
  "Todos",
  "Capacetes",
  "Vestuário",
  "Acessórios",
  "Manutenção",
];

const estilos = ["Todos", "Esportivo", "Street", "Touring"];

const certificacoesDisponiveis = ["ECE", "DOT", "Snell"];

const formasPagamento = [
  { valor: "pix", nome: "Pix", descricao: "Pagamento instantâneo." },
  {
    valor: "credito",
    nome: "Cartão de crédito",
    descricao: "À vista ou parcelado, conforme as condições da loja.",
  },
  {
    valor: "debito",
    nome: "Cartão de débito",
    descricao: "Pagamento à vista.",
  },
  {
    valor: "boleto",
    nome: "Boleto bancário",
    descricao: "Pagamento sujeito à compensação.",
  },
];

const formatarPreco = (valor) =>
  valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

const normalizar = (texto) =>
  texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

function VisualizadorProduto({ produto }) {
  const frames = produto.imagens360 || [];
  const [frameAtual, setFrameAtual] = useState(0);
  const [arrastando, setArrastando] = useState(false);
  const ultimaPosicao = useRef(null);
  const acumulado = useRef(0);

  const mover = (posicaoX) => {
    if (!arrastando || frames.length < 2) return;

    if (ultimaPosicao.current === null) {
      ultimaPosicao.current = posicaoX;
      return;
    }

    acumulado.current += posicaoX - ultimaPosicao.current;
    ultimaPosicao.current = posicaoX;

    const deslocamento = Math.trunc(acumulado.current / 8);

    if (deslocamento !== 0) {
      setFrameAtual(
        (atual) =>
          (atual - deslocamento + frames.length * 10) % frames.length
      );
      acumulado.current = 0;
    }
  };

  const encerrarArraste = () => {
    setArrastando(false);
    ultimaPosicao.current = null;
    acumulado.current = 0;
  };

  const imagemAtual = frames.length > 1
    ? frames[frameAtual]
    : produto.imagem;

  return (
    <div
      className={`boutique-product-image ${frames.length > 1 ? "has-360" : ""}`}
      onPointerDown={(evento) => {
        if (frames.length < 2) return;
        setArrastando(true);
        ultimaPosicao.current = evento.clientX;
        evento.currentTarget.setPointerCapture(evento.pointerId);
      }}
      onPointerMove={(evento) => mover(evento.clientX)}
      onPointerUp={encerrarArraste}
      onPointerCancel={encerrarArraste}
      onLostPointerCapture={encerrarArraste}
      title={
        frames.length > 1
          ? "Arraste para girar o capacete"
          : "Imagem ilustrativa do produto"
      }
    >
      <img
        src={imagemAtual}
        alt={produto.nome}
        loading="lazy"
        draggable="false"
        onError={(evento) => {
          evento.currentTarget.style.visibility = "hidden";
        }}
      />

      {frames.length > 1 && (
        <span className="boutique-360-label">
          ↔ Arraste para girar 360°
        </span>
      )}
    </div>
  );
}

export default function Boutique() {
  const produtos = [...capacetes, ...outrosProdutos];

  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] =
    useState("Todos");
  const [estiloSelecionado, setEstiloSelecionado] = useState("Todos");
  const [certificacaoSelecionada, setCertificacaoSelecionada] =
    useState("Todas");
  const [tamanhosSelecionados, setTamanhosSelecionados] = useState({});
  const [guiaAberto, setGuiaAberto] = useState(false);
  const [carrinho, setCarrinho] = useState([]);
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [pagamento, setPagamento] = useState("");
  const [pedidoFinalizado, setPedidoFinalizado] = useState(false);

  const produtosFiltrados = produtos.filter((produto) => {
    const correspondeBusca = normalizar(
      `${produto.nome} ${produto.descricao}`
    ).includes(normalizar(busca));

    const correspondeCategoria =
      categoriaSelecionada === "Todos" ||
      produto.categoria === categoriaSelecionada;

    const correspondeEstilo =
      categoriaSelecionada !== "Capacetes" ||
      estiloSelecionado === "Todos" ||
      produto.estilo === estiloSelecionado;

    const correspondeCertificacao =
      categoriaSelecionada !== "Capacetes" ||
      certificacaoSelecionada === "Todas" ||
      (produto.certificacoes || []).includes(certificacaoSelecionada);

    return (
      correspondeBusca &&
      correspondeCategoria &&
      correspondeEstilo &&
      correspondeCertificacao
    );
  });

  const adicionarAoCarrinho = (produto) => {
    const tamanho = produto.categoria === "Capacetes"
      ? tamanhosSelecionados[produto.id]
      : "";

    if (produto.categoria === "Capacetes" && !tamanho) {
      window.alert("Selecione o tamanho do capacete antes de adicionar ao carrinho.");
      return;
    }

    const chave = `${produto.id}-${tamanho || "unico"}`;

    setCarrinho((atual) => {
      const existente = atual.find((item) => item.chave === chave);

      if (existente) {
        return atual.map((item) =>
          item.chave === chave
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }

      return [
        ...atual,
        { ...produto, tamanho, chave, quantidade: 1 },
      ];
    });

    setPedidoFinalizado(false);
  };

  const alterarQuantidade = (chave, variacao) => {
    setCarrinho((atual) =>
      atual
        .map((item) =>
          item.chave === chave
            ? { ...item, quantidade: item.quantidade + variacao }
            : item
        )
        .filter((item) => item.quantidade > 0)
    );
    setPedidoFinalizado(false);
  };

  const removerDoCarrinho = (chave) => {
    setCarrinho((atual) =>
      atual.filter((item) => item.chave !== chave)
    );
    setPedidoFinalizado(false);
  };

  const totalItens = carrinho.reduce(
    (total, item) => total + item.quantidade,
    0
  );

  const valorTotal = carrinho.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  const finalizarCompra = () => {
    if (carrinho.length === 0 || !pagamento) return;
    setPedidoFinalizado(true);
  };

  return (
    <main className="boutique">
      <style>{`
        .boutique {
          min-height: 100vh;
          padding: 28px 20px 40px;
          background: #123b66;
          color: #183653;
          font-family: "Segoe UI", Roboto, Arial, sans-serif;
          -webkit-font-smoothing: antialiased;
          box-sizing: border-box;
        }

        .boutique * { box-sizing: border-box; }

        .boutique-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .boutique-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 28px;
          margin-bottom: 28px;
          border-radius: 12px;
          background: linear-gradient(120deg, #081d36, #0b2545 55%, #164675);
          color: #fff;
        }

        .boutique-header h1 {
          margin: 0 0 10px;
          font-size: clamp(25px, 4vw, 36px);
        }

        .boutique-header p {
          margin: 0;
          line-height: 1.6;
          color: #e2e8f0;
        }

        .boutique-cart-toggle {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 12px 16px;
          border: 1px solid #76a9df;
          border-radius: 9px;
          background: #245b91;
          color: #fff;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
        }

        .boutique-cart-toggle:hover { background: #3272ad; }
        .boutique-cart-toggle svg { width: 23px; height: 23px; }

        .boutique-cart-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 23px;
          height: 23px;
          padding: 0 5px;
          border-radius: 50%;
          background: #fff;
          color: #123b66;
          font-size: 12px;
          font-weight: 800;
        }

        .boutique-cart {
          margin-bottom: 28px;
          padding: 24px;
          border: 1px solid #cbd7e5;
          border-radius: 12px;
          background: #e9edf3;
          box-shadow: 0 5px 18px #0418301f;
        }

        .boutique-cart h2, .boutique-payment h3 { color: #17395d; }
        .boutique-cart-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid #cbd7e5;
        }

        .boutique-cart-item-info {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .boutique-cart-item-info img {
          width: 76px;
          height: 76px;
          flex-shrink: 0;
          object-fit: contain;
          border-radius: 8px;
          background: #fff;
        }

        .boutique-cart-item-info strong { color: #17395d; }
        .boutique-cart-item-info p {
          margin: 6px 0 0;
          color: #60758b;
          font-size: 14px;
        }

        .boutique-cart-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          flex-wrap: wrap;
          gap: 8px;
        }

        .boutique-quantity-button {
          width: 32px;
          height: 32px;
          border: 1px solid #b8c9dc;
          border-radius: 6px;
          background: #fff;
          color: #123b66;
          font-size: 18px;
          cursor: pointer;
        }

        .boutique-remove {
          padding: 8px 10px;
          border: 1px solid #b42318;
          border-radius: 6px;
          background: #fff;
          color: #b42318;
          cursor: pointer;
        }

        .boutique-cart-total {
          margin: 20px 0;
          color: #123b66;
          font-size: 22px;
          font-weight: 800;
          text-align: right;
        }

        .boutique-payment {
          margin-top: 26px;
          padding-top: 22px;
          border-top: 1px solid #cbd7e5;
        }

        .boutique-payment-options {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin: 16px 0 20px;
        }

        .boutique-payment-option {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 16px;
          border: 1px solid #cbd7e5;
          border-radius: 9px;
          background: #fff;
          cursor: pointer;
        }

        .boutique-payment-option.selected {
          border: 2px solid #245b91;
          background: #f5f9ff;
        }

        .boutique-payment-option input {
          margin-top: 4px;
          accent-color: #123b66;
        }

        .boutique-payment-option strong {
          display: block;
          margin-bottom: 5px;
          color: #17395d;
        }

        .boutique-payment-option small {
          display: block;
          color: #60758b;
          line-height: 1.5;
        }

        .boutique-checkout-button {
          width: 100%;
          padding: 14px 18px;
          border: none;
          border-radius: 8px;
          background: #0b2545;
          color: #fff;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
        }

        .boutique-checkout-button:hover { background: #245b91; }
        .boutique-checkout-button:disabled {
          opacity: .5;
          cursor: not-allowed;
        }

        .boutique-success {
          margin-top: 16px;
          padding: 14px;
          border: 1px solid #9cc9ac;
          border-radius: 8px;
          background: #edf9f0;
          color: #205b32;
          line-height: 1.5;
        }

        .boutique-toolbar { margin-bottom: 20px; }

        .boutique-search {
          width: 100%;
          padding: 13px 15px;
          border: 1px solid #cbd7e5;
          border-radius: 8px;
          background: #fff;
          color: #183653;
          font-size: 16px;
        }

        .boutique-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .boutique-category {
          padding: 10px 14px;
          border: 1px solid #cbd7e5;
          border-radius: 8px;
          background: #e9edf3;
          color: #334155;
          cursor: pointer;
        }

        .boutique-category.active {
          border-color: #0b2545;
          background: #0b2545;
          color: #fff;
        }

        .boutique-helmet-tools {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin: 0 0 26px;
          padding: 18px;
          border: 1px solid #cbd7e5;
          border-radius: 10px;
          background: #e9edf3;
        }

        .boutique-helmet-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          flex: 1;
        }

        .boutique-filter-label {
          display: flex;
          flex-direction: column;
          gap: 6px;
          color: #17395d;
          font-size: 13px;
          font-weight: 700;
        }

        .boutique-filter-select {
          min-width: 150px;
          padding: 10px;
          border: 1px solid #b8c9dc;
          border-radius: 7px;
          background: #fff;
          color: #183653;
          font-size: 14px;
        }

        .boutique-guide-button {
          padding: 11px 14px;
          border: 1px solid #245b91;
          border-radius: 7px;
          background: #fff;
          color: #123b66;
          font-weight: 700;
          cursor: pointer;
        }

        .boutique-guide {
          margin-bottom: 24px;
          padding: 22px;
          border: 1px solid #b8c9dc;
          border-radius: 10px;
          background: #f7faff;
          color: #334155;
          line-height: 1.65;
        }

        .boutique-guide h3 { margin-top: 0; color: #123b66; }

        .boutique-guide table {
          width: 100%;
          border-collapse: collapse;
          margin: 14px 0;
        }

        .boutique-guide th, .boutique-guide td {
          padding: 10px;
          border: 1px solid #cbd7e5;
          text-align: left;
        }

        .boutique-guide th {
          background: #e9edf3;
          color: #123b66;
        }

        .boutique-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .boutique-product {
          display: flex;
          min-width: 0;
          flex-direction: column;
          overflow: hidden;
          border: 1px solid #cbd7e5;
          border-radius: 12px;
          background: #e9edf3;
          box-shadow: 0 5px 18px #0418301f;
        }

        .boutique-product-image {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: #123b66;
          padding: 12px;
        }

        .boutique-product-image img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center;
          user-select: none;
        }

        .boutique-product-image.has-360 { cursor: ew-resize; }
        .boutique-product-image.has-360 img { pointer-events: none; }

        .boutique-360-label {
          position: absolute;
          right: 8px;
          bottom: 8px;
          padding: 6px 9px;
          border-radius: 5px;
          background: #081d36e8;
          color: #fff;
          font-size: 11px;
        }

        .boutique-product-content {
          display: flex;
          flex: 1;
          flex-direction: column;
          padding: 20px;
        }

        .boutique-product-category {
          margin-bottom: 8px;
          color: #245b91;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .boutique-product h2 {
          margin: 0 0 10px;
          color: #17395d;
          font-size: 19px;
        }

        .boutique-product-description {
          flex: 1;
          margin: 0 0 14px;
          color: #60758b;
          font-size: 14px;
          line-height: 1.5;
        }

        .boutique-certifications {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin: 0 0 14px;
        }

        .boutique-certification {
          padding: 5px 8px;
          border: 1px solid #b8c9dc;
          border-radius: 5px;
          background: #fff;
          color: #123b66;
          font-size: 11px;
          font-weight: 800;
        }

        .boutique-size-label {
          display: block;
          margin-bottom: 7px;
          color: #17395d;
          font-size: 13px;
          font-weight: 700;
        }

        .boutique-size-select {
          width: 100%;
          margin-bottom: 14px;
          padding: 10px;
          border: 1px solid #b8c9dc;
          border-radius: 7px;
          background: #fff;
          color: #183653;
        }

        .boutique-product-price {
          margin-bottom: 16px;
          color: #123b66;
          font-size: 23px;
          font-weight: bold;
        }

        .boutique-button {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #0b2545;
          border-radius: 7px;
          background: #0b2545;
          color: #fff;
          font-size: 15px;
          font-weight: bold;
          cursor: pointer;
        }

        .boutique-button:hover { background: #245b91; }

        .boutique-empty {
          grid-column: 1 / -1;
          padding: 24px 10px;
          color: #e9edf3;
          text-align: center;
        }

        @media (max-width: 900px) {
          .boutique-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (max-width: 600px) {
          .boutique { padding: 18px 12px 30px; }
          .boutique-header {
            align-items: flex-start;
            flex-direction: column;
            padding: 22px 18px;
          }
          .boutique-cart-toggle { align-self: flex-end; }
          .boutique-grid { grid-template-columns: 1fr; }
          .boutique-payment-options { grid-template-columns: 1fr; }
          .boutique-cart { padding: 16px; }
          .boutique-cart-item {
            align-items: flex-start;
            flex-direction: column;
          }
          .boutique-cart-actions { justify-content: flex-start; }
          .boutique-product-image { height: 240px; }
          .boutique-helmet-tools { align-items: stretch; }
          .boutique-helmet-filters { flex-direction: column; }
          .boutique-filter-select { width: 100%; }
          .boutique-guide { overflow-x: auto; }
        }
      `}</style>

      <div className="boutique-container">
        <header className="boutique-header">
          <div>
            <h1>MotoImports Boutique</h1>
            <p>
              Equipamentos, acessórios e proteção para sua motocicleta.
            </p>
          </div>

          <button
            type="button"
            className="boutique-cart-toggle"
            onClick={() => setCarrinhoAberto((aberto) => !aberto)}
            aria-expanded={carrinhoAberto}
            aria-label={`Abrir carrinho com ${totalItens} itens`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Carrinho
            <span className="boutique-cart-badge">{totalItens}</span>
          </button>
        </header>

        {carrinhoAberto && (
          <section className="boutique-cart" aria-label="Carrinho de compras">
            <h2>Meu carrinho ({totalItens} itens)</h2>

            {carrinho.length === 0 ? (
              <p className="boutique-empty" style={{ color: "#60758b" }}>
                Seu carrinho está vazio. Adicione um produto para começar.
              </p>
            ) : (
              <>
                {carrinho.map((item) => (
                  <div className="boutique-cart-item" key={item.chave}>
                    <div className="boutique-cart-item-info">
                      <img src={item.imagem} alt={item.nome} />
                      <div>
                        <strong>{item.nome}</strong>
                        {item.tamanho && <p>Tamanho: {item.tamanho}</p>}
                        <p>{formatarPreco(item.preco)} por unidade</p>
                        <p>
                          Subtotal:{" "}
                          {formatarPreco(item.preco * item.quantidade)}
                        </p>
                      </div>
                    </div>

                    <div className="boutique-cart-actions">
                      <button
                        type="button"
                        className="boutique-quantity-button"
                        aria-label={`Diminuir quantidade de ${item.nome}`}
                        onClick={() => alterarQuantidade(item.chave, -1)}
                      >
                        −
                      </button>

                      <strong>{item.quantidade}</strong>

                      <button
                        type="button"
                        className="boutique-quantity-button"
                        aria-label={`Aumentar quantidade de ${item.nome}`}
                        onClick={() => alterarQuantidade(item.chave, 1)}
                      >
                        +
                      </button>

                      <button
                        type="button"
                        className="boutique-remove"
                        onClick={() => removerDoCarrinho(item.chave)}
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}

                <div className="boutique-cart-total">
                  Total: {formatarPreco(valorTotal)}
                </div>

                <div className="boutique-payment">
                  <h3>Escolha a forma de pagamento</h3>

                  <div className="boutique-payment-options">
                    {formasPagamento.map((forma) => (
                      <label
                        key={forma.valor}
                        className={
                          pagamento === forma.valor
                            ? "boutique-payment-option selected"
                            : "boutique-payment-option"
                        }
                      >
                        <input
                          type="radio"
                          name="formaPagamento"
                          value={forma.valor}
                          checked={pagamento === forma.valor}
                          onChange={() => {
                            setPagamento(forma.valor);
                            setPedidoFinalizado(false);
                          }}
                        />
                        <span>
                          <strong>{forma.nome}</strong>
                          <small>{forma.descricao}</small>
                        </span>
                      </label>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="boutique-checkout-button"
                    disabled={!pagamento || carrinho.length === 0}
                    onClick={finalizarCompra}
                  >
                    Confirmar pedido
                  </button>

                  {pedidoFinalizado && (
                    <div className="boutique-success" role="status">
                      Pedido de demonstração confirmado! Forma de pagamento:
                      {" "}
                      <strong>
                        {
                          formasPagamento.find(
                            (forma) => forma.valor === pagamento
                          )?.nome
                        }
                      </strong>
                      . Total: {formatarPreco(valorTotal)}. Nenhum pagamento
                      real foi realizado.
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        <div className="boutique-toolbar">
          <input
            className="boutique-search"
            type="search"
            placeholder="Buscar produto..."
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            aria-label="Buscar produtos"
          />
        </div>

        <nav className="boutique-categories" aria-label="Categorias de produtos">
          {categorias.map((categoria) => (
            <button
              key={categoria}
              type="button"
              className={
                categoriaSelecionada === categoria
                  ? "boutique-category active"
                  : "boutique-category"
              }
              onClick={() => {
                setCategoriaSelecionada(categoria);
                setEstiloSelecionado("Todos");
                setCertificacaoSelecionada("Todas");
              }}
            >
              {categoria}
            </button>
          ))}
        </nav>

        {categoriaSelecionada === "Capacetes" && (
          <>
            <section className="boutique-helmet-tools">
              <div className="boutique-helmet-filters">
                <label className="boutique-filter-label">
                  Estilo
                  <select
                    className="boutique-filter-select"
                    value={estiloSelecionado}
                    onChange={(evento) =>
                      setEstiloSelecionado(evento.target.value)
                    }
                  >
                    {estilos.map((estilo) => (
                      <option key={estilo} value={estilo}>
                        {estilo}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="boutique-filter-label">
                  Certificação
                  <select
                    className="boutique-filter-select"
                    value={certificacaoSelecionada}
                    onChange={(evento) =>
                      setCertificacaoSelecionada(evento.target.value)
                    }
                  >
                    <option value="Todas">Todas</option>
                    {certificacoesDisponiveis.map((certificacao) => (
                      <option key={certificacao} value={certificacao}>
                        {certificacao}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <button
                type="button"
                className="boutique-guide-button"
                onClick={() => setGuiaAberto((aberto) => !aberto)}
                aria-expanded={guiaAberto}
              >
                {guiaAberto ? "Fechar guia de tamanhos" : "Guia de tamanhos"}
              </button>
            </section>

            {guiaAberto && (
              <section className="boutique-guide">
                <h3>Como escolher o tamanho do capacete</h3>
                <p>
                  Use uma fita métrica ao redor da cabeça, aproximadamente
                  2 cm acima das sobrancelhas e logo acima das orelhas.
                  Mantenha a fita nivelada e anote a circunferência em
                  centímetros.
                </p>

                <table>
                  <thead>
                    <tr>
                      <th>Tamanho</th>
                      <th>Circunferência aproximada</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>PP</td><td>53–54 cm</td></tr>
                    <tr><td>P</td><td>55–56 cm</td></tr>
                    <tr><td>M</td><td>57–58 cm</td></tr>
                    <tr><td>G</td><td>59–60 cm</td></tr>
                    <tr><td>GG</td><td>61–62 cm</td></tr>
                  </tbody>
                </table>

                <p>
                  <strong>Importante:</strong> esta tabela é apenas uma
                  referência. As medidas variam por fabricante e modelo.
                  Consulte a tabela oficial da marca e experimente o capacete
                  antes de pilotar. Ele deve ficar firme, sem pontos de
                  pressão dolorosos.
                </p>
              </section>
            )}
          </>
        )}

        <section className="boutique-grid" aria-label="Lista de produtos">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map((produto) => (
              <article className="boutique-product" key={produto.id}>
                {produto.categoria === "Capacetes" ? (
                  <VisualizadorProduto produto={produto} />
                ) : (
                  <div className="boutique-product-image">
                    <img
                      src={produto.imagem}
                      alt={produto.nome}
                      loading="lazy"
                      onError={(evento) => {
                        evento.currentTarget.style.visibility = "hidden";
                      }}
                    />
                  </div>
                )}

                <div className="boutique-product-content">
                  <span className="boutique-product-category">
                    {produto.categoria}
                    {produto.estilo ? ` · ${produto.estilo}` : ""}
                  </span>

                  <h2>{produto.nome}</h2>

                  <p className="boutique-product-description">
                    {produto.descricao}
                  </p>

                  {produto.certificacoes && (
                    <div
                      className="boutique-certifications"
                      aria-label="Certificações cadastradas para o modelo"
                    >
                      {produto.certificacoes.map((certificacao) => (
                        <span
                          className="boutique-certification"
                          key={certificacao}
                        >
                          {certificacao}
                        </span>
                      ))}
                    </div>
                  )}

                  {produto.tamanhos && (
                    <label className="boutique-size-label">
                      Escolha o tamanho
                      <select
                        className="boutique-size-select"
                        value={tamanhosSelecionados[produto.id] || ""}
                        onChange={(evento) =>
                          setTamanhosSelecionados((atual) => ({
                            ...atual,
                            [produto.id]: evento.target.value,
                          }))
                        }
                      >
                        <option value="">Selecione um tamanho</option>
                        {produto.tamanhos.map((tamanho) => (
                          <option key={tamanho} value={tamanho}>
                            {tamanho}
                          </option>
                        ))}
                      </select>
                    </label>
                  )}

                  <div className="boutique-product-price">
                    {formatarPreco(produto.preco)}
                  </div>

                  <button
                    type="button"
                    className="boutique-button"
                    onClick={() => adicionarAoCarrinho(produto)}
                  >
                    Adicionar ao carrinho
                  </button>
                </div>
              </article>
            ))
          ) : (
            <p className="boutique-empty">
              Nenhum produto encontrado com esses filtros.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
