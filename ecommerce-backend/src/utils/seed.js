const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

const categories = {
  "Escritura y Dibujo": [
    { name: "Lápiz Grafito HB", author: "Faber-Castell", price: 500 },
    { name: "Lápiz de Color Amarillo", author: "Staedtler", price: 800 },
    { name: "Bolígrafo Azul", author: "Bic", price: 600 },
    { name: "Bolígrafo Negro", author: "Pilot", price: 900 },
    { name: "Bolígrafo Gel Verde", author: "Uni-ball", price: 1500 },
    { name: "Rotulador Permanente Negro", author: "Sharpie", price: 2000 },
    { name: "Rotulador para Pizarras", author: "Expo", price: 1800 },
    { name: "Lápices de Colores (Caja 12)", author: "Prismacolor", price: 5500 },
    { name: "Marcador Fluorescente Amarillo", author: "Stabilo", price: 1200 },
    { name: "Marcador Fluorescente Rosa", author: "Stabilo", price: 1200 },
    { name: "Marcador Negro de Pizarra", author: "Expo", price: 1700 },
    { name: "Lápices de Pastel", author: "Derwent", price: 7000 },
    { name: "Pincel N° 6", author: "Winsor & Newton", price: 1200 },
    { name: "Lápiz 2B", author: "Faber-Castell", price: 500 },
    { name: "Portaminas 0.7mm", author: "Pentel", price: 3500 },
    { name: "Tinta de Rotulador", author: "Pilot", price: 2500 },
    { name: "Set de Caligrafía", author: "Manuscript", price: 9500 },
    { name: "Borrador para Tinta", author: "Staedtler", price: 900 },
    { name: "Sacapuntas Metálico", author: "Maped", price: 1200 },
    { name: "Tiza Blanca (Caja 10)", author: "Crayola", price: 2000 }
  ],
  "Papelería": [
    { name: "Pegamento en Barra", author: "Pritt", price: 1500 },
    { name: "Silicona Líquida", author: "Adherix", price: 2000 },
    { name: "Tijeras Escolares", author: "Fiskars", price: 2500 },
    { name: "Tijeras de Oficina", author: "Stanley", price: 3000 },
    { name: "Regla de 30 cm", author: "Maped", price: 800 },
    { name: "Compás Metálico", author: "Staedtler", price: 4500 },
    { name: "Cinta Adhesiva Transparente", author: "Scotch", price: 700 },
    { name: "Notas Adhesivas", author: "Post-it", price: 2500 },
    { name: "Perforadora de 2 Agujeros", author: "Rapesco", price: 8000 },
    { name: "Caja de Clips Metálicos", author: "OfficePro", price: 1200 },
    { name: "Grapadora Manual", author: "Rexel", price: 5000 },
    { name: "Estuche de Lápices", author: "Faber-Castell", price: 4500 },
    { name: "Engrampadora de Bolsillo", author: "Rapesco", price: 3500 },
    { name: "Gomas Elásticas (Paquete)", author: "Staples", price: 800 },
    { name: "Caja Organizadora", author: "OfficePro", price: 3000 },
    { name: "Pegamento en Gel", author: "Pritt", price: 1800 },
    { name: "Cinta Doble Faz", author: "Scotch", price: 2500 },
    { name: "Marcadores de Página", author: "Post-it", price: 1500 },
    { name: "Hilo de Amarre", author: "Duraflex", price: 1200 },
    { name: "Pinzas de Oficina", author: "Bostitch", price: 2000 }
  ],
  "Papel": [
    { name: "Hojas Blancas A4 (500 unidades)", author: "Double A", price: 9000 },
    { name: "Hojas de Papel Lustre", author: "Artel", price: 2000 },
    { name: "Hojas de Cartulina Blanca", author: "Canson", price: 2500 },
    { name: "Cuaderno Universitario", author: "Oxford", price: 4500 },
    { name: "Cuaderno Cuadriculado", author: "Tilibra", price: 4200 },
    { name: "Agenda Escolar 2024", author: "Daybook", price: 5000 },
    { name: "Hojas de Papel Kraft", author: "ArtPaper", price: 1800 },
    { name: "Papel Crepé de Colores", author: "ColorArt", price: 1500 },
    { name: "Papel Bond Tamaño Carta", author: "Hammermill", price: 8500 },
    { name: "Hojas de Papel Vegetal", author: "Winsor & Newton", price: 3000 },
    { name: "Papel Fotográfico Glossy", author: "HP", price: 12000 },
    { name: "Cuaderno para Bocetos", author: "Artix", price: 7500 },
    { name: "Bloc de Papel Acuarela", author: "Canson", price: 9500 },
    { name: "Papel Milimetrado", author: "Staedtler", price: 1500 },
    { name: "Hojas de Papel Reciclado", author: "GreenPaper", price: 6000 },
    { name: "Rollo de Papel Kraft", author: "Papercraft", price: 8500 },
    { name: "Bloc de Notas", author: "Post-it", price: 2500 },
    { name: "Hojas Perforadas A4", author: "Esselte", price: 4000 },
    { name: "Cartulina de Colores", author: "Artel", price: 5000 },
    { name: "Rollo de Papel Etiqueta", author: "Avery", price: 3000 }
  ],
  "Oficina": [
    { name: "Engrapadora de Oficina", author: "Swingline", price: 7000 },
    { name: "Perforadora Metálica", author: "Rapesco", price: 8500 },
    { name: "Calculadora Científica", author: "Casio", price: 12000 },
    { name: "Archivador de Palanca", author: "Esselte", price: 6500 },
    { name: "Caja de Grapas", author: "Staples", price: 800 },
    { name: "Bloc de Notas Adhesivas", author: "Post-it", price: 2500 },
    { name: "Rotulador para CD/DVD", author: "Sharpie", price: 2000 },
    { name: "Set de Sobres Blancos", author: "Mead", price: 3000 },
    { name: "Portafolios de Cartón", author: "OfficePro", price: 4000 },
    { name: "Carpeta Plástica A4", author: "Maped", price: 2500 },
    { name: "Cajonera de Plástico", author: "Sterilite", price: 15000 },
    { name: "Caja Organizadora de Papeles", author: "Esselte", price: 5000 },
    { name: "Grapadora Eléctrica", author: "Swingline", price: 12000 },
    { name: "Set de Plumas Fuente", author: "Lamy", price: 25000 },
    { name: "Portaminas Metálico", author: "Rotring", price: 12000 },
    { name: "Calculadora Gráfica", author: "Texas Instruments", price: 45000 },
    { name: "Cortador de Papel", author: "Dahle", price: 30000 },
    { name: "Rotulador Multiuso", author: "Staedtler", price: 1800 },
    { name: "Caja de Almacenamiento", author: "OfficePro", price: 4000 },
    { name: "Bandeja de Escritorio", author: "Fellowes", price: 3500 }
  ],
};

async function main() {
  try {
    console.log('Iniciando generación de datos...');
    
    console.log('Limpiando la base de datos...');
    await prisma.orderProduct.deleteMany({});
    await prisma.promotion.deleteMany({});
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.user.deleteMany({});
    
    console.log('Creando cuenta ADMIN...');
    const admin = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: 'password123',
        name: 'Admin User',
        role: 'admin',
        points: 0,
      },
    });
    
    console.log('Creando usuarios falsos...');
    const users = [];
    for (let i = 0; i < 50; i++) {
      const user = await prisma.user.create({
        data: {
          email: faker.internet.email(),
          password: 'password123',
          name: faker.person.fullName(),
          role: 'user',
          points: faker.number.int({ min: 0, max: 200 }),
        },
      });
      users.push(user);
    }
    
    console.log('Creando productos...');
    const products = [];
    for (const [category, items] of Object.entries(categories)) {
      for (const item of items) {
        const product = await prisma.product.create({
          data: {
            name: item.name,
            author: item.author,
            price: item.price,
            stock: faker.number.int({ min: 10, max: 100 }),
            description: faker.lorem.sentence(),
            category: category,
            isHot: faker.datatype.boolean(),
          },
        });
        products.push(product);
      }
    }
    
    console.log('Creando promociones...');
    for (let i = 0; i < 10; i++) {
      const product = faker.helpers.arrayElement(products);
      await prisma.promotion.create({
        data: {
          productId: product.id,
          discount: faker.number.float({ min: 5, max: 50, precision: 0.01 }),
          duration: faker.number.int({ min: 24, max: 168 }),
          expiresAt: faker.date.future(),
        },
      });
    }
    
    console.log('Creando pedidos...');
    for (let i = 0; i < 100; i++) {
      const user = faker.helpers.arrayElement(users);
      const selectedProducts = faker.helpers.arrayElements(
        products,
        faker.number.int({ min: 1, max: 5 })
      );

      const orderProducts = selectedProducts.map((product) => ({
        productId: product.id,
        quantity: faker.number.int({ min: 1, max: 5 }),
      }));

      const total = orderProducts.reduce(
        (sum, op) => sum + op.quantity * products.find((p) => p.id === op.productId).price,
        0
      );

      await prisma.order.create({
        data: {
          userId: user.id,
          status: faker.helpers.arrayElement([
            'Pending',
            'Preparing',
            'Ready',
            'Completed',
            'Cancelled',
          ]),
          total,
          products: { create: orderProducts },
        },
      });
    }

    console.log('Seed completado con éxito.');
  } catch (error) {
    console.error('Error durante el seed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();