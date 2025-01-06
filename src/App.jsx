const fs = require('fs');
const { MongoClient } = require('mongodb');

// URL de conexión de MongoDB
const client = new MongoClient(uri);

async function run() {
    try {
        await client.connect();
        const database = client.db('testDB');
        const collection = database.collection('images');

        // Leer la imagen como un buffer
        const imageBuffer = fs.readFileSync('public/traje.png');

        // Crear un documento con los datos binarios
        const document = {
            nombre: "Mi Imagen",
            tipo: "image/png",
            datos: imageBuffer,
        };

        // Insertar el documento en la colección
        const result = await collection.insertOne(document);
        console.log(`Imagen almacenada con ID: ${result.insertedId}`);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        await client.close();
    }
}

run().catch(console.dir);

export default function App(){
  
  return(
    <div>
      <h3>The last</h3>
      <h1>Game</h1>
    </div>
  );
}


