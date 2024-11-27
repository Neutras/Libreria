const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando generación de datos simulados...');

  // Crear usuarios
  console.log('Generando usuarios...');
  const users = [];
  for (let i = 0; i < 10; i++) {
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

  // Crear productos
  console.log('Generando productos...');
  const categories = ['Papelería', 'Electrónica', 'Hogar', 'Juguetes', 'Ropa']; // Categorías predefinidas
  const products = [];
  for (let i = 0; i < 20; i++) {
    const product = await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        price: faker.number.float({ min: 500, max: 10000, precision: 1 }),
        stock: faker.number.int({ min: 0, max: 100 }),
        description: faker.lorem.paragraph(),
        category: faker.helpers.arrayElement(categories), // Asignar categoría aleatoria
      },
    });
    products.push(product);
  }

  // Crear pedidos
  console.log('Generando pedidos...');
  for (let i = 0; i < 10; i++) {
    const user = faker.helpers.arrayElement(users);
    const orderProducts = faker.helpers.arrayElements(products, faker.number.int({ min: 1, max: 5 }));
    const total = orderProducts.reduce((sum, product) => sum + parseFloat(product.price), 0);

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'Pending',
        total: total,
        products: {
          create: orderProducts.map((product) => ({
            productId: product.id,
            quantity: faker.number.int({ min: 1, max: 5 }),
          })),
        },
      },
    });

    console.log(`Pedido generado con ID: ${order.id}`);
  }

  console.log('Datos simulados generados exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error al generar datos simulados:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
