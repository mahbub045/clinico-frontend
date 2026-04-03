export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t px-4 py-3 text-sm text-center text-muted-foreground">
      © {year} Clinico
    </footer>
  );
}
