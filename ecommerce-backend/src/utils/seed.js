const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

const categories = {
  "Escritura y Dibujo": [
  { name: "Lápiz Grafito HB", author: "Faber-Castell", price: 500, description: "Lápiz de grafito de alta calidad, ideal para escritura y dibujo técnico." },
  { name: "Bolígrafo Azul 0.7mm", author: "Bic", price: 600, description: "Bolígrafo de tinta fluida y punta fina para escritura suave." },
  { name: "Plumón Permanente Negro", author: "Sharpie", price: 2000, description: "Marcador permanente para uso en superficies como vidrio, plástico y cartón." },
  { name: "Portaminas 0.5mm", author: "Pentel", price: 4000, description: "Portaminas profesional para dibujo técnico y escritura precisa." },
  { name: "Lápices de Colores Jumbo (12 unidades)", author: "Maped", price: 3500, description: "Lápices gruesos y ergonómicos con colores vivos, ideales para niños pequeños." },
  { name: "Plumón de Pizarra Blanca (Set de 4 colores)", author: "Expo", price: 5000, description: "Plumones de borrado seco, perfectos para pizarras blancas." },
  { name: "Set de Lápices de Grafito (2H, HB, B, 2B)", author: "Staedtler", price: 2500, description: "Set ideal para dibujo técnico y artístico con diferentes durezas." },
  { name: "Bolígrafo Gel Negro", author: "Pilot", price: 1500, description: "Bolígrafo con tinta de gel suave y secado rápido, perfecto para escritura profesional." },
  { name: "Lápices Pastel Seco (Caja 12)", author: "Prismacolor", price: 15000, description: "Lápices pastel secos para técnicas de sombreado y degradado en arte." },
  { name: "Lápiz Grafito Triangular", author: "Faber-Castell", price: 700, description: "Diseño ergonómico triangular para un agarre cómodo." },
  { name: "Goma de Borrar Suave", author: "Staedtler", price: 800, description: "Goma para grafito que no daña el papel y deja pocos residuos." },
  { name: "Sacapuntas Metálico con Depósito", author: "Maped", price: 1500, description: "Sacapuntas resistente con depósito transparente para residuos." },
  { name: "Plumón de Tiza Líquida (Blanco)", author: "Kreidezeit", price: 2500, description: "Plumón de tiza para pizarras negras y vidrio, fácil de borrar." },
  { name: "Lápices de Colores Acuarelables (Caja 24)", author: "Faber-Castell", price: 9000, description: "Lápices acuarelables para técnicas de pintura en seco y húmedo." },
  { name: "Plumón Doble Punta (Fina y Gruesa)", author: "Tombow", price: 4000, description: "Plumón versátil para lettering y dibujo artístico." },
  { name: "Set de Plumas Fuente", author: "Lamy", price: 25000, description: "Set con pluma fuente de acero inoxidable y cartuchos de tinta." },
  { name: "Tiza Blanca para Pizarra (Caja 12)", author: "Crayola", price: 1500, description: "Tizas anti-polvo para pizarras tradicionales." },
  { name: "Plumones Permanentes de Colores (Set de 12)", author: "Sharpie", price: 10000, description: "Marcadores permanentes en colores vibrantes para proyectos creativos." },
  { name: "Bolígrafo Retráctil Azul", author: "Uni-ball", price: 1200, description: "Bolígrafo con punta retráctil y tinta resistente al agua." },
  { name: "Set de Dibujo Técnico (Compás, Transportador, Escuadra)", author: "Staedtler", price: 7500, description: "Kit completo para dibujo técnico y matemáticas." },
  { name: "Plumones Finos para Lettering (Set de 6)", author: "Tombow", price: 8000, description: "Plumones de punta fina diseñados para caligrafía moderna." },
  { name: "Portaminas de 0.7mm con Goma", author: "Pilot", price: 3000, description: "Portaminas ergonómico con goma integrada y mecanismo suave." },
  { name: "Tinta para Pluma Fuente (Negra)", author: "Parker", price: 5000, description: "Tinta líquida de alta calidad para recargar plumas fuente." },
  { name: "Bolígrafo Multicolor (4 colores)", author: "Bic", price: 2000, description: "Bolígrafo 4 en 1 con colores básicos (azul, negro, rojo y verde)." },
  { name: "Set de Lápices Charcoal (3 durezas)", author: "Derwent", price: 5500, description: "Lápices de carbón para dibujo artístico." },
  { name: "Goma de Borrar para Tinta", author: "Pelikan", price: 1000, description: "Borrador especial para tinta de bolígrafo." },
  { name: "Rotulador Permanente Extra Grueso", author: "Sharpie", price: 3000, description: "Rotulador de punta gruesa para marcados visibles en superficies grandes." },
  { name: "Lápices Metálicos (Caja 10)", author: "Faber-Castell", price: 7500, description: "Lápices con acabado metálico para detalles brillantes." },
  { name: "Set de Lápices para Bocetos", author: "Cretacolor", price: 10000, description: "Incluye lápices, carboncillo y goma para esbozos artísticos." },
  { name: "Plumones Lavables para Niños (Caja 12)", author: "Crayola", price: 4000, description: "Fáciles de lavar, ideales para niños pequeños." },
  { name: "Lápices de Colores Metálicos (Set de 12)", author: "Arteza", price: 9000, description: "Colores metálicos para agregar brillo a tus proyectos." },
  { name: "Rotulador para Tela", author: "Pilot", price: 3500, description: "Marcador permanente para escribir o dibujar en tela." },
  { name: "Set de Plumones para Ilustración", author: "Copic", price: 45000, description: "Marcadores de calidad profesional para diseño gráfico y arte." },
  { name: "Pincel para Tinta China", author: "Winsor & Newton", price: 2500, description: "Pincel de cerdas finas para trazos precisos." },
  { name: "Tinta de Repuesto para Plumones Permanentes", author: "Sharpie", price: 1500, description: "Tinta líquida para recargar plumones Sharpie." },
  { name: "Set de Marcadores Dual Brush (Set de 10)", author: "Tombow", price: 22000, description: "Rotuladores con doble punta, ideal para lettering y arte." },
  { name: "Lápices Grafito para Croquis (4B a 6H)", author: "Staedtler", price: 6500, description: "Lápices de distintas durezas para dibujo técnico." },
  { name: "Bolígrafo de Tinta Azul con Grip", author: "Bic", price: 1000, description: "Diseño ergonómico con tinta suave de secado rápido." },
  { name: "Set de Lápices para Shading", author: "Derwent", price: 7500, description: "Incluye lápices específicos para sombreado en arte." },
  { name: "Rotulador Multiuso de Punta Fina", author: "Pilot", price: 2000, description: "Rotulador para etiquetado y uso general." },
  { name: "Set de Acuarelables con Pincel", author: "Prismacolor", price: 15000, description: "Lápices de colores que se activan con agua." },
  { name: "Bolígrafo Rollerball", author: "Uni-ball", price: 2500, description: "Bolígrafo con tinta de gel para trazos suaves y oscuros." },
  { name: "Marcador para Vidrio", author: "Sharpie", price: 3000, description: "Marcador especial para escribir en superficies como vidrio y espejos." },
  { name: "Lápices de Colores Neón", author: "Arteza", price: 8500, description: "Colores brillantes y vibrantes para arte y diseño." },
  { name: "Rotulador para CD/DVD", author: "Staedtler", price: 1800, description: "Marcador indeleble ideal para etiquetar discos ópticos." },
  { name: "Set de Rotuladores para Diseño Gráfico", author: "Winsor & Newton", price: 30000, description: "Rotuladores profesionales con base de alcohol para ilustración." },
  { name: "Set de Lápices de Grafito Profesional", author: "Caran d'Ache", price: 20000, description: "Incluye lápices de alta calidad para artistas y diseñadores." },
],
"Papelería": [
  { name: "Pegamento en Barra (20 g)", author: "Pritt", price: 1500, description: "Pegamento en barra ideal para trabajos escolares y manualidades." },
  { name: "Silicona Líquida (120 ml)", author: "Adherix", price: 2000, description: "Silicona líquida transparente para pegar papel, cartón y tela." },
  { name: "Tijeras Escolares", author: "Maped", price: 2500, description: "Tijeras ergonómicas con punta redondeada para uso escolar." },
  { name: "Tijeras de Oficina", author: "Fiskars", price: 3500, description: "Tijeras de acero inoxidable con mango ergonómico, ideales para cortes precisos." },
  { name: "Cinta Adhesiva Transparente (18 mm x 50 m)", author: "Scotch", price: 1000, description: "Cinta adhesiva multiuso para trabajos en oficina y hogar." },
  { name: "Cinta Doble Faz (20 mm x 5 m)", author: "3M", price: 2500, description: "Cinta adhesiva de doble cara para proyectos de manualidades y decoración." },
  { name: "Notas Adhesivas Amarillas (100 hojas)", author: "Post-it", price: 2500, description: "Bloc de notas adhesivas para recordatorios y marcadores de página." },
  { name: "Perforadora de 2 Agujeros", author: "Rapesco", price: 7000, description: "Perforadora metálica de alta resistencia para documentos." },
  { name: "Caja de Clips Metálicos (50 unidades)", author: "OfficePro", price: 1200, description: "Clips metálicos para organizar documentos de manera sencilla." },
  { name: "Engrapadora Manual con Grapas", author: "Swingline", price: 5000, description: "Engrapadora de metal resistente para uso en oficina y hogar." },
  { name: "Pegamento Universal (100 ml)", author: "UHU", price: 3500, description: "Pegamento universal multiuso para papel, madera y plástico." },
  { name: "Goma Eva con Glitter (30 x 40 cm)", author: "Artel", price: 1500, description: "Láminas de goma eva con brillo para manualidades y decoración." },
  { name: "Regla de Plástico Transparente (30 cm)", author: "Maped", price: 800, description: "Regla resistente y flexible con medidas precisas." },
  { name: "Cortador de Papel con Repuesto", author: "X-ACTO", price: 3000, description: "Cortador de precisión para proyectos de papelería y manualidades." },
  { name: "Set de Cinta Washi (6 diseños)", author: "DecoTape", price: 5000, description: "Cintas adhesivas decorativas para embellecer proyectos y regalos." },
  { name: "Set de Marcadores de Página", author: "Post-it", price: 2500, description: "Marcadores de página coloridos para resaltar información importante." },
  { name: "Pinzas de Oficina Metálicas (Caja 12 unidades)", author: "Bostitch", price: 2000, description: "Pinzas de metal para sujetar documentos de forma segura." },
  { name: "Pegamento en Gel Transparente", author: "Pritt", price: 1800, description: "Pegamento en gel ideal para manualidades y trabajos escolares." },
  { name: "Sacapuntas Doble con Depósito", author: "Staedtler", price: 1500, description: "Sacapuntas con doble entrada y depósito para residuos." },
  { name: "Goma de Borrar (Pack 2 unidades)", author: "Pelikan", price: 1200, description: "Gomas suaves y resistentes para borrar grafito sin dañar el papel." },
  { name: "Cinta Correctora (6 m)", author: "Tipp-Ex", price: 2500, description: "Cinta correctora para eliminar errores de forma limpia y rápida." },
  { name: "Bloc de Notas Adhesivas de Colores (4 bloques)", author: "Post-it", price: 4500, description: "Bloc de notas adhesivas en colores vibrantes para organizar tus ideas." },
  { name: "Hilo de Algodón para Manualidades", author: "DMC", price: 2000, description: "Hilo resistente para bordados y manualidades decorativas." },
  { name: "Estuche de Lápices con Cremallera", author: "Faber-Castell", price: 5500, description: "Estuche compacto y duradero para guardar lápices y herramientas." },
  { name: "Cinta de Embalaje Transparente (48 mm x 100 m)", author: "Scotch", price: 4500, description: "Cinta de alta resistencia para sellado de cajas y paquetes." },
  { name: "Caja Organizadora para Escritorio", author: "Esselte", price: 4000, description: "Organizador de plástico con divisiones para herramientas de oficina." },
  { name: "Set de Pegamento en Barra (3 unidades)", author: "UHU", price: 4000, description: "Set económico de pegamento en barra, ideal para la escuela." },
  { name: "Cinta Adhesiva Decorativa (Pack 5 diseños)", author: "Scotch", price: 5500, description: "Cinta decorativa para proyectos de manualidades y decoración." },
  { name: "Caja de Tachuelas Metálicas", author: "OfficePro", price: 2000, description: "Tachuelas resistentes para fijar documentos en corchos y paneles." },
  { name: "Set de Grapas para Engrapadora (Caja 1000)", author: "Rexel", price: 800, description: "Grapas universales para uso en oficinas y hogares." },
  { name: "Perforadora de 4 Agujeros", author: "Maped", price: 9000, description: "Perforadora multiuso para archivadores de varios anillos." },
  { name: "Lápiz Adhesivo de Precisión", author: "UHU", price: 2500, description: "Pegamento en lápiz para aplicaciones precisas y sin manchas." },
  { name: "Cinta Adhesiva de Colores (Set 6 colores)", author: "DecoTape", price: 3000, description: "Cintas adhesivas coloridas para decoración y etiquetado." },
  { name: "Tijeras Multiusos de Titanio", author: "Westcott", price: 7500, description: "Tijeras de alta durabilidad para cortes precisos y exigentes." },
  { name: "Portacinta Adhesiva con Cinta Transparente", author: "Scotch", price: 4500, description: "Dispositivo práctico con cinta incluida para cortes rápidos." },
  { name: "Goma Eva Negra (40 x 60 cm)", author: "Artel", price: 2000, description: "Lámina de goma eva de alta densidad para proyectos creativos." },
  { name: "Clip Metálico de Oficina (Caja 100 unidades)", author: "Bostitch", price: 1500, description: "Clips resistentes para organizar grandes volúmenes de papel." },
  { name: "Set de Notas Adhesivas en Forma de Estrella", author: "Post-it", price: 3000, description: "Notas adhesivas con diseño divertido para resaltar ideas importantes." },
  { name: "Base Cortante para Manualidades (A4)", author: "Olfa", price: 8000, description: "Base protectora para cortar materiales sin dañar superficies." },
  { name: "Cinta de Embalaje con Dispensador", author: "3M", price: 6000, description: "Cinta de embalaje de alta calidad con un dispensador ergonómico." },
  { name: "Set de Clips de Colores", author: "Maped", price: 3000, description: "Clips de colores vibrantes para uso escolar y de oficina." },
  { name: "Estuche Porta Notas Adhesivas", author: "Esselte", price: 5000, description: "Porta notas adhesivas compacto y reutilizable." },
  { name: "Caja Organizadora con Divisiones", author: "Sterilite", price: 8500, description: "Caja de plástico transparente para organizar herramientas de papelería." },
  { name: "Set de Pegamento Universal (3 tubos)", author: "UHU", price: 5000, description: "Set de pegamento versátil para todo tipo de materiales." },
  { name: "Pinzas para Documentos Grandes (Set de 6)", author: "Bostitch", price: 4500, description: "Pinzas metálicas para sujetar grandes cantidades de hojas." },
  { name: "Cinta Correctora Retráctil", author: "Tipp-Ex", price: 3000, description: "Cinta correctora con diseño retráctil para mayor comodidad." }
],

"Papel y Cartulina": [
  { name: "Hojas Blancas Tamaño Carta (500 unidades)", author: "Double A", price: 9000, description: "Paquete de papel blanco de alta calidad, ideal para impresión y escritura." },
  { name: "Hojas Blancas Tamaño Oficio (500 unidades)", author: "Navigator", price: 9500, description: "Papel blanco con acabado premium para documentos importantes." },
  { name: "Cartulina Blanca (50 x 70 cm)", author: "Canson", price: 1500, description: "Cartulina de alta gramaje para manualidades y proyectos escolares." },
  { name: "Cartulina de Colores (Pack 10 unidades)", author: "Artel", price: 5000, description: "Cartulina en una variedad de colores vibrantes, perfecta para proyectos creativos." },
  { name: "Hojas de Papel Kraft (Paquete 100 hojas)", author: "Papercraft", price: 4500, description: "Papel kraft resistente para embalaje, manualidades o decoración." },
  { name: "Papel Lustre (Pack 12 colores)", author: "Colorama", price: 2500, description: "Papel lustre brillante para proyectos escolares y decorativos." },
  { name: "Hojas de Papel Vegetal A4 (50 hojas)", author: "Winsor & Newton", price: 7000, description: "Papel translúcido para proyectos técnicos y artísticos." },
  { name: "Papel Fotográfico Glossy (50 hojas)", author: "HP", price: 12000, description: "Papel brillante para impresión de fotografías de alta calidad." },
  { name: "Papel Bond Tamaño Carta (500 hojas)", author: "Hammermill", price: 8500, description: "Papel bond para documentos de oficina y proyectos escolares." },
  { name: "Hojas de Papel Fluorescente (Pack 6 colores)", author: "Artel", price: 3000, description: "Papel brillante en colores fluorescentes, perfecto para letreros y anuncios." },
  { name: "Cuaderno de Bocetos (A4, 100 hojas)", author: "Artix", price: 8000, description: "Cuaderno con papel resistente, ideal para dibujar y bocetar." },
  { name: "Bloc de Papel Acuarela (A4, 20 hojas)", author: "Canson", price: 9500, description: "Papel texturizado para técnicas de acuarela y gouache." },
  { name: "Papel Crepé de Colores (10 rollos)", author: "ColorArt", price: 5000, description: "Papel crepé flexible para manualidades y decoraciones." },
  { name: "Hojas de Papel Reciclado (Paquete 100 hojas)", author: "GreenPaper", price: 6000, description: "Papel ecológico fabricado con materiales reciclados." },
  { name: "Rollo de Papel Kraft (1 metro)", author: "Papercraft", price: 1200, description: "Papel kraft en rollo, ideal para empaques y envolturas." },
  { name: "Bloc de Notas Adhesivas (Pack 4 colores)", author: "Post-it", price: 4000, description: "Bloc de notas adhesivas en colores llamativos para recordatorios." },
  { name: "Hojas Perforadas Tamaño A4 (Pack 100 hojas)", author: "Esselte", price: 5000, description: "Papel perforado para archivadores y carpetas de anillos." },
  { name: "Cuaderno Universitario con Espiral (100 hojas)", author: "Tilibra", price: 4500, description: "Cuaderno de alta calidad con espiral resistente para uso diario." },
  { name: "Cuaderno Cuadriculado Tamaño Carta (80 hojas)", author: "Oxford", price: 4200, description: "Cuaderno cuadriculado para matemáticas y estudios técnicos." },
  { name: "Papel Fotográfico Mate (50 hojas)", author: "Canon", price: 10000, description: "Papel fotográfico mate para impresión profesional." },
  { name: "Hojas de Papel Milimetrado (50 hojas)", author: "Staedtler", price: 2000, description: "Papel cuadriculado para diseño técnico y matemáticas." },
  { name: "Cartulina Negra (50 x 70 cm)", author: "Artel", price: 1500, description: "Cartulina negra de alto gramaje, ideal para contrastes y diseño gráfico." },
  { name: "Hojas de Papel Pergamino (Pack 20 hojas)", author: "PaperDirect", price: 7000, description: "Papel con textura de pergamino, perfecto para invitaciones y certificados." },
  { name: "Papel Etiqueta Adhesiva (A4, Pack 10 hojas)", author: "Avery", price: 5000, description: "Papel adhesivo para crear etiquetas personalizadas." },
  { name: "Hojas de Papel Mate (Pack 100 hojas)", author: "Esselte", price: 4500, description: "Papel mate multiuso para impresión y escritura." },
  { name: "Rollo de Papel Blanco para Envoltorio", author: "Papercraft", price: 2500, description: "Papel blanco en rollo para empaques y presentaciones elegantes." },
  { name: "Cartulina Fluorescente (Pack 5 colores)", author: "Artel", price: 3500, description: "Cartulina en colores fluorescentes para manualidades y señalización." },
  { name: "Papel Termolaminado Transparente (10 hojas)", author: "3M", price: 5500, description: "Papel laminado para proteger documentos importantes." },
  { name: "Papel Decorativo con Textura (Pack 5 hojas)", author: "ColorPaper", price: 6000, description: "Papel con diseños texturizados para proyectos especiales." },
  { name: "Cartulina Metálica Dorada", author: "Artel", price: 2000, description: "Cartulina metálica con acabado dorado para decoraciones elegantes." },
  { name: "Cartulina con Glitter (Pack 10 hojas)", author: "DecoCraft", price: 5000, description: "Cartulina brillante para proyectos de arte y manualidades." },
  { name: "Papel Adhesivo Vinílico (A4, Pack 5 hojas)", author: "Avery", price: 7000, description: "Papel adhesivo resistente al agua, ideal para etiquetas y gráficos." },
  { name: "Hojas de Papel Decorativo (Pack 20 hojas)", author: "Papercraft", price: 4500, description: "Papel con diseños coloridos para manualidades y scrapbooking." },
  { name: "Papel Kraft Ecológico (50 hojas)", author: "GreenPaper", price: 3500, description: "Papel kraft sostenible para proyectos ecológicos." },
  { name: "Cartulina con Relieve (A4, Pack 10 hojas)", author: "Artel", price: 5000, description: "Cartulina con diseños en relieve para invitaciones y proyectos." },
  { name: "Papel de Envoltorio con Diseño", author: "ColorWrap", price: 3000, description: "Papel decorativo para envolver regalos." },
  { name: "Cuaderno para Acuarela", author: "Winsor & Newton", price: 12000, description: "Cuaderno resistente al agua para técnicas de pintura." },
  { name: "Hojas de Papel Perlado (Pack 10 hojas)", author: "Papercraft", price: 7500, description: "Papel con acabado perlado para eventos especiales." },
  { name: "Cartulina Opaca (Pack 10 colores)", author: "ColorCraft", price: 4500, description: "Cartulina de colores opacos para manualidades y proyectos." },
  { name: "Bloc de Notas Autoadhesivas", author: "Post-it", price: 3500, description: "Notas adhesivas grandes y resistentes para oficina y hogar." },
  { name: "Hojas de Papel Metálico (Pack 5 colores)", author: "DecoCraft", price: 7000, description: "Papel metálico brillante para proyectos creativos." },
  { name: "Papel Adhesivo para Forrar Libros", author: "Avery", price: 4500, description: "Papel adhesivo transparente para proteger libros y cuadernos." },
  { name: "Papel Bond de Alta Calidad (100 hojas)", author: "Navigator", price: 7000, description: "Papel bond ideal para documentos importantes y presentaciones." },
  { name: "Cartulina Laminada (Pack 5 colores)", author: "DecoArt", price: 6000, description: "Cartulina laminada con colores vivos y resistentes." },
  { name: "Papel Kraft Reforzado (Rollo 2 metros)", author: "GreenWrap", price: 8500, description: "Papel kraft extra resistente para empaques pesados." },
  { name: "Cuaderno Cosido para Dibujo", author: "Artel", price: 4500, description: "Cuaderno con hojas gruesas para dibujo artístico." },
  { name: "Cartulina Mate en Tamaño Grande", author: "Canson", price: 7000, description: "Cartulina mate de gran tamaño para exposiciones y maquetas." }
],

"Arte y Manualidades": [
  { name: "Pinceles N°6 (Pack 5 unidades)", author: "Winsor & Newton", price: 6500, description: "Pinceles de alta calidad con cerdas suaves, ideales para pintura acrílica y óleo." },
  { name: "Set de Pintura Acrílica (12 colores)", author: "AcrylicMaster", price: 18000, description: "Colores vibrantes y duraderos para proyectos artísticos profesionales." },
  { name: "Paleta de Mezclas de Plástico", author: "Artel", price: 2500, description: "Paleta fácil de limpiar para mezclar pinturas." },
  { name: "Caja de Lápices Pastel Seco (24 unidades)", author: "Faber-Castell", price: 25000, description: "Lápices pastel de alta pigmentación para dibujos artísticos." },
  { name: "Caja de Acuarelas (24 colores)", author: "Winsor & Newton", price: 32000, description: "Set completo de acuarelas profesionales en tonos intensos." },
  { name: "Marcadores de Tela (Pack 6 colores)", author: "Artix", price: 9500, description: "Marcadores permanentes para personalizar ropa y accesorios." },
  { name: "Bastidor de Lienzo (40 x 50 cm)", author: "ColorArt", price: 12000, description: "Lienzo de algodón con bastidor de madera, listo para pintar." },
  { name: "Rodillo para Pintura en Tela", author: "CraftPro", price: 4500, description: "Herramienta ideal para aplicar pintura uniformemente sobre telas." },
  { name: "Barniz Acrílico Transparente", author: "DecoArt", price: 7000, description: "Barniz protector que da un acabado brillante o mate a tus proyectos." },
  { name: "Set de Pegamento para Manualidades", author: "Adherix", price: 5500, description: "Pegamento de secado rápido ideal para papel, madera y tela." },
  { name: "Pintura para Vidrio (6 colores)", author: "VitroArt", price: 10000, description: "Pintura resistente al agua para decorar vidrio y cerámica." },
  { name: "Masa para Modelar (5 colores)", author: "Play-Doh", price: 8000, description: "Masa no tóxica para proyectos creativos." },
  { name: "Pintura en Spray (Negro Mate)", author: "Rust-Oleum", price: 12000, description: "Pintura en spray para proyectos de decoración y manualidades." },
  { name: "Papel Decoupage (Pack 3 diseños)", author: "DecoCraft", price: 4500, description: "Papel decorativo para técnicas de decoupage." },
  { name: "Set de Gubias para Grabado", author: "CarveMaster", price: 11000, description: "Herramientas especializadas para tallado en madera y linóleo." },
  { name: "Láminas de Foamy (10 colores)", author: "FoamArt", price: 7500, description: "Foamy flexible para manualidades y decoraciones." },
  { name: "Set de Cintas de Tela Decorativa (5 rollos)", author: "DecoRibbon", price: 9500, description: "Cintas coloridas para envolver regalos y manualidades." },
  { name: "Glitter en Polvo (Pack 6 colores)", author: "ShinyCraft", price: 3000, description: "Glitter fino para agregar brillo a cualquier proyecto." },
  { name: "Set de Sellos y Tintas (15 piezas)", author: "StampArt", price: 15000, description: "Sellos temáticos con tintas en varios colores para scrapbooking." },
  { name: "Bloc de Papel para Scrapbooking (20 hojas)", author: "ColorPaper", price: 12000, description: "Papel decorativo para crear álbumes y tarjetas personalizadas." },
  { name: "Cortador de Papel con Formas", author: "CraftPro", price: 8000, description: "Cortador para crear figuras decorativas en papel." },
  { name: "Pintura Textil (6 colores)", author: "DecoFabric", price: 10000, description: "Pintura permanente para decorar ropa y accesorios de tela." },
  { name: "Set de Ojos Móviles (Pack 100)", author: "CraftyEyes", price: 2000, description: "Ojos plásticos para proyectos de manualidades infantiles." },
  { name: "Alambre para Manualidades (10 metros)", author: "WireCraft", price: 5000, description: "Alambre flexible para crear figuras y estructuras." },
  { name: "Cortador de Espuma", author: "FoamCutter", price: 15000, description: "Herramienta eléctrica para cortar foamy y poliestireno." },
  { name: "Set de Brochas (5 piezas)", author: "Artix", price: 6000, description: "Brochas de diferentes tamaños para manualidades y pintura." },
  { name: "Set de Moldes de Silicona", author: "CraftMolds", price: 9000, description: "Moldes reutilizables para crear figuras con resina o yeso." },
  { name: "Resina Epóxica Transparente (1 litro)", author: "ResinCraft", price: 25000, description: "Resina de alta resistencia para proyectos de manualidades y joyería." },
  { name: "Set de Plumas Decorativas (10 unidades)", author: "ColorPlume", price: 3000, description: "Plumas de colores vivos para adornos y decoraciones." },
  { name: "Tela para Bastidor (50 x 70 cm)", author: "TextileArt", price: 10000, description: "Tela de lino para bordado y manualidades." },
  { name: "Láminas de Corcho Adhesivo", author: "DecoCraft", price: 7000, description: "Láminas ideales para crear pizarras o decoraciones." },
  { name: "Kit de Macramé (Hilos y Patrones)", author: "MacraméMaster", price: 15000, description: "Todo lo necesario para crear decoraciones de macramé." },
  { name: "Set de Pinceles para Detalles", author: "Winsor & Newton", price: 12000, description: "Pinceles ultrafinos para detalles precisos en pintura." },
  { name: "Tijeras de Diseño con Patrones", author: "CraftScissors", price: 8000, description: "Tijeras que cortan patrones decorativos en papel y tela." },
  { name: "Láminas de Tela Adhesiva", author: "FabricStick", price: 7500, description: "Láminas decorativas para manualidades textiles." },
  { name: "Set de Pegatinas Decorativas (50 piezas)", author: "StickerWorld", price: 6000, description: "Pegatinas temáticas para scrapbooking y decoraciones." },
  { name: "Spray Adhesivo para Manualidades", author: "GluePro", price: 10000, description: "Adhesivo en spray para aplicaciones rápidas y uniformes." },
  { name: "Set de Perlas para Decorar (500 piezas)", author: "BeadCraft", price: 4500, description: "Perlas de colores para manualidades y bisutería." },
  { name: "Marcadores Permanentes para Cerámica (6 colores)", author: "CeramicMark", price: 9500, description: "Marcadores resistentes al calor para decorar cerámica." },
  { name: "Set de Pegamento con Purpurina (Pack 5)", author: "GlitterGlue", price: 3000, description: "Pegamento con brillo para proyectos infantiles y creativos." },
  { name: "Láminas de Acrílico para Corte Láser", author: "AcrylicMaster", price: 25000, description: "Láminas resistentes para grabado y corte con láser." },
  { name: "Set de Esténciles para Pintura", author: "StencilPro", price: 8000, description: "Plantillas reutilizables para crear diseños precisos." },
  { name: "Moldes para Velas Artesanales", author: "CandleCraft", price: 12000, description: "Moldes resistentes al calor para hacer velas personalizadas." },
  { name: "Ceras para Sellos Personalizados", author: "WaxCraft", price: 7000, description: "Ceras en varios colores para decoración de sobres y cartas." },
  { name: "Piedras Decorativas para Manualidades", author: "GemCraft", price: 8000, description: "Piedras brillantes para adornos y proyectos artísticos." },
  { name: "Rotulador de Resina para Detalles", author: "ResinMark", price: 9000, description: "Herramienta precisa para trabajar con resina y decoraciones." },
  { name: "Hilos para Crochet (Pack 5 colores)", author: "CrochetMaster", price: 12000, description: "Hilos resistentes para proyectos de tejido y bordado." }
],

  "Útiles Escolares": [
  { name: "Cuadernos Universitarios (Pack de 5)", author: "Tilibra", price: 9500, description: "Cuadernos de alta calidad con tapa dura y hojas cuadriculadas." },
  { name: "Lápices de Grafito HB (Caja de 12)", author: "Faber-Castell", price: 3500, description: "Lápices resistentes, ideales para uso escolar y dibujo técnico." },
  { name: "Estuche Escolar Triple Compartimento", author: "Totto", price: 12000, description: "Estuche con múltiples compartimentos para organizar útiles." },
  { name: "Pegamento en Barra (Pack 3 unidades)", author: "Pritt", price: 4000, description: "Pegamento de secado rápido y seguro para niños." },
  { name: "Tijeras Punta Redonda para Niños", author: "Maped", price: 2500, description: "Tijeras con mango ergonómico y puntas redondeadas para seguridad." },
  { name: "Caja de Lápices de Colores (24 colores)", author: "Faber-Castell", price: 5500, description: "Lápices de colores brillantes y fáciles de mezclar." },
  { name: "Set de Regla, Escuadra y Transportador", author: "Staedtler", price: 4500, description: "Kit esencial para geometría y matemáticas." },
  { name: "Goma de Borrar para Lápiz y Tinta", author: "Pelikan", price: 1200, description: "Goma de alta calidad que no daña el papel." },
  { name: "Sacapuntas Doble con Depósito", author: "Maped", price: 2000, description: "Sacapuntas portátil con dos tamaños y depósito para residuos." },
  { name: "Bolígrafos Azul, Negro y Rojo (Pack 3 unidades)", author: "Bic", price: 1800, description: "Bolígrafos de tinta suave y duradera." },
  { name: "Cartuchera de Tela Estampada", author: "Kipling", price: 10000, description: "Cartuchera resistente con diseños atractivos para niños." },
  { name: "Cinta Adhesiva Escolar Transparente", author: "Scotch", price: 1200, description: "Cinta adhesiva versátil para uso diario." },
  { name: "Marcadores Fluorescentes (Pack de 4)", author: "Stabilo", price: 4500, description: "Marcadores de colores vivos ideales para destacar texto." },
  { name: "Mochila Escolar con Compartimentos", author: "Head", price: 25000, description: "Mochila con espacio para libros, laptop y útiles escolares." },
  { name: "Rotulador para Pizarras Blancas", author: "Expo", price: 1800, description: "Rotulador de tinta fácil de borrar para pizarras blancas." },
  { name: "Papel Lustre de Colores (Paquete 10 hojas)", author: "Artel", price: 2000, description: "Hojas de papel lustre en colores vibrantes para manualidades." },
  { name: "Compás Escolar con Lápiz Incluido", author: "Staedtler", price: 5000, description: "Compás de precisión para geometría." },
  { name: "Set de Etiquetas Adhesivas Escolares", author: "AdhesivePro", price: 3000, description: "Etiquetas personalizables para marcar útiles y libros." },
  { name: "Cuaderno de Dibujo A4", author: "Artix", price: 4000, description: "Cuaderno con hojas gruesas ideales para lápices y acuarelas." },
  { name: "Caja de Témperas (12 colores)", author: "ColorArt", price: 7500, description: "Témperas de colores brillantes, no tóxicas y lavables." },
  { name: "Bloc de Notas Adhesivas (Pack 5)", author: "Post-it", price: 5000, description: "Bloc de notas adhesivas para recordatorios y tareas." },
  { name: "Juego de Perforadora y Engrapadora", author: "Rexel", price: 10000, description: "Kit de oficina compacto para uso escolar y en casa." },
  { name: "Papel de Carpeta Universitaria (100 hojas)", author: "Double A", price: 3500, description: "Hojas perforadas ideales para carpetas escolares." },
  { name: "Estuche de Goma Eva con Diseños", author: "FoamArt", price: 8000, description: "Estuche con compartimentos de goma eva, resistente y colorido." },
  { name: "Funda Protectora para Cuadernos (Pack 3)", author: "CoverPro", price: 3500, description: "Fundas transparentes para proteger cuadernos y libros." },
  { name: "Juego de Stickers Temáticos", author: "StickerWorld", price: 3000, description: "Stickers decorativos para personalizar cuadernos y agendas." },
  { name: "Caja de Clips y Pinzas (100 unidades)", author: "Staples", price: 2500, description: "Accesorios básicos para organización de papeles." },
  { name: "Portafolio Plástico con Cierre", author: "OfficePro", price: 5000, description: "Portafolio resistente para transportar documentos y tareas." },
  { name: "Marcadores de Punta Fina (12 colores)", author: "Faber-Castell", price: 5500, description: "Marcadores ideales para trazos precisos y dibujo técnico." },
  { name: "Guía de Matemáticas Escolar", author: "Ediciones SM", price: 9000, description: "Libro guía para reforzar habilidades matemáticas en casa." },
  { name: "Set de Calcomanías Infantiles", author: "FunStickers", price: 2000, description: "Calcomanías temáticas para decorar cuadernos y manualidades." },
  { name: "Pasta Plástica para Archivar", author: "Esselte", price: 4500, description: "Pasta resistente con capacidad para 100 hojas." },
  { name: "Agenda Escolar 2024", author: "Tilibra", price: 8500, description: "Agenda compacta para organizar tareas y horarios." },
  { name: "Set de Plumones de Colores Lavables", author: "Crayola", price: 6000, description: "Plumones seguros y lavables, ideales para niños." },
  { name: "Bolsa de Goma Eva con Glitter (5 colores)", author: "FoamWorld", price: 7000, description: "Material decorativo para proyectos escolares y manualidades." },
  { name: "Set de Clips Decorativos", author: "DecoClips", price: 3000, description: "Clips de colores con formas divertidas." },
  { name: "Cinta Doble Faz Escolar", author: "Scotch", price: 2000, description: "Cinta adhesiva versátil para manualidades y proyectos escolares." },
  { name: "Caja de Barras de Silicona (Pack 10)", author: "GlueSticks", price: 4500, description: "Barras compatibles con pistolas de silicona estándar." },
  { name: "Set de Reglas Transparentes", author: "Maped", price: 5000, description: "Juego de reglas de diferentes tamaños para geometría." },
  { name: "Rotuladores Borrables para Pizarra", author: "Expo", price: 8000, description: "Rotuladores de tinta borrable para pizarras blancas." },
  { name: "Set de Gomas de Borrar Decorativas", author: "CuteErase", price: 2000, description: "Gomas de borrar en formas y colores divertidos." },
  { name: "Caja de Tizas Blancas y de Colores", author: "Artel", price: 4000, description: "Tizas de calidad para pizarras tradicionales." },
  { name: "Juego de Lápices con Estampados", author: "PencilWorld", price: 2500, description: "Lápices con diseños divertidos, ideales para niños." },
  { name: "Libro de Ciencias Naturales Escolar", author: "Santillana", price: 9500, description: "Libro de texto para apoyar el aprendizaje escolar." },
  { name: "Set de Botones Decorativos para Proyectos", author: "ButtonCraft", price: 3500, description: "Botones de colores para manualidades y costura." },
  { name: "Reloj Despertador Escolar", author: "ClockPro", price: 15000, description: "Reloj compacto para ayudar a los niños a gestionar su tiempo." },
  { name: "Marcadores de Pizarra Magnéticos", author: "MagneticMark", price: 9000, description: "Rotuladores con imanes para almacenar en pizarras blancas." },
  { name: "Pegatinas de Premios para Profesores", author: "RewardStickers", price: 3000, description: "Pegatinas temáticas para reconocer logros de los estudiantes." }
],

"Oficina y Organización": [
  { name: "Archivador de Palanca A4", author: "Esselte", price: 8500, description: "Archivador con palanca metálica para almacenar documentos de forma segura." },
  { name: "Caja Organizadora Multiusos", author: "Sterilite", price: 12000, description: "Caja de plástico resistente con tapa, ideal para organizar útiles y documentos." },
  { name: "Perforadora Metálica de 2 Agujeros", author: "Rexel", price: 7500, description: "Perforadora de acero inoxidable para documentos." },
  { name: "Engrapadora de Oficina", author: "Swingline", price: 8500, description: "Engrapadora de alta capacidad, ideal para uso en oficina." },
  { name: "Portadocumentos Transparente A4", author: "Maped", price: 3000, description: "Portadocumentos plástico con cierre para transportar papeles." },
  { name: "Bandeja Organizadora de Escritorio (3 Niveles)", author: "Fellowes", price: 15000, description: "Bandeja apilable para organizar papeles y carpetas." },
  { name: "Agenda Profesional 2024", author: "Tilibra", price: 9000, description: "Agenda elegante con diseño minimalista y espacio para planificación diaria." },
  { name: "Caja de Clips Metálicos (100 unidades)", author: "Staples", price: 1800, description: "Clips metálicos resistentes para sujetar documentos." },
  { name: "Carpeta de Plástico con Botón", author: "Duraplast", price: 2500, description: "Carpeta compacta y resistente con cierre a presión." },
  { name: "Bolígrafos de Tinta Gel (Pack 3)", author: "Pilot", price: 6000, description: "Bolígrafos suaves con tinta de secado rápido, colores azul, negro y rojo." },
  { name: "Organizador de Escritorio Modular", author: "Kikkerland", price: 12000, description: "Organizador multifuncional con compartimentos para útiles y accesorios." },
  { name: "Calculadora Científica", author: "Casio", price: 18000, description: "Calculadora avanzada para cálculos complejos y científicos." },
  { name: "Portafolio de Tela con Cierre", author: "Samsonite", price: 20000, description: "Portafolio robusto con compartimentos para documentos y laptop." },
  { name: "Lámpara de Escritorio LED con Brillo Ajustable", author: "Philips", price: 25000, description: "Lámpara compacta y moderna con tres niveles de brillo." },
  { name: "Tablero de Corcho con Marco de Madera", author: "OfficeWorks", price: 8500, description: "Tablero ideal para notas, recordatorios y fotos." },
  { name: "Rotuladores Multiuso (Pack de 4)", author: "Sharpie", price: 5000, description: "Rotuladores resistentes al agua con punta fina." },
  { name: "Carpeta de Argollas A4", author: "Esselte", price: 3500, description: "Carpeta con argollas metálicas y diseño duradero." },
  { name: "Post-it Notas Adhesivas (Pack 6 colores)", author: "3M", price: 6000, description: "Notas adhesivas en colores brillantes para organización." },
  { name: "Cinta Adhesiva Transparente (Pack de 3)", author: "Scotch", price: 2500, description: "Cinta adhesiva de alta calidad para oficina." },
  { name: "Grapas para Engrapadora (Caja 1000)", author: "Bostitch", price: 1200, description: "Grapas metálicas resistentes compatibles con engrapadoras estándar." },
  { name: "Rotulador para Pizarras (Negro, Azul, Rojo)", author: "Expo", price: 2500, description: "Rotuladores borrables de alta calidad." },
  { name: "Juego de Carpetas Colgantes (Pack 5)", author: "Duraflex", price: 15000, description: "Carpetas para organizar archivos en cajoneras." },
  { name: "Bolsa de Gomas Elásticas", author: "Staples", price: 1800, description: "Gomas resistentes y versátiles para múltiples usos." },
  { name: "Set de Marcadores para Pizarra", author: "Expo", price: 6500, description: "Marcadores borrables con tinta de larga duración." },
  { name: "Dispenser de Cinta Adhesiva", author: "3M", price: 3000, description: "Soporte para cinta adhesiva con corte preciso." },
  { name: "Archivador Expandible A4", author: "OfficeWorks", price: 8000, description: "Archivador compacto con separadores para documentos." },
  { name: "Clip Magnético para Notas", author: "Magneto", price: 1200, description: "Clip con imán para sujetar papeles en superficies metálicas." },
  { name: "Cortador de Papel Portátil", author: "Dahle", price: 10000, description: "Cortador compacto con cuchilla afilada para precisión." },
  { name: "Rotulador Permanente de Punta Gruesa", author: "Sharpie", price: 2000, description: "Rotulador de alta calidad para etiquetas y señalización." },
  { name: "Organizador de Cajones", author: "InterDesign", price: 7500, description: "Organizador modular para útiles pequeños." },
  { name: "Grapadora de Sobremesa", author: "Rapesco", price: 6500, description: "Grapadora de alta capacidad para uso intensivo." },
  { name: "Caja de Almacenamiento Transparente", author: "Rubbermaid", price: 18000, description: "Caja resistente con tapa para guardar documentos o accesorios." },
  { name: "Set de Etiquetas Adhesivas para Archivos", author: "Avery", price: 3000, description: "Etiquetas duraderas para clasificar carpetas y archivadores." },
  { name: "Bolsas Plásticas para Documentos (Pack de 10)", author: "Esselte", price: 3500, description: "Fundas resistentes para proteger documentos de humedad." },
  { name: "Cajonera Metálica para Oficina", author: "Fellowes", price: 45000, description: "Cajonera con cerradura para documentos y útiles de oficina." },
  { name: "Portaminas Metálico con Repuestos", author: "Rotring", price: 12000, description: "Portaminas ergonómico con alta precisión." },
  { name: "Tijeras para Oficina", author: "Fiskars", price: 3000, description: "Tijeras con hojas afiladas de acero inoxidable." },
  { name: "Set de Sobres de Papel (Pack de 50)", author: "Mead", price: 4000, description: "Sobres resistentes para correspondencia y organización." },
  { name: "Cuaderno Profesional A4", author: "Moleskine", price: 15000, description: "Cuaderno elegante con hojas de alta calidad." },
  { name: "Set de Cintas Washi Tape", author: "DecoTape", price: 5000, description: "Cintas decorativas ideales para organización y proyectos creativos." },
  { name: "Soporte para Laptop Ajustable", author: "ErgoDesk", price: 25000, description: "Soporte ergonómico para laptops de hasta 17 pulgadas." },
  { name: "Plumón Borrable Magnético", author: "MagneticBoard", price: 3500, description: "Plumón con imán para pizarras blancas." },
  { name: "Set de Bandas Elásticas", author: "Duraflex", price: 2500, description: "Bandas resistentes para clasificar documentos." },
  { name: "Caja para Documentos con Cerradura", author: "SafeBox", price: 22000, description: "Caja de almacenamiento segura con llave." },
  { name: "Portafolio Expandible para Proyectos", author: "Duraplast", price: 12000, description: "Portafolio resistente con varios compartimentos internos." },
  { name: "Notas Adhesivas Extra Grandes", author: "Post-it", price: 6500, description: "Notas adhesivas para ideas y recordatorios destacados." },
  { name: "Set de Plumas Fuente Profesionales", author: "Parker", price: 25000, description: "Plumas elegantes con tinta fluida y presentación premium." },
  { name: "Cinta Doble Faz Profesional", author: "Scotch", price: 4000, description: "Cinta adhesiva de doble cara con alta adherencia." },
  { name: "Láminas Plastificadas para Documentos", author: "LaminPro", price: 5000, description: "Láminas resistentes para proteger documentos importantes." }
],

"Didácticos y Juegos": [
  { name: "Rompecabezas de Madera (100 Piezas)", author: "DidacticFun", price: 8500, description: "Rompecabezas de madera con temática de animales." },
  { name: "Bloques de Construcción (50 Piezas)", author: "Lego", price: 25000, description: "Set de bloques coloridos para fomentar la creatividad." },
  { name: "Memorice Animales", author: "Clementoni", price: 4500, description: "Juego de memoria con ilustraciones de animales." },
  { name: "Juego de Ensamble Magnético", author: "Magformers", price: 32000, description: "Piezas magnéticas para construir diferentes estructuras." },
  { name: "Set de Plastilina Didáctica", author: "Play-Doh", price: 9000, description: "Set con herramientas y colores para modelado." },
  { name: "Juego de Tangram Clásico", author: "DidacticGames", price: 5000, description: "Set de figuras geométricas para resolver puzzles." },
  { name: "Dominó de Colores para Niños", author: "Fisher-Price", price: 7000, description: "Dominó colorido diseñado para niños pequeños." },
  { name: "Set de Pintura con Acuarelas y Pinceles", author: "Artel", price: 8500, description: "Incluye acuarelas, pinceles y hojas para pintar." },
  { name: "Juego de Matemáticas Básicas", author: "BrainBox", price: 12000, description: "Juego educativo para aprender sumas y restas." },
  { name: "Pizarra Magnética con Letras y Números", author: "Crayola", price: 15000, description: "Pizarra magnética para aprender jugando." },
  { name: "Set de Hilos y Perlas para Manualidades", author: "CreativeKids", price: 10000, description: "Incluye hilos y perlas para hacer collares y pulseras." },
  { name: "Juego de Palitos Chinos", author: "ClassicGames", price: 4000, description: "Juego clásico para trabajar habilidades motoras." },
  { name: "Letras y Números de Espuma Adhesiva", author: "FoamCraft", price: 3500, description: "Letras y números para proyectos creativos." },
  { name: "Juego de Construcción 3D", author: "Tente", price: 20000, description: "Construcción de figuras tridimensionales." },
  { name: "Set de Sellos con Tinta Lavable", author: "Crayola", price: 8500, description: "Sellos temáticos con tinta segura para niños." },
  { name: "Abaco de Madera para Contar", author: "Melissa & Doug", price: 7500, description: "Abaco con colores llamativos para aprender matemáticas." },
  { name: "Caja Didáctica Montessori", author: "MontessoriKids", price: 20000, description: "Incluye diferentes herramientas educativas." },
  { name: "Puzzle de Mapamundi", author: "Clementoni", price: 9500, description: "Rompecabezas educativo con mapa del mundo." },
  { name: "Reloj Didáctico de Madera", author: "DidacticFun", price: 8000, description: "Ideal para enseñar la hora a los niños." },
  { name: "Libro de Actividades con Pegatinas", author: "Disney", price: 6500, description: "Libro con actividades creativas y pegatinas temáticas." },
  { name: "Set de Instrumentos Musicales para Niños", author: "Bontempi", price: 25000, description: "Incluye tambor, maracas y xilófono." },
  { name: "Caja de Experimentos Científicos", author: "CienciaLab", price: 18000, description: "Set para realizar experimentos fáciles en casa." },
  { name: "Juego de Mesa Didáctico: Adivina el Animal", author: "Clementoni", price: 11000, description: "Juego interactivo para aprender sobre animales." },
  { name: "Set de Cubos de Madera con Letras", author: "Melissa & Doug", price: 8500, description: "Cubos para formar palabras y jugar." },
  { name: "Tablero de Lógica con Fichas", author: "SmartGames", price: 15000, description: "Juego de lógica para resolver desafíos mentales." },
  { name: "Cubo Rubik 3x3", author: "Rubik's", price: 8500, description: "Clásico juego de ingenio y resolución de problemas." },
  { name: "Juego de Encaje de Figuras", author: "Fisher-Price", price: 7000, description: "Ideal para desarrollar habilidades motoras." },
  { name: "Set de Manualidades con Papel", author: "OrigamiKids", price: 5500, description: "Incluye papel de colores y guías para plegado." },
  { name: "Juego de Pesca Magnética", author: "FishingFun", price: 8500, description: "Juego interactivo para mejorar la coordinación mano-ojo." },
  { name: "Set de Tarjetas Didácticas (Números y Letras)", author: "BrainyKids", price: 6000, description: "Tarjetas resistentes para aprendizaje temprano." },
  { name: "Pizarra Mágica Borrable", author: "MagicBoard", price: 12000, description: "Pizarra reutilizable para dibujar y escribir." },
  { name: "Set de Figuras de Animales de Plástico", author: "WildLife", price: 15000, description: "Figuras detalladas de animales para juegos educativos." },
  { name: "Juego de Dominó Clásico", author: "ClassicGames", price: 4500, description: "Juego familiar para niños y adultos." },
  { name: "Set de Bloques de Construcción XL", author: "MegaBloks", price: 18000, description: "Bloques grandes para niños pequeños." },
  { name: "Juego de Damas y Ajedrez", author: "ClassicGames", price: 8500, description: "Tablero reversible con piezas para ambos juegos." },
  { name: "Puzzles Infantiles (Set de 3)", author: "DidacticFun", price: 8500, description: "Puzzles fáciles con temas infantiles." },
  { name: "Libro Sensorial de Tela", author: "BabyTouch", price: 12000, description: "Libro con texturas y actividades para bebés." },
  { name: "Set de Marcadores Lavables para Niños", author: "Crayola", price: 7500, description: "Marcadores seguros con colores vibrantes." },
  { name: "Juego Didáctico de Números y Figuras", author: "BrainBox", price: 10000, description: "Juego interactivo para aprender formas y matemáticas." },
  { name: "Set de Botones Didácticos para Encaje", author: "SkillKids", price: 6500, description: "Incluye botones grandes para encajar en plantillas." },
  { name: "Kit de Dinosaurios Armables", author: "JurassicFun", price: 15000, description: "Dinosaurios desmontables para aprender jugando." },
  { name: "Set de Cartas Educativas en Inglés", author: "BrainBox", price: 12000, description: "Tarjetas didácticas para aprender inglés." },
  { name: "Juego de Ensamble Mecánico", author: "Build&Play", price: 20000, description: "Incluye herramientas y piezas para construir vehículos." },
  { name: "Microscopio para Niños con Accesorios", author: "CienciaLab", price: 30000, description: "Microscopio educativo con aumentos y muestras." },
  { name: "Globo Terráqueo Interactivo", author: "EduGlobe", price: 25000, description: "Globo con información geográfica y juegos interactivos." },
  { name: "Set de Letras y Números Magnéticos", author: "Magneto", price: 8500, description: "Letras y números magnéticos para usar en pizarras." },
  { name: "Caja de Cubos Sensoriales", author: "BabySense", price: 12000, description: "Cubos suaves con texturas y sonidos." }
]
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