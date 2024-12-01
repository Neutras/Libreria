const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando generación de datos simulados...');

  // **Limpieza de la base de datos**
  console.log('Limpiando datos existentes...');
  await prisma.orderProduct.deleteMany({});
  await prisma.promotion.deleteMany({});
  await prisma.inventoryAlert.deleteMany({});
  await prisma.alert.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  // **Usuarios**
  console.log('Generando usuarios...');
  const users = [];
  for (let i = 0; i < 25; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.person.fullName(),
        role: i === 0 ? 'admin' : 'user', // El primer usuario será admin
        points: faker.number.int({ min: 0, max: 100 }),
      },
    });
    users.push(user);
  }

  // **Productos**
  console.log('Generando productos...');
  const categories = [
    'Ficción',
    'No ficción',
    'Historia',
    'Ciencia',
    'Fantasía',
    'Romance',
    'Thriller',
    'Poesía',
    'Infantil',
    'Juvenil',
  ];

  const products = [];
  for (let i = 0; i < 50; i++) {
    const stock = faker.number.int({ min: 10, max: 100 }); // Stock mínimo de 10
    const product = await prisma.product.create({
      data: {
        name: faker.lorem.words({ min: 2, max: 5 }),
        author: faker.person.fullName(),
        price: faker.number.float({ min: 500, max: 10000, precision: 0.01 }),
        stock: stock,
        description: faker.lorem.paragraph(),
        category: faker.helpers.arrayElement(categories),
        isHot: faker.datatype.boolean(), // Marcar algunos productos como HOT
      },
    });
    products.push(product);
  }

  // **Pedidos**
  console.log('Generando pedidos...');
  for (let i = 0; i < 30; i++) {
    const user = faker.helpers.arrayElement(users); // Seleccionar un usuario aleatorio
    const orderProducts = faker.helpers.arrayElements(
      products,
      faker.number.int({ min: 1, max: 5 }) // Mínimo 1 y máximo 5 productos por pedido
    ).map((product) => ({
      productId: product.id,
      quantity: faker.number.int({ min: 1, max: 5 }), // Cantidad entre 1 y 5
    }));

    const total = orderProducts.reduce(
      (sum, product) =>
        sum + product.quantity * products.find((p) => p.id === product.productId).price,
      0
    );

    if (orderProducts.length === 0) {
      console.warn('Saltando pedido sin productos...');
      continue;
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: faker.helpers.arrayElement(['Pending', 'Completed']), // Algunos pedidos completados
        total: total,
        products: { create: orderProducts },
      },
    });

    console.log(`Pedido generado con ID: ${order.id}`);
  }

  // **Promociones**
  console.log('Generando promociones...');
const usedProductIds = new Set(); // Para evitar productos repetidos en promociones

for (let i = 0; i < 10; i++) {
  const product = faker.helpers.arrayElement(products);

  // Evitar productos duplicados en promociones
  if (usedProductIds.has(product.id)) {
    console.log(`Producto con ID ${product.id} ya tiene una promoción. Saltando...`);
    continue;
  }

  await prisma.promotion.create({
    data: {
      productId: product.id,
      discount: faker.number.float({ min: 5, max: 50, precision: 0.01 }),
      duration: faker.number.int({ min: 24, max: 168 }), // Duración entre 1 y 7 días
      expiresAt: faker.date.future(), // Fecha futura
    },
  });

  usedProductIds.add(product.id); // Marcar el producto como usado
  console.log(`Promoción creada para producto con ID: ${product.id}`);}
}

main()
  .catch((e) => {
    console.error('Error al generar datos simulados:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
