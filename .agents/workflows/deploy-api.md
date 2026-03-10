---
description: Como compilar e fazer o deploy da API (BackEnd)
---
# Deploy da API Fortunato Agrícola

O servidor do projeto não possui o `dotnet 9 x86` integralmente atualizado para executar os assemblies (DLL) individualmente, o que resultava no erro HTTP 502.5.

A forma unânime e segura de dar deploy compila tudo o que o backend/banco precisa (*Self-Contained*) e não apaga o `web.config` original do IIS/KingHost.

### 1. Instruções para o Build 

Sempre compile o projeto executando o `dotnet publish` com a opção `--self-contained true` em formato `win-x86`.
_Nunca_ use SingleFile ou Trimmed, pois interferem no Swashbuckle e outros dependentes.

**Comando nativo:**
`dotnet publish -c Release -r win-x86 --self-contained true -p:PublishSingleFile=false -p:PublishTrimmed=false -o publish-x86`

### 2. Instruções de Upload e Deploy

Como o projeto já tem um script gerenciado de deploy na pasta `FrontEnd`, o mais recomendado e rápido é simplesmente inicializar o script `deploy.js`.

// turbo-all
1. Para dar deploy, navegue até a pasta **FrontEnd**:
cd "c:\Usuario\Documents\Projetos\Sites\Fortunato Agricola\FrontEnd"

2. Execute o script de publicação no Node:
node deploy.js

Este script inteligente já realiza o processo seguro englobando 3 etapas vitais:
- Compila a API automaticamente com todos os parâmetros exigidos usando `execSync` em Node
- Limpa o diretório remoto no FTP e envia todo o `publish-x86` pelo FTP
- Substitui o `web.config` gerado compilado enviando no lugar o `webconfig.txt` blindado guardado na raiz, que contém as regras certinhas do servidor In-Process.

Seguindo este arquivo, a API sempre funcionará de primeira.
