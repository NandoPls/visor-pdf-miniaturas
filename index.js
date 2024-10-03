const express = require('express');
const path = require('path');
const fs = require('fs');
const pdfLib = require('pdf-lib'); // Usamos pdf-lib para manejar el PDF
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para servir páginas específicas de un PDF
app.get('/pdf-viewer', async (req, res) => {
    const book = req.query.book;
    const page = parseInt(req.query.page, 10);

    if (!book || isNaN(page)) {
        return res.status(400).send('Libro o página no seleccionado');
    }

    const filePath = path.join(__dirname, 'public', book);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Libro no encontrado');
    }

    try {
        const pdfBytes = fs.readFileSync(filePath);
        const pdfDoc = await pdfLib.PDFDocument.load(pdfBytes);
        const totalPages = pdfDoc.getPageCount();

        if (page > totalPages || page < 1) {
            return res.status(400).send('Página fuera de rango');
        }

        const pdfPage = await pdfDoc.extractPages([page - 1]);
        const pdfBytesPage = await pdfPage.save();

        res.contentType("application/pdf");
        res.send(pdfBytesPage);
    } catch (error) {
        console.error('Error al cargar el PDF:', error);
        res.status(500).send('Error al cargar el PDF');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
