import { mkdir, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

type ReferenceSpec = {
  readonly url: string;
  readonly filename: string;
};

const references: ReferenceSpec[] = [
  {
    url: "https://gitlab.com/kicad/services/kicad-dev-docs/-/raw/master/content/file-formats/sexpr-intro/_index.en.adoc",
    filename: "SEXPR_MAIN.adoc",
  },
  {
    url: "https://gitlab.com/kicad/services/kicad-dev-docs/-/raw/master/content/file-formats/sexpr-schematic/_index.en.adoc",
    filename: "SCHEMATIC_SEXPR.adoc",
  },
  {
    url: "https://gitlab.com/kicad/services/kicad-dev-docs/-/raw/master/content/file-formats/sexpr-pcb/_index.en.adoc",
    filename: "PCB_SEXPR.adoc",
  },
  {
    url: "https://gitlab.com/kicad/services/kicad-dev-docs/-/raw/master/content/file-formats/sexpr-footprint/_index.en.adoc",
    filename: "FOOTPRINT_SEXPR.adoc",
  },
  {
    url: "https://gitlab.com/kicad/services/kicad-dev-docs/-/raw/master/content/file-formats/sexpr-symbol-lib/_index.en.adoc",
    filename: "SCH_SYM_SEXPR.adoc",
  },
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const referencesDir = resolve(repoRoot, "references");

async function fetchReference(reference: ReferenceSpec): Promise<void> {
  const response = await fetch(reference.url);

  if (!response.ok) {
    throw new Error(`${reference.url} (${response.status} ${response.statusText})`);
  }

  const content = await response.text();
  const targetPath = resolve(referencesDir, reference.filename);

  await writeFile(targetPath, content, "utf8");
  console.log(`Saved ${reference.filename}`);
}

async function main(): Promise<void> {
  await mkdir(referencesDir, { recursive: true });

  await Promise.all(
    references.map(async (reference) => {
      try {
        await fetchReference(reference);
      } catch (error) {
        console.error(`Failed to download ${reference.filename}:`, error);
        process.exitCode = 1;
      }
    }),
  );
}

await main();
