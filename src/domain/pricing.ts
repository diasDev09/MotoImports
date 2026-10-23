// RN-01 / RF-02: preço final "all-inclusive" e sua composição.
// Funções puras, sem React e sem acesso a dados globais, por isso fáceis de testar.

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

function validarParametros(p: ParametrosPrecificacao): void {
    validarNaoNegativo('freteInternacional', p.freteInternacional)
    validarNaoNegativo('despachoAduaneiro', p.despachoAduaneiro)
    validarNaoNegativo('aliquotaImpostoImportacao', p.aliquotaImpostoImportacao)
    validarNaoNegativo('aliquotaImpostosFiscais', p.aliquotaImpostosFiscais)
}

// Do preço base para o preço final: base + frete + despacho + impostos.
export function calcularComposicaoPreco(
    precoBase: number,
    parametros: ParametrosPrecificacao,
): ComposicaoPreco {
    validarNaoNegativo('precoBase', precoBase)
    validarParametros(parametros)

    const base = arredondar(precoBase)
    const frete = arredondar(parametros.freteInternacional)
    const despacho = arredondar(parametros.despachoAduaneiro)

    // imposto de importação incide sobre o valor aduaneiro (base + frete)
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

// O contrário: o catálogo guarda o preço FINAL (campo `preco` das motos) e esta função
// descobre quanto disso é base, frete, despacho e impostos (detalhamento do RF-02).
// O total devolvido é sempre igual ao preço final recebido; sobras de centavos vão
// para os impostos fiscais, para a soma das partes fechar exatamente.
export function decomporPrecoFinal(
    precoFinal: number,
    parametros: ParametrosPrecificacao,
): ComposicaoPreco {
    validarNaoNegativo('precoFinal', precoFinal)
    validarParametros(parametros)

    const fator = (1 + parametros.aliquotaImpostoImportacao) * (1 + parametros.aliquotaImpostosFiscais)
    const base = arredondar(
        (precoFinal - parametros.despachoAduaneiro) / fator - parametros.freteInternacional,
    )
    if (base < 0) {
        throw new RangeError('precoFinal é menor que os custos fixos (frete e despacho) mais impostos')
    }

    const c = calcularComposicaoPreco(base, parametros)
    const sobra = arredondar(precoFinal - c.total)
    return {
        ...c,
        impostosFiscais: arredondar(c.impostosFiscais + sobra),
        total: arredondar(precoFinal),
    }
}