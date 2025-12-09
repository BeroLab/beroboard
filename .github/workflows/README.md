# GitHub Actions CI/CD Workflows

Dois workflows automáticos para garantir qualidade do código.

## 📋 Workflows

### 1. CI - Main Branch (`ci-main.yml`)
Executa quando uma PR é aberta para `main`.

**O que faz:**
- ✅ Lint completo (Biome)
- ✅ Type check (TypeScript)
- ✅ Todos os testes

**Propósito:** Validação máxima antes de merge para produção.

---

### 2. CI - Development Branch (`ci-development.yml`)
Executa quando uma PR é aberta para `development`.

**O que faz:**
- ✅ Lint apenas em arquivos alterados
- ✅ Type check (TypeScript)
- ✅ Testes

**Propósito:** Feedback rápido durante desenvolvimento.

---

## 🚀 Como Usar

1. **Crie uma branch de feature:**
   ```bash
   git checkout -b feature/sua-feature
   ```

2. **Faça mudanças e commit:**
   ```bash
   git add .
   git commit -m "feat: sua descrição"
   git push origin feature/sua-feature
   ```

3. **Abra PR para `development` no GitHub**
   - Workflow `ci-development.yml` executará automaticamente

4. **Após merge em development, abra PR para `main`**
   - Workflow `ci-main.yml` executará automaticamente

---

## 🧪 Testando Localmente

### Opção 1: Testar Manualmente (Recomendado)

Antes de fazer push, execute os mesmos comandos que os workflows rodam:

```bash
# Lint
bun run check

# Type check
bun run check-types

# Testes
bun test
```

### Opção 2: Validar Workflows (Sem Docker)

Execute o script de validação:

```bash
./validate-workflows.sh
```

Ele verifica:
- ✅ Se os arquivos YAML existem
- ✅ Se os triggers estão corretos
- ✅ Se todas as actions estão presentes
- ✅ Se todos os commands estão configurados

### Opção 3: Rodar com Act (Com Docker)

Se você tiver Docker instalado e rodando:

```bash
# Instalar act (primeira vez)
brew install act

# Testar workflow de development
act pull_request -W .github/workflows/ci-development.yml

# Testar workflow de main
act pull_request -W .github/workflows/ci-main.yml
```

---

## 📊 Monitorando

Na PR no GitHub:
1. Vá para a aba **Checks**
2. Veja o status do workflow em tempo real
3. Se falhar, clique para ver os logs detalhados

---

## 🐛 Se Falhar

**Lint:** Execute `bun run check` para corrigir automaticamente

**Type check:** Execute `bun run check-types` e corrija os erros

**Testes:** Execute `bun test` e verifique quais testes falharam

---

## 📁 Estrutura

```
.github/workflows/
├── ci-main.yml              # Workflow para branch main
├── ci-development.yml       # Workflow para branch development
└── README.md               # Este arquivo
```

---

## ✨ Checklist Antes de Push

- [ ] Rodei `bun run check` localmente
- [ ] Rodei `bun run check-types` localmente
- [ ] Rodei `bun test` localmente
- [ ] Tudo passou sem erros
- [ ] Fiz commit e estou pronto para push

---

## 🎯 Diferenças Entre os Workflows

| Aspecto | Main | Development |
|---------|------|-------------|
| **Trigger** | PR para `main` | PR para `development` |
| **Lint** | Projeto inteiro | Apenas mudanças |
| **Type Check** | Sim | Sim |
| **Testes** | Todos | Todos |
| **Duração** | 3-5 min | 1-3 min |
| **Propósito** | Produção | Desenvolvimento |

---

## 💡 Tips

- Sempre teste localmente antes de fazer PR
- Use `bun run check --write` para auto-formatar código
- Verifique os logs no GitHub se um workflow falhar
- Development é para iteração rápida, main é para estabilidade