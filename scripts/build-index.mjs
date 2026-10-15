// Gera edicoes/index.json a partir de edicoes/AAAA-MM-DD/edicao.json
// Roda no GitHub Action a cada push (ver .github/workflows/build-index.yml)
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const raiz = join(process.cwd(), 'edicoes');
const dias = readdirSync(raiz, { withFileTypes: true })
  .filter((d) => d.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(d.name))
  .map((d) => d.name)
  .sort()
  .reverse();

const indice = [];
for (const dia of dias) {
  const arq = join(raiz, dia, 'edicao.json');
  if (!existsSync(arq)) continue;
  const ed = JSON.parse(readFileSync(arq, 'utf8'));
  indice.push({
    data: dia,
    materias: ed.materias.map((m) => ({
      posicao: m.posicao, slug: m.slug, titulo: m.titulo, linha_fina: m.linha_fina, editoria: m.editoria,
    })),
  });
}
writeFileSync(join(raiz, 'index.json'), JSON.stringify(indice, null, 2));
console.log(`index.json: ${indice.length} dia(s)`);
