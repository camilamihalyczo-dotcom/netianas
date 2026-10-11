require('dotenv').config();
const pool = require('./pool');

// ── NETIANAS ──────────────────────────────────────────────────────────────────
const NETIANAS = [
  { letra:'A', alias:'Artivista',     nombre_libro:'Pertenecientes a Microsoft',
    descripcion:'Atrapadas en las cadenas del sistema. Leen esteganográficamente el poder oculto en el software.',
    cuerpo:'Viven bajo papá Microsoft. El sistema operativo como dispositivo patriarcal. La ideología viaja en el código, invisible como el aire, hegemónica como la gravedad. La netiana perteneciente a Microsoft surge desde el limen del mismo sistema que la contiene. Lee lo ilegible. Advierte el peligro que se mimetiza con el paisaje acostumbrado.',
    tags:['poder corporativo','esteganografía','limen','patriarcado digital','software libre','vigilancia','biopolítica','Haraway','cuerpo-máquina','cyborg','frontera','algoritmo','dato','academia','legitimidad'] },

  { letra:'B', alias:'Buscadora',     nombre_libro:'Latentes',
    descripcion:'La pantalla como jardín secreto. El doble vector: exceso de lo virtual / búsqueda de lo real.',
    cuerpo:'¿Qué internauta no lleva una netiana dentro? La pantalla como hogar íntimo, como jardín secreto donde caer lejos del cuerpo. El maquillaje como cirugía del alma. La netiana latente vive en la tensión entre el exceso de virtualidad y la insuficiencia de lo real.',
    tags:['pantalla','jardín secreto','virtualidad','cuerpo','Kristeva','presencia','efímero'] },

  { letra:'C', alias:'Cyborg',        nombre_libro:'Inventadas',
    descripcion:'No se nace netiana: se hace. Cuerpos-texto, performatividad, desidentificación sexual.',
    cuerpo:'No precisa de cuerpo virtual antropomorfizado. No se nace netiana: se hace netiana. Las netianas inventadas son ficción que se produce en el mismo territorio del discurso que pretende modificar. La performatividad (Butler) opera: el género se enuncia y al enunciarse se realiza.',
    tags:['Butler','performatividad','cuerpo-texto','ficción','desidentificación','cuerpo','devenir','identidad','Haraway','cyborg','posthumano','cuerpo-máquina','teatralidad digital','avatar','queer','no-normativo'] },

  { letra:'D', alias:'Doméstica',     nombre_libro:'Prosopon',
    descripcion:'La máscara griega. Identidad como actuación. El avatar como puesta en escena del yo.',
    cuerpo:'Prosopon: la máscara del teatro griego que da nombre a la persona. Online, toda presencia es máscara. Postmascarada. El lugar donde el cansancio de representar permite, finalmente, ser.',
    tags:['máscara','avatar','representación','performatividad','teatralidad digital','identidad','Kristeva','jardín secreto','virtualidad','cuerpo-texto','Butler','presencia','identidad online','formato'] },

  { letra:'E', alias:'Esteganógrafa', nombre_libro:'Cyborgs',
    descripcion:'Herederas de Haraway. La frontera borrosa entre cuerpo y máquina como posición política.',
    cuerpo:'Heredera directa del Manifiesto Cyborg de Donna Haraway. El cyborg: comprometido con la parcialidad, la ironía, la intimidad y la perversidad. Infieles a su parentesco patriarcal. La netiana cyborg habita la frontera entre lo orgánico y lo digital sin nostalgia por ninguno de los dos lados.',
    tags:['Haraway','cyborg','posthumano','cuerpo-máquina','frontera','cuerpo','vigilancia','biopolítica','esteganografía','devenir','identidad','cuerpo-texto','devenir-animal'] },

  { letra:'F', alias:'Flâneuse',      nombre_libro:'«Fabulosas»',
    descripcion:'Lo que el patriarcado no puede clasificar. Irrupción de lo fantástico y lo no-normativo.',
    cuerpo:'Las fabulosas no caben en ninguna categoría. Son lo que desborda, lo que excede. Herederas del etcétera de Borges. Su existencia es una grieta en el sistema.',
    tags:['queer','exceso','no-normativo','Borges','ficción','ironía','etcétera'] },

  { letra:'G', alias:'Geek',          nombre_libro:'Google',
    descripcion:'Sujeto de la vigilancia algorítmica. Identidad reducida a dato, búsqueda, perfil.',
    cuerpo:'La netiana Google existe como conjunto de búsquedas. Su identidad: un historial, un perfil, una cookie. Sujeto que se produce en la mirada del algoritmo. La vigilancia como servicio. El dato como cuerpo nuevo.',
    tags:['algoritmo','vigilancia','dato','biopolítica','poder corporativo','identidad','software libre','meritocracia'] },

  { letra:'H', alias:'Hacktivista',   nombre_libro:'Incluidas en esta clasificación',
    descripcion:'Giro autoconsciente: la netiana sabe que está siendo taxonomizada. Lo subvierte.',
    cuerpo:'El momento en que la taxonomía se mira a sí misma y ríe. Performatividad consciente. Si todo intento de clasificarme me constituye, que sea yo quien lo haga primero.',
    tags:['metaficción','ironía','performatividad','autoconciencia','Borges','archivo','Butler','representación','teatralidad digital','no-normativo','máscara','tipografía','academia','formato','software libre'] },

  { letra:'I', alias:'Invisible',     nombre_libro:'Chateadoras compulsivas',
    descripcion:'El chat como desbordamiento. Tiempo disuelto, identidad proliferante, presencia sin cuerpo.',
    cuerpo:'El chat como modo de existencia. Las netianas chateadoras pasan más tiempo siendo otras que siendo ellas mismas. La identidad prolifera, se multiplica, se contradice. El tiempo de conexión supera al tiempo offline.',
    tags:['multiplicidad','identidad online','presencia','pantalla','tiempo','identidad','Kristeva','jardín secreto','desidentificación','máscara','dato','exceso','efímero','indeterminación'] },

  { letra:'J', alias:'Jinetera',      nombre_libro:'Incontables',
    descripcion:'La multiplicidad como resistencia. Lo que no puede ser capturado por ningún sistema de conteo.',
    cuerpo:'Las incontables son lo que excede toda estadística, todo censo, toda métrica de plataforma. Resistencia por multiplicidad. Como los rizomas: sin principio ni fin.',
    tags:['multiplicidad','rizoma','líneas de fuga','Deleuze','incontabilidad','devenir','avatar','desidentificación','queer','frontera','algoritmo','apertura','devenir-animal','identidad online','indeterminación'] },

  { letra:'K', alias:'Karaokista',    nombre_libro:'Descritas en Times New Roman',
    descripcion:'La tipografía como ideología. El formato académico como dispositivo de poder invisible.',
    cuerpo:'Times New Roman: la letra del saber legítimo. La netiana descrita en Times New Roman requiere ser validada por el discurso académico o institucional para poder existir. La forma como contenido ideológico.',
    tags:['tipografía','academia','legitimidad','poder corporativo','formato','archivo','identidad','representación','metaficción','autoconciencia','meritocracia'] },

  { letra:'L', alias:'Lurker',        nombre_libro:'Etcétera',
    descripcion:'El etcétera como apertura radical. La lista nunca se cierra. Siempre hay más.',
    cuerpo:'El etcétera de Borges, recuperado por Zafra: apertura radical que impide el cierre. La netiana etcétera es la que siempre falta, la que viene después. La taxonomía como promesa incumplible.',
    tags:['apertura','Borges','indeterminación','líneas de fuga','etcétera','archivo','ironía','metaficción','autoconciencia','tipografía','rizoma'] },

  { letra:'M', alias:'Multitud',      nombre_libro:'Que entran en Silicon Valley',
    descripcion:'La ilusión meritocrática. La mujer tech como anomalía tolerada por el sistema.',
    cuerpo:'La netiana que entra en Silicon Valley descubre que el garaje era solo de chicos. Ingresan como anomalía, se quedan como excepción que confirma la regla. Su presencia normaliza sin transformar.',
    tags:['poder corporativo','meritocracia','patriarcado digital','limen','software libre','legitimidad','incontabilidad'] },

  { letra:'N', alias:'Nómade',        nombre_libro:'Que viven lo que una mosca',
    descripcion:'Efímera duración de las identidades online. Devenir-mosca deleuziano. Obsolescencia del sujeto.',
    cuerpo:'Las que viven lo que una mosca: la efímera duración de los perfiles, las identidades online. Devenir-animal, devenir-molecular. Una netiana de hace unos meses deja de estar a la moda.',
    tags:['Deleuze','devenir-animal','efímero','multiplicidad','tiempo','devenir','posthumano','virtualidad','identidad online','apertura','etcétera','indeterminación','rizoma','exceso'] },
];

// ── REFERENTES (sample — first 3 per netiana for brevity, full list in seed_refs.js) ──
// Maps netiana letra → array of referentes
const REFERENTES = {
  A: [
    { titulo:'Mujeres Públicas', subtitulo:['Argentina','(colectivo)','(latinoamericana)','(artista)','(performance)','2003–'], cuerpo:'Intervenciones visuales feministas en espacio público y digital, apropiación del lenguaje publicitario y propagandístico.', imagen:'a-1-mujeres.jpg' },
    { titulo:'#NiUnaMenos', subtitulo:['Argentina','(colectivo)','(latinoamericana)','2015–'], cuerpo:'Como práctica de artivismo digital colectivo: el hashtag como obra distribuida, la red como territorio político.', imagen:'a-2-niunamenos.jpg' },
    { titulo:'Línea Peluda', subtitulo:['Argentina','(colectivo)','(latinoamericana)','(artista)'], cuerpo:'Colectivo argentino de ilustradoras feministas. Sus creaciones circulan libremente por redes sociales como herramienta de activismo gráfico descentralizado.', imagen:'a-3-lineapeluda.gif' },
    { titulo:'Blank Noise Project', subtitulo:['India','(colectivo)','(asiática)','(artista)'], cuerpo:'Archivo digital donde mujeres indias documentaban y mapeaban situaciones de acoso callejero con fotografías, objetos y testimonios.', imagen:'a-4-blanknoise.gif' },
    { titulo:'Las Tesis', subtitulo:['Chile','(colectivo)','(latinoamericana)','(artista)','(performance)'], cuerpo:'Performance feminista colectiva que nació en las calles de Valparaíso y se replicó de forma viral en más de 50 países.', imagen:'a-5-lastesis.gif' },
    { titulo:'Ursula Biemann', subtitulo:['Suiza','(europea)','(artista)','(investigadora)','(citada por Zafra)','(video)'], cuerpo:'Performing the Border (1999): video sobre Ciudad Juárez, maquiladoras y el cuerpo femenino como objeto de la producción tecnológica.', imagen:'a-6-ursulabiemann.jpg' },
    { titulo:'Critical Art Ensemble', subtitulo:['USA','(anglosajona)','(colectivo)','(artista)','(citada por Zafra)','(performance)'], cuerpo:'Colectivo de activismo digital y performance. Autores de La desobediencia civil electrónica.', imagen:'a-7-criticalartensemble.jpg' },
    { titulo:'Susy Shock', subtitulo:['Argentina','(latinoamericana)','(artista)','(escritora)'], cuerpo:'SuperShiva: historieta donde el personaje principal es una migrante travesti superheroína. Circuló digitalmente de forma libre y gratuita.', imagen:'a-8-susyshock.png' },
  ],
  B: [
    { titulo:'Gabriela Golder', subtitulo:['Argentina','(latinoamericana)','(artista)','(investigadora)','(profesora)','(net.art)','(video)'], cuerpo:'Net.art y videoarte, Postales — fragmentos íntimos dispersos en la red, búsqueda de presencia a través del archivo doméstico.', imagen:'b-1-golder.jpg' },
    { titulo:'Mariela Yeregui', subtitulo:['Argentina','(latinoamericana)','(artista)','(investigadora)','(profesora)','(net.art)'], cuerpo:'Arte interactivo y robótico, trabaja la pantalla como umbral entre presencia y ausencia.', imagen:'b-2-yeregui.jpg' },
    { titulo:'La Imilla Hacker', subtitulo:['Bolivia','(latinoamericana)','(artista)','(investigadora)'], cuerpo:'Combina identidad indígena aymara con cultura hacker feminista.', imagen:'b-3-imillahacker.png' },
    { titulo:'Yina Jiménez Suriel', subtitulo:['República Dominicana/México','(latinoamericana)','(investigadora)','(net.art)'], cuerpo:'Sitio web personal concebido como obra: una interfaz de archivo digital que investiga la invisibilidad de las mujeres caribeñas.', imagen:'b-4-yinajimenezsuriel.gif' },
    { titulo:'skinonskinonskin — Auriea Harvey', subtitulo:['USA','(anglosajona)','(artista)','(net.art)','(ref. vista en clase)','1999'], cuerpo:'Serie de cartas de amor digitales intercambiadas con Michaël Samyn. Intimidad que se convierte en obra: la pantalla como jardín secreto compartido.', imagen:'b-5-skinonskinonskin.jpg' },
    { titulo:'out_4_pizza — Laura Brothers', subtitulo:['USA','(anglosajona)','(artista)','(net.art)','2007–'], cuerpo:'Blog de LiveJournal donde la artista postea pinturas digitales y GIFs. Navega la web temprana buscando y acumulando residuos visuales.', imagen:'b-6-out4pizza.jpg' },
  ],
  C: [
    { titulo:'Shu Lea Cheang', subtitulo:['Taiwan/USA','(anglosajona)','(asiática)','(artista)','(citada por Zafra)','(net.art)','(video)'], cuerpo:"Mencionada por Zafra en 'Habitares reversibles'. Brandon (1998): cuerpo trans, código, identidad desdoblada en red.", imagen:'c-1-cheang.png' },
    { titulo:'Victoria Vesna', subtitulo:['USA','(anglosajona)','(artista)','(investigadora)','(profesora)','(citada por Zafra)','(net.art)'], cuerpo:'Bodies Incorporated: construir un cuerpo virtual eligiendo partes, materiales, sexo, sexualidad.', imagen:'c-2-vesna.jpg' },
    { titulo:'Moon Ribas', subtitulo:['España','(europea)','(artista)','(performance)'], cuerpo:"'La libertad de ser cyborgs': mujer cibernética que construye sus piezas dancísticas desde un acercamiento profundo a la naturaleza.", imagen:'c-3-moon.gif' },
    { titulo:'Lynn Hershman', subtitulo:['USA','(anglosajona)','(artista)','(net.art)','(video)','1995–1998'], cuerpo:'The Dollie Clone Series.', imagen:'c-4-hershman.jpg' },
    { titulo:'GynePunk', subtitulo:['España','(europea)','(colectivo)','(artista)'], cuerpo:'Laboratorio transhackfeminista que desarrolla herramientas de diagnóstico ginecológico de bajo costo usando tecnología libre e impresión 3D.', imagen:'c-5-gynepunk.png' },
  ],
};

// ── SEED FUNCTION ─────────────────────────────────────────────────────────────
async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Clear existing data
    await client.query('DELETE FROM referentes');
    await client.query('DELETE FROM netianas');
    console.log('Cleared existing data');

    // Insert netianas
    const netianasMap = {};
    for (const n of NETIANAS) {
      const result = await client.query(
        `INSERT INTO netianas (letra, alias, nombre_libro, descripcion, cuerpo, tags)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id`,
        [n.letra, n.alias, n.nombre_libro, n.descripcion, n.cuerpo, n.tags]
      );
      netianasMap[n.letra] = result.rows[0].id;
      process.stdout.write(`  ✓ ${n.letra} ${n.alias}\n`);
    }

    // Insert referentes
    let refCount = 0;
    for (const [letra, refs] of Object.entries(REFERENTES)) {
      const netiana_id = netianasMap[letra];
      for (const ref of refs) {
        await client.query(
          `INSERT INTO referentes (netiana_id, titulo, subtitulo, cuerpo, imagen)
           VALUES ($1, $2, $3, $4, $5)`,
          [netiana_id, ref.titulo, ref.subtitulo, ref.cuerpo, ref.imagen || null]
        );
        refCount++;
      }
    }

    await client.query('COMMIT');
    console.log(`\n✓ Seeded: 14 netianas, ${refCount} referentes`);
    console.log('  Note: seed includes A, B, C referentes. Run seed_full.js for all 84.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
