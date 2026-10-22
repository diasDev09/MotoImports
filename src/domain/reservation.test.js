import { describe, it, expect } from 'vitest'
import {
  LOJAS_RETIRADA,
  estimarPrazoRetirada,
  gerarCodigoVoucher,
  validarDadosCheckout,
  criarVoucherReserva,
  formatarMensagemWhatsAppVoucher,
} from './reservation.js'

describe('Módulo de Checkout & Reserva [RF-08, RN-02, RN-05, RN-06]', () => {
  const motoTeste = {
    id: 'ducati-panigale-v2',
    nome: 'Panigale V2',
    marca: 'Ducati',
    categoria: 'Sport',
    cilindrada: 955,
    preco: 169900,
    estoque: 'pronta-entrega',
  }

  const clienteTeste = {
    nome: 'Carlos Santos',
    telefone: '11987654321',
    email: 'carlos.santos@exemplo.com.br',
    cidade: 'São Paulo - SP',
  }

  describe('estimarPrazoRetirada [RN-02]', () => {
    it('deve estimar 48h úteis para pronta-entrega', () => {
      const res = estimarPrazoRetirada('pronta-entrega')
      expect(res.prazoTexto).toContain('48 horas')
      expect(res.diasUteisMax).toBe(2)
    })

    it('deve estimar 15 a 30 dias para em-trânsito', () => {
      const res = estimarPrazoRetirada('em-transito')
      expect(res.prazoTexto).toContain('15 a 30 dias')
      expect(res.diasUteisMax).toBe(30)
    })

    it('deve estimar 45 a 60 dias para sob-pedido', () => {
      const res = estimarPrazoRetirada('sob-pedido')
      expect(res.prazoTexto).toContain('45 a 60 dias')
      expect(res.diasUteisMax).toBe(60)
    })
  })

  describe('gerarCodigoVoucher', () => {
    it('deve gerar código único no formato MI-[ANO]-[UF]-[HASH]', () => {
      const codigo = gerarCodigoVoucher('SP')
      const anoAtual = new Date().getFullYear().toString()
      expect(codigo).toMatch(new RegExp(`^MI-${anoAtual}-SP-[A-Z0-9]{5}$`))
    })
  })

  describe('validarDadosCheckout [RF-01, RNF-05]', () => {
    it('deve validar com sucesso quando todos os dados obrigatórios e consentimento LGPD forem preenchidos', () => {
      const res = validarDadosCheckout({
        cliente: clienteTeste,
        lojaId: 'sp-jardins',
        consentimentoLGPD: true,
      })
      expect(res.valido).toBe(true)
      expect(Object.keys(res.erros).length).toBe(0)
    })

    it('deve rejeitar e apontar erro quando faltar consentimento LGPD [RNF-05]', () => {
      const res = validarDadosCheckout({
        cliente: clienteTeste,
        lojaId: 'sp-jardins',
        consentimentoLGPD: false,
      })
      expect(res.valido).toBe(false)
      expect(res.erros.consentimentoLGPD).toBeDefined()
    })

    it('deve rejeitar e-mail inválido e telefone incompleto', () => {
      const res = validarDadosCheckout({
        cliente: {
          nome: 'Ca',
          telefone: '123',
          email: 'invalido',
          cidade: '',
        },
        lojaId: '',
        consentimentoLGPD: true,
      })
      expect(res.valido).toBe(false)
      expect(res.erros.nome).toBeDefined()
      expect(res.erros.telefone).toBeDefined()
      expect(res.erros.email).toBeDefined()
      expect(res.erros.cidade).toBeDefined()
      expect(res.erros.lojaId).toBeDefined()
    })
  })

  describe('criarVoucherReserva [RF-08, RN-06]', () => {
    it('deve gerar voucher completo com marca de simulação, validade e dados da loja', () => {
      const voucher = criarVoucherReserva({
        moto: motoTeste,
        acessorios: [{ id: '1', nome: 'Escapamento', preco: 8000 }],
        formaPagamento: 'financiamento',
        cliente: clienteTeste,
        lojaId: 'sp-jardins',
      })

      expect(voucher.codigo).toBeDefined()
      expect(voucher.identificacaoSimulacao).toContain('SIMULAÇÃO OFICIAL')
      expect(voucher.status).toBe('CONFIRMADA_SIMULACAO')
      expect(voucher.retirada.nomeLoja).toContain('Jardins')
      expect(voucher.financeiro.valorTotalGeral).toBe(169900 + 8000)
      expect(voucher.prazoValidadeDias).toBe(7)
    })
  })

  describe('formatarMensagemWhatsAppVoucher [RF-06]', () => {
    it('deve formatar mensagem detalhada pronta para wa.me com código e loja', () => {
      const voucher = criarVoucherReserva({
        moto: motoTeste,
        formaPagamento: 'a_vista',
        cliente: clienteTeste,
        lojaId: 'sp-jardins',
      })

      const msg = formatarMensagemWhatsAppVoucher(voucher)
      expect(msg).toContain(voucher.codigo)
      expect(msg).toContain('Panigale V2')
      expect(msg).toContain('7 dias corridos')
    })
  })
})
