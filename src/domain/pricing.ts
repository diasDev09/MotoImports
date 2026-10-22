export interface ParametrosPrecificacao {
    freteInternacional: number
    despachoAduaneiro: number
    aliquotaImpostoImportacao: number
    aliquotaImpostosFiscais: number
}

export interface ComposicaoPreco {
    base: number
    frete: number
    despacho: number
    impostoImportacao: number
    impostosFiscais: number
    total: number
}

// arredonda para centavos e evita 0.1 + 0.2 = 0.30000000000000004
function arredondar(valor: number): number {
    return Math.round((valor + Number.EPSILON) * 100) / 100
}

function validarNaoNegativo(nome: string, valor: number): void {
    if (!Number.isFinite(valor) || valor < 0) {
        throw new RangeError(`${nome} deve ser um número maior ou igual a zero`)
    }
}

export function calcularComposicaoPreco(
    precoBase: number,
    parametros: ParametrosPrecificacao,
): ComposicaoPreco {
    validarNaoNegativo('precoBase', precoBase)
    validarNaoNegativo('freteInternacional', parametros.freteInternacional)
    validarNaoNegativo('despachoAduaneiro', parametros.despachoAduaneiro)
    validarNaoNegativo('aliquotaImpostoImportacao', parametros.aliquotaImpostoImportacao)
    validarNaoNegativo('aliquotaImpostosFiscais', parametros.aliquotaImpostosFiscais)

    const base = arredondar(precoBase)
    const frete = arredondar(parametros.freteInternacional)
    const despacho = arredondar(parametros.despachoAduaneiro)

    // imposto de importação incide sobre base + frete
    const impostoImportacao = arredondar((base + frete) * parametros.aliquotaImpostoImportacao)
    // impostos fiscais incidem sobre tudo o que veio antes
    const impostosFiscais = arredondar(
        (base + frete + impostoImportacao) * parametros.aliquotaImpostosFiscais,
    )

    const total = arredondar(base + frete + despacho + impostoImportacao + impostosFiscais)
    return { base, frete, despacho, impostoImportacao, impostosFiscais, total }
}

export function calcularPrecoFinal(precoBase: number, parametros: ParametrosPrecificacao): number {
    return calcularComposicaoPreco(precoBase, parametros).total
}