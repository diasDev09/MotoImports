import type { ParametrosPrecificacao } from '../domain/pricing.ts'

// RN-01: as alíquotas ficam aqui, em configuração.
// ATENÇÃO: valores PROVISÓRIOS. Confirmar com o cliente (risco R2 do roadmap).
export const PARAMETROS_PRECIFICACAO: ParametrosPrecificacao = {
    freteInternacional: 4500,
    despachoAduaneiro: 2500,
    aliquotaImpostoImportacao: 0.35,
    aliquotaImpostosFiscais: 0.25,
}