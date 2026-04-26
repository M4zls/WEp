import { Hono } from 'hono';
import { getDatabaseinstance } from '../utils/data.js';
import { estudiantes } from '../utils/schema.js';
import { eq } from 'drizzle-orm';

// router Hono
export const estudianteController = new Hono();

// GET estudiantes - obtener todos
estudianteController.get('/', async (c) => {
  try {
    const db = getDatabaseinstance();
    // hacemos un select * a la tabla estudiantes
    const todos = await db.select().from(estudiantes);
    return c.json(todos);
  } catch (error) {
    return c.json(
      { error: 'error al obtener la tabla estudiantes' },
      { status: 500 }
    );
  }
});

// GET estudiantes/:rut - obtener por rut
estudianteController.get('/:rut', async (c) => {
  try {
    // req es la request de Hono, param es para obtener el parametro de la url, en este caso el rut
    const rut = c.req.param('rut');
    const db = getDatabaseinstance();
    // hacemos un select * a la tabla estudiantes donde el rut sea igual al rut que recibimos por parametro
    // where es la condicion del select, eq significa igual, estudiantes.rut es la columna rut de la tabla estudiantes, rut es el valor que recibimos por parametro
    const resultado = await db
      .select()
      .from(estudiantes)
      .where(eq(estudiantes.rut, rut));

    if (resultado.length === 0) {
      return c.json(
        { error: 'estudiante no encontrado' },
        { status: 404 }
      );
    }

    return c.json(resultado);
  } catch (error) {
    return c.json(
      { error: 'error al obtener el estudiante' },
      { status: 500 }
    );
  }
});

// POST estudiantes - crear nuevo
estudianteController.post('/', async (c) => {
  try {
    const datos = await c.req.json();

    if (
      !datos.rut ||
      !datos.dv ||
      !datos.nombre ||
      !datos.apellido ||
      !datos.cursos
    ) {
      return c.json(
        { error: 'faltan datos obligatorios' },
        { status: 400 }
      );
    }

    const db = getDatabaseinstance();

    // insertamos estudiante nuevo
    await db.insert(estudiantes).values({
      rut: datos.rut,
      dv: datos.dv,
      nombre: datos.nombre,
      apellido: datos.apellido,
      cursos: datos.cursos,
      email: datos.email,
      telefono: datos.telefono,
      apoderado: datos.apoderado,
      fechaRegistro: new Date().toISOString(),
    });

    return c.json(
      { message: 'estudiante creado correctamente', datos },
      { status: 201 }
    );
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : 'error al crear el estudiante';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

// PUT estudiantes/:rut - actualizar
estudianteController.put('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const datos = await c.req.json();
    const db = getDatabaseinstance();

    // verificamos que el estudiante exista
    const existe = await db
      .select()
      .from(estudiantes)
      .where(eq(estudiantes.rut, rut));

    if (existe.length === 0) {
      return c.json(
        { error: 'estudiante no encontrado' },
        { status: 404 }
      );
    }

    // actualizar datos del estudiante
    await db
      .update(estudiantes)
      .set(datos)
      .where(eq(estudiantes.rut, rut));

    return c.json(
      { message: 'estudiante actualizado correctamente', datos },
      { status: 200 }
    );
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : 'error al actualizar el estudiante';
    return c.json({ error: mensaje }, { status: 400 });
  }
});

// DELETE estudiantes/:rut - eliminar
estudianteController.delete('/:rut', async (c) => {
  try {
    const rut = c.req.param('rut');
    const db = getDatabaseinstance();

    // verificamos que el estudiante exista
    const existe = await db
      .select()
      .from(estudiantes)
      .where(eq(estudiantes.rut, rut));

    if (existe.length === 0) {
      return c.json(
        { error: 'estudiante no encontrado' },
        { status: 404 }
      );
    }

    // eliminar
    await db.delete(estudiantes).where(eq(estudiantes.rut, rut));

    return c.json(
      { message: 'estudiante eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    const mensaje =
      error instanceof Error
        ? error.message
        : 'error al eliminar el estudiante';
    return c.json({ error: mensaje }, { status: 400 });
  }
});
