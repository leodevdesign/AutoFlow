# AutoFlow

![Static Site](https://img.shields.io/badge/site-static-black?style=for-the-badge)
![GSAP](https://img.shields.io/badge/animations-GSAP-88CE02?style=for-the-badge)
![Vercel](https://img.shields.io/badge/deploy-Vercel-000000?style=for-the-badge)
![Status](https://img.shields.io/badge/status-production-FF6A00?style=for-the-badge)

Página de vendas premium para o **AutoFlow**, um treinamento de automações de vendas com IA para redes sociais.

## Preview

Produção: [autoflow-leonardos-projects-68d2130e.vercel.app](https://autoflow-leonardos-projects-68d2130e.vercel.app)

## Sobre o Projeto

O AutoFlow é uma landing page estática, responsiva e otimizada para apresentar uma oferta digital com visual escuro, identidade laranja, preloader customizado, animações de entrada e páginas legais no rodapé.

O projeto foi pensado para deploy simples em hospedagens estáticas como Vercel, Hostinger e GitHub-integrated hosting.

## Destaques

- Preloader customizado com logo, porcentagem e círculo de progresso.
- Favicon e imagem de preloader próprios.
- Animações de entrada com GSAP.
- SplitText na Hero.
- Revelações vinculadas ao scroll.
- Rolagem suave com GSAP ScrollSmoother.
- Páginas de Política de Privacidade e Termos de Uso.
- Versionamento de assets para evitar cache antigo em produção.
- Regras de cache para Vercel.

## Tecnologias

| Tecnologia | Uso |
| --- | --- |
| HTML5 | Estrutura das páginas |
| CSS3 | Layout, responsividade e identidade visual |
| JavaScript | Interações da página |
| GSAP | Animações principais |
| ScrollTrigger | Revelações vinculadas ao scroll |
| ScrollSmoother | Rolagem suave |
| SplitText | Animação de texto da Hero |
| Vercel | Deploy e versionamento de produção |

## Estrutura

```text
.
├── index.html
├── politica-de-privacidade.html
├── termos-de-uso.html
├── vercel.json
├── jsconfig.json
└── assets
    ├── css
    ├── fonts
    ├── images
    └── js
```

## Cache e Versionamento

Os arquivos críticos usam uma versão de release:

```html
assets/css/styles.css?v=20260620-01
assets/js/main.js?v=20260620-01
assets/images/logos/preloader.webp?v=20260620-01
```

Isso evita que navegadores, CDN ou hospedagens mantenham versões antigas do preloader, CSS ou JavaScript depois de uma atualização.

Na Vercel, o HTML é entregue com revalidação imediata e os assets versionados podem usar cache longo com segurança.

## Deploy

Este projeto não precisa de build. A raiz do repositório pode ser publicada diretamente.

```bash
vercel deploy --prod
```

## Créditos

Projeto desenvolvido para a marca AutoFlow com apoio da Next Automatik.
