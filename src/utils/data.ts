/**
 * Utilitários de data
 *
 * As datas trafegam no formato ISO (YYYY-MM-DD) e são exibidas em pt-BR.
 * A conversão é feita por manipulação de string, e não com `new Date(iso)`,
 * porque o construtor interpreta a data como UTC e, em fusos negativos como
 * o do Brasil, exibiria o dia anterior.
 */

const FORMATO_ISO = /^\d{4}-\d{2}-\d{2}$/;

/** Converte YYYY-MM-DD em DD/MM/YYYY. Devolve o valor original se inválido. */
export function formatarDataBR(iso: string): string {
  if (!FORMATO_ISO.test(iso)) return iso;
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/** Data de hoje no formato ISO, no fuso local. */
export function hojeISO(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
}

/** Valida formato e existência da data (rejeita 2026-02-31, por exemplo). */
export function dataValida(iso: string): boolean {
  if (!FORMATO_ISO.test(iso)) return false;
  const [ano, mes, dia] = iso.split("-").map(Number);
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return false;
  const referencia = new Date(Date.UTC(ano, mes - 1, dia));
  return (
    referencia.getUTCFullYear() === ano &&
    referencia.getUTCMonth() === mes - 1 &&
    referencia.getUTCDate() === dia
  );
}

/** Indica se a data ISO é posterior a hoje. */
export function dataNoFuturo(iso: string): boolean {
  return dataValida(iso) && iso > hojeISO();
}

/**
 * Máscara progressiva de digitação: mantém apenas dígitos e insere os hifens
 * nas posições corretas, impedindo entradas como "10/06/2026".
 */
export function aplicarMascaraData(texto: string): string {
  const digitos = texto.replace(/\D/g, "").slice(0, 8);
  if (digitos.length <= 4) return digitos;
  if (digitos.length <= 6) return `${digitos.slice(0, 4)}-${digitos.slice(4)}`;
  return `${digitos.slice(0, 4)}-${digitos.slice(4, 6)}-${digitos.slice(6)}`;
}
