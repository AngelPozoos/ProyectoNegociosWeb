import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');

    const products = [
        {
            nombre: 'Laptop Gamer Asus TUF F15',
            descripcion: 'Potente laptop con procesador i9, RTX 4080 y 32GB RAM. Ideal para gaming y trabajo pesado.',
            precio: 26800.00,
            sku: 'TECH-LAP-001',
            stock: 15,
            categoria: 'Computación',
            imagenes: 'https://www.asus.com/media/global/gallery/63nq57jtwcnkqduo_setting_xxx_0_90_end_800.png',
        },
        {
            nombre: 'Samsung S25 Ultra 5G',
            descripcion: 'Pantalla AMOLED 120Hz, cámara de 200MP y batería de larga duración.',
            precio: 22999.00,
            sku: 'TECH-PHN-002',
            stock: 50,
            categoria: 'Telefonía',
            imagenes: 'https://images.samsung.com/is/image/samsung/p6pim/mx/2501/gallery/mx-galaxy-s25-s938-sm-s938bzbvltm-544706905?imbypass=true',
        },
        {
            nombre: 'Sony WH-1000XM5',
            descripcion: 'Sonido de alta fidelidad con cancelación de ruido activa y 30 horas de batería.',
            precio: 5499.00,
            sku: 'TECH-AUD-003',
            stock: 80,
            categoria: 'Audio',
            imagenes: 'https://m.media-amazon.com/images/I/61ULAZmt9NL._AC_SX522_.jpg',
        },
        {
            nombre: 'Apple Watch Series 10 42 mm',
            descripcion: 'Monitoreo de salud avanzado, GPS integrado y resistencia al agua.',
            precio: 8999.00,
            sku: 'TECH-WCH-004',
            stock: 30,
            categoria: 'Wearables',
            imagenes: 'https://www.macstoreonline.com.mx/img/sku/WATCH454_Z1.webp',
        },
        {
            nombre: 'Monitor 4K UltraWide',
            descripcion: '34 pulgadas, panel IPS, tasa de refresco de 144Hz. Perfecto para productividad.',
            precio: 12500.00,
            sku: 'TECH-MON-005',
            stock: 20,
            categoria: 'Periféricos',
            imagenes: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        },
        {
            nombre: 'Teclado Mecánico RGB',
            descripcion: 'Switches Cherry MX Blue, retroiluminación personalizable y chasis de aluminio.',
            precio: 3200.00,
            sku: 'TECH-KBD-006',
            stock: 75,
            categoria: 'Periféricos',
            imagenes: 'https://ddtech.mx/assets/uploads/f35597eb88a3427b1400ebaee8a1034f.png',
        }
    ];

        for (const product of products) {
        await prisma.producto.upsert({
            where: { sku: product.sku },
            create: product,
            update: product,  // aquí se actualizan nombre, descripcion, imagenes, etc.
        });
        }

    // Create a test user for checkout
    const testUser = await prisma.usuario.findUnique({ where: { email: 'test@example.com' } });
    if (!testUser) {
        await prisma.usuario.create({
            data: {
                id: 'test-user-id',
                email: 'test@example.com',
                nombre: 'Test User',
                password: 'hashed_password_here', // In production, use proper hashing
                rol: 'CLIENTE',
            },
        });
        console.log('Test user created with ID: test-user-id');
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

