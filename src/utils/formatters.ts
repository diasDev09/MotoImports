// Use sempre estas funções para mostrar valores, assim o site inteiro fica igual.

export function formatarPreco(valor: number): string {
    return valor.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
    })
}

// Para produtos com centavos (boutique): R$ 599,90. O formatarPreco acima arredondaria para R$ 600.
export function formatarPrecoComCentavos(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarCilindrada(cc: number): string {
    return `${cc.toLocaleString('pt-BR')} cc`
}

// Link pronto para abrir conversa no WhatsApp com mensagem preenchida.
// numero: apenas dígitos com DDI e DDD, ex: 5581999999999
export function linkWhatsApp(numero: string, mensagem: string): string {
    return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}