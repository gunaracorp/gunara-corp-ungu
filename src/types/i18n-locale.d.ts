/**
 * Modul wildcard untuk import dinamis kamus locale:
 *   await import(`@/lib/i18n/locales/${code}.json`)
 * Berkas nyata (id.json/en.json/dll.) tetap memakai resolveJsonModule bawaan Next;
 * deklarasi ini hanya menerima pola template-literal.
 */
declare module "@/lib/i18n/locales/*.json" {
  const value: { [key: string]: string; default?: { [key: string]: string } };
  export default value;
}
