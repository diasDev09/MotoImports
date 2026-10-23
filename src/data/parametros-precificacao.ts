import type { ParametrosPrecificacao } from '../domain/pricing.ts'

// RN-01: as alíquotas ficam aqui, em configuração, e NUNCA fixas dentro das funções.
// ATENÇÃO: valores PROVISÓRIOS. Confirmar com o cliente (risco R2 do roadmap).
export const PARAMETROS_PRECIFICACAO: ParametrosPrecificacao = {
  freteInternacional: 4500, // R$ por moto
  despachoAduaneiro: 2500, // R$ por moto
  aliquotaImpostoImportacao: 0.35, // 35% sobre (base + frete)
  aliquotaImpostosFiscais: 0.25, // 25% sobre (base + frete + imposto de importação)
}