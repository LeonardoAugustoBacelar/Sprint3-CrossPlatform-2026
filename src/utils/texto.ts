/**
 * Utilitários de texto
 */

/**
 * Normaliza para busca: minúsculas e sem acentos, de modo que "producao"
 * encontre "Produção". Se o runtime não suportar normalize, cai para
 * a comparação simples em minúsculas.
 */
export function normalizarTexto(texto: string): string {
  const minusculo = texto.toLowerCase().trim();
  try {
    return minusculo.normalize("NFD").replace(/[̀-ͯ]/g, "");
  } catch {
    return minusculo;
  }
}
