# AutoFlow

Página de vendas estática para o AutoFlow, um treinamento de automações de vendas com IA para redes sociais.

## Visão Geral

O site foi construído como uma landing page responsiva, com foco em performance, experiência visual premium e deploy simples em hospedagens estáticas como Vercel, Hostinger e similares.

## Tecnologias

- HTML5
- CSS3
- JavaScript vanilla
- GSAP
- ScrollTrigger
- ScrollSmoother
- SplitText

## Estrutura

- `index.html`: página principal
- `politica-de-privacidade.html`: página legal de privacidade
- `termos-de-uso.html`: página legal de termos
- `assets/css/styles.css`: estilos principais
- `assets/js/main.js`: interações, preloader, GSAP e animações
- `assets/images`: imagens, logos, ícones e favicon
- `vercel.json`: regras de cache para deploy na Vercel

## Cache e Versionamento

Os arquivos críticos são carregados com query string de release, por exemplo:

```html
assets/css/styles.css?v=20260620-01
assets/js/main.js?v=20260620-01
```

Isso força navegadores e hospedagens a buscarem a versão mais recente quando uma nova publicação é feita. O HTML também usa headers `no-store` na Vercel, enquanto os assets versionados podem ficar em cache longo com segurança.

## Deploy

Este projeto não precisa de build. Basta publicar a raiz do projeto como site estático.

Na Vercel, o deploy pode ser feito diretamente pelo GitHub ou pela CLI/conector da Vercel.
