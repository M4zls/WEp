import {Hono} from 'hono';
import { getDatabaseinstance} from '../utils/data.js';
import {estudiantes} from  '../utils/schema.js';


//router Hono
export  const estudianteController = new Hono();

//GET estudiantes

estudianteController.get('/',async (c) => {
    try {
        const db = getDatabaseinstance();

        //hacemos un select * a la tabla estudiantes
        const todos = await db.select().from(estudiantes);\
        return c.json(todos);
    } catch (error) 
    {return c.json(
        {error: 'error al obtener la tabla estudiantes'},
        {status: 500}
    );
}
});

//get estudaintes pero por rut
estudianteController.get('/:rut',async (c) => {
    try {

        //req es la request de Hono, param es para obtener el parametro de la url, en este caso el rut
        const rut = c.req.param('rut');
        const db = getDatabaseinstance();
        
        // hacemos un select * a la tabla estudiantes donde el rut sea igual al rut que recibimos por parametro
        //where es la condicion del select, eq es para comparar el rut de la tabla con el rut que recibimos por parametro
        const resultado = await db.select().from(estudiantes).where(eq(estudiantes.rut, rut));
        

        return c.json(resultado);
    } catch (error) {
        return c.json(
            {error: 'error al obtener el estudiante por rut'},
            {status: 500}
        );
    }
});
