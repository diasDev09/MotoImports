/**
 * MOTOIMPORTS — Catálogo de Acessórios Técnicos Oficiais [RF-11]
 * Alinhado à ERS: "Catálogo complementar contendo escapamentos esportivos,
 * bauletos de alumínio, protetores de motor e suportes com opção de inclusão
 * no financiamento da moto."
 */

import type { Categoria } from './motos.ts'

export interface AcessorioTecnico {
    id: string
    nome: string
    categoria: string
    preco: number
    descricao: string
    imagem: string
    compatibilidade: readonly Categoria[]
    garantiaMeses: number
}

export const ACESSORIOS_TECNICOS: readonly AcessorioTecnico[] = [
    {
        id: 'ac-escapamento-akrapovic',
        nome: 'Escapamento Akrapovič Titanium Full System',
        categoria: 'Performance',
        preco: 8900,
        descricao: 'Linha completa em titânio de alta resistência, redução de 4,2 kg e ganho de torque em médias rotações.',
        imagem: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
        compatibilidade: ['Sport', 'Naked'],
        garantiaMeses: 12,
    },
    {
        id: 'ac-bauletos-touratech',
        nome: 'Par de Bauletos Laterais Touratech Zega 45L Alumínio',
        categoria: 'Carga & Viagem',
        preco: 5200,
        descricao: 'Estrutura anodizada à prova d\'água, fecho com trava unificada e suportes reforçados para expedições.',
        imagem: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80',
        compatibilidade: ['Trail/Adventure', 'Custom'],
        garantiaMeses: 24,
    },
    {
        id: 'ac-protetor-motor-tubular',
        nome: 'Protetor de Motor e Carenagem Tubular Reforçado',
        categoria: 'Proteção',
        preco: 2400,
        descricao: 'Tubo de aço de 25mm com pintura eletrostática microtexturizada e pontos de fixação estruturais.',
        imagem: 'https://images.unsplash.com/photo-1513089722837-f10c05960a52?auto=format&fit=crop&w=600&q=80',
        compatibilidade: ['Trail/Adventure', 'Naked', 'Custom', 'Sport'],
        garantiaMeses: 12,
    },
    {
        id: 'ac-quickshifter-pro',
        nome: 'Módulo Quickshifter Bidirecional Pro com Auto-Blipper',
        categoria: 'Eletrônica',
        preco: 3100,
        descricao: 'Trocas de marcha ascendentes e descendentes sem embreagem com calibração digital via sensor piezoelétrico.',
        imagem: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=600&q=80',
        compatibilidade: ['Sport', 'Naked'],
        garantiaMeses: 12,
    },
    {
        id: 'ac-suporte-gps-inducao',
        nome: 'Suporte de Navegação GPS/Smartphone com Carga por Indução',
        categoria: 'Conectividade',
        preco: 890,
        descricao: 'Usinado em alumínio aeronáutico CNC, sistema antivibração com amortecimento de 4 pontos e carregador Qi 15W.',
        imagem: 'https://images.unsplash.com/photo-1525011268546-bf319fb01226?auto=format&fit=crop&w=600&q=80',
        compatibilidade: ['Sport', 'Naked', 'Trail/Adventure', 'Custom'],
        garantiaMeses: 6,
    },
    {
        id: 'ac-slider-carbono',
        nome: 'Kit Sliders de Chassi e Eixo Dianteiro em Fibra de Carbono',
        categoria: 'Proteção',
        preco: 1650,
        descricao: 'Ponteiras em termopolímero de alta absorção com capa de fibra de carbono trançado real.',
        imagem: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=600&q=80',
        compatibilidade: ['Sport', 'Naked'],
        garantiaMeses: 12,
    },
]