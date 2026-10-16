// Use sempre estas funções para mostrar valores, assim o site inteiro fica igual.

export function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })
}

export function formatarCilindrada(cc) {
  return `${cc.toLocaleString('pt-BR')} cc`
}

// Link pronto para abrir conversa no WhatsApp com mensagem preenchida.
// numero: apenas dígitos com DDI e DDD, ex: 5581999999999
export function linkWhatsApp(numero, mensagem) {
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
}