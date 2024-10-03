const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para devolver la lista de libros en la carpeta /books
app.get('/books', (req, res) => {
    const booksDir = path.join(__dirname, 'books');
    fs.readdir(booksDir, (err, files) => {
        if (err) {
            console.error("Error al leer la carpeta de libros:", err);
            return res.status(500).send('Error al leer la carpeta de libros');
        }
        const pdfBooks = files.filter(file => file.endsWith('.pdf'));
        if (pdfBooks.length === 0) {
            return res.status(404).json({ error: 'No se encontraron libros PDF.' });
        }
        res.json(pdfBooks);
    });
});

// Ruta para servir el PDF seleccionado
app.get('/pdf', (req, res) => {
    const book = req.query.book;
    if (!book) {
        return res.status(400).send('Libro no seleccionado');
    }

    const filePath = path.join(__dirname, 'books', book);
    console.log("Buscando archivo PDF en:", filePath);

    if (!fs.existsSync(filePath)) {
        console.error("Libro no encontrado:", filePath);
        return res.status(404).send('Libro no encontrado');
    }

    res.contentType("application/pdf");
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error("Error al enviar el archivo PDF:", err);
        } else {
            console.log("Archivo PDF enviado correctamente:", filePath);
        }
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
