# 🚀 DevClub - Landing Page Institucional

Página institucional disruptiva desenvolvida para o processo seletivo de Desenvolvedor Full Stack da DevClub. O projeto combina um design moderno em modo escuro com animações fluidas e micro-interações de alto impacto visual para criar uma experiência premium para o usuário.

## Link do Projeto ⬇️
🔗 [https://devclub-concurso.netlify.app](https://devclub-concurso.netlify.app)

## Preview do Projeto ⬇️
https://github.com/user-attachments/assets/d2924215-4b7b-4d95-aa87-0837070db2a1

## 🎯 O Desafio

O objetivo principal era desenvolver uma página institucional para a DevClub que não fosse apenas "mais uma página comum", mas sim uma aplicação **disruptiva**, com forte apelo visual, foco em micro-interações e performance.

## ✨ Funcionalidades e Diferenciais

- **Nuvem de Partículas Interativa (`<canvas>`):** Animação personalizada na seção Hero onde as partículas se movem de forma inteligente para formar o logotipo "DEVCLUB".
- **Efeito Contador Dinâmico:** Os números da seção "Sobre a DevClub" possuem um efeito de contagem progressiva ativado via JavaScript assim que entram na tela.
- **Filtro Dinâmico de Cursos:** Seletores fluidos que permitem filtrar as trilhas de aprendizado sem recarregar a página.
- **Carrossel Infinito (Infinite Scroll):** Seção de empresas parceiras com rolagem contínua e suave, sem cortes secos no layout.
- **Design Premium & Glassmorphism:** Interface escura com detalhes em verde neon, utilizando efeitos de desfoque de fundo (`backdrop-filter`) para simular vidro fosco nas janelas de código estilo terminal.
- **Transições Suaves (Fade Effect):** Troca de depoimentos de alunos com animação de opacidade progressiva para manter a fluidez da navegação.

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Estruturação semântica da página e uso da tag `<canvas>` para renderização gráfica.
- **CSS3 / Flexbox / Grid:** Estilização responsiva, variáveis CSS e efeitos modernos de Glassmorphism.
- **JavaScript (Vanilla):** Lógica de movimentação, cálculo de distância de partículas, efeito de contador numérico e manipulação de loops dos carrosséis.

## 🧠 Lógica da Nuvem de Partículas

A animação principal da página utiliza a API de Canvas 2D do HTML5 e JavaScript puro, baseada em três pilares:

1. **Mapeamento:** O algoritmo lê uma matriz de coordenadas com pontos específicos que desenham a palavra "DEVCLUB".
2. **Atração Física:** Cada partícula calcula sua distância até o ponto de destino no logo e se move em direção a ele usando física vetorial básica para simular magnetismo.
3. **Conexão Dinâmica:** O código calcula a distância entre as partículas em tempo real. Se duas partículas ficam próximas, uma linha verde com opacidade progressiva é traçada entre elas, criando o efeito de teia/nuvem de dados.

## 📁 Estrutura do Projeto

```
├── index.html
├── style.css
├── script.js
└── assets/
    ├── images/
    └── icons/
```

Não é necessário instalar dependências — o projeto foi desenvolvido em JavaScript puro (Vanilla JS).

## 📫 Entre em Contato

- **LinkedIn:** [linkedin.com/in/gian-godoy](https://www.linkedin.com/in/gian-godoy/)
- **GitHub:** [github.com/GianGodoy](https://github.com/GianGodoy)
-  **Email:** Gianlucasgodoy558@gmail.com
