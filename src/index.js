const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3000;

// Servir archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname)));

// Ruta para obtener la lista de libros en la carpeta 'books'
app.get('/books', (req, res) => {
    const booksDir = path.join(__dirname, 'books');
    fs.readdir(booksDir, (err, files) => {
        if (err) {
            return res.status(500).send('Error al leer la carpeta de libros');
        }
        const pdfBooks = files.filter(file => file.endsWith('.pdf'));
        res.json(pdfBooks); // Enviar los libros como JSON
    });
});

// Ruta para servir el libro seleccionado en PDF
app.get('/pdf', (req, res) => {
    const book = req.query.book;

    if (!book) {
        return res.status(400).send('Libro no seleccionado');
    }

    const filePath = path.join(__dirname, 'books', book);
    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Libro no encontrado');
    }

    // Servir el archivo PDF completo
    res.contentType("application/pdf");
    res.sendFile(filePath);
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
