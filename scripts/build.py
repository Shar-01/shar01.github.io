"""Build a portable static website; include only explicitly public files."""
from pathlib import Path
import json
import shutil
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def build():
    raw = (ROOT / "content.js").read_text(encoding="utf-8")
    data = json.loads(raw.split("=", 1)[1].strip().removesuffix(";"))
    entries = []
    for paper in data["publications"]:
        fields = {"title": "{" + paper["title"] + "}", "author": " and ".join(paper["authors"]), "year": str(paper["year"])}
        for key in ["journal", "booktitle", "volume", "number", "pages", "doi", "eprint", "archivePrefix", "url"]:
            if paper.get(key):
                fields[key] = paper[key]
        body = ",\n".join(f"  {key} = {{{value}}}" for key, value in fields.items())
        entries.append(f"@{paper['bibType']}{{{paper['id']},\n{body}\n}}")
    (ROOT / "assets" / "publications.bib").write_text("\n\n".join(entries) + "\n", encoding="utf-8")

    output = ROOT / "dist"
    output.mkdir(exist_ok=True)
    public_files = [ROOT / name for name in ["index.html", "styles.css", "content.js", "app.js"]]
    public_files.extend(path for path in (ROOT / "assets").rglob("*") if path.is_file())
    expected = set()
    for source in public_files:
        relative = source.relative_to(ROOT)
        target = output / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(source, target)
        expected.add(relative.as_posix())
    # Delete stale build files only after verifying they are inside this output folder.
    for existing in output.rglob("*"):
        if existing.is_file() and existing.relative_to(output).as_posix() not in expected:
            if output.resolve() not in existing.resolve().parents:
                raise ValueError("Refusing to remove a file outside the build directory")
            existing.unlink()
    with zipfile.ZipFile(ROOT / "sharmita-dey-website.zip", "w", zipfile.ZIP_DEFLATED) as archive:
        for relative in sorted(expected):
            archive.write(output / relative, relative)
    total = sum((output / relative).stat().st_size for relative in expected)
    print(f"Built {len(expected)} public files ({total / 1_000_000:.1f} MB) in {output}")
    return output


if __name__ == "__main__":
    build()
