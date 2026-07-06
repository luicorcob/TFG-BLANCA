const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".dbf": "application/octet-stream",
  ".geojson": "application/geo+json; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".avif": "image/avif",
  ".jpeg": "image/jpeg",
  ".jfif": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".prj": "text/plain; charset=utf-8",
  ".shp": "application/octet-stream",
  ".shx": "application/octet-stream",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
  ".zip": "application/zip"
};

function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${PORT}`);
  const decodedPath = decodeURIComponent(url.pathname);
  const cleanPath = decodedPath === "/" ? "/index.html" : decodedPath;
  const filePath = path.normalize(path.join(ROOT, cleanPath));

  if (!filePath.startsWith(ROOT)) {
    return null;
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Metodo no permitido");
    return;
  }

  const filePath = resolveRequestPath(req.url);

  if (!filePath) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Acceso denegado");
    return;
  }

  fs.stat(filePath, (statError, stats) => {
    const targetPath = !statError && stats.isDirectory()
      ? path.join(filePath, "index.html")
      : filePath;

    fs.readFile(targetPath, (readError, content) => {
      if (readError) {
        res.writeHead(readError.code === "ENOENT" ? 404 : 500, {
          "Content-Type": "text/plain; charset=utf-8"
        });
        res.end(readError.code === "ENOENT" ? "Pagina no encontrada" : "Error interno");
        return;
      }

      const contentType = MIME_TYPES[path.extname(targetPath).toLowerCase()] || "application/octet-stream";
      res.writeHead(200, {
        "Cache-Control": "public, max-age=300",
        "Content-Type": contentType
      });

      if (req.method === "HEAD") {
        res.end();
        return;
      }

      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Servidor activo en el puerto ${PORT}`);
});
