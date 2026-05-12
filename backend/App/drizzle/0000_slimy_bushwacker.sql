CREATE TABLE "autentificacion"."permisos" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"modulo" text NOT NULL,
	"lectura" boolean DEFAULT false,
	"escritura" boolean DEFAULT false,
	"eliminacion" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "autentificacion"."sesiones" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" text NOT NULL,
	"created_at" text DEFAULT '2026-05-12T02:48:08.482Z',
	CONSTRAINT "sesiones_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "autentificacion"."tokens_recuperacion" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"token" text NOT NULL,
	"expires_at" text NOT NULL,
	"usado" boolean DEFAULT false,
	"created_at" text DEFAULT '2026-05-12T02:48:08.482Z',
	CONSTRAINT "tokens_recuperacion_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "autentificacion"."usuarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"rut" text NOT NULL,
	"dv" text NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"rol" text DEFAULT 'estudiante' NOT NULL,
	"activo" boolean DEFAULT true,
	"fecha_creacion" text DEFAULT '2026-05-12T02:48:08.480Z',
	CONSTRAINT "usuarios_rut_unique" UNIQUE("rut"),
	CONSTRAINT "usuarios_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "estudiantes"."estudiantes" (
	"id" serial PRIMARY KEY NOT NULL,
	"rut" text NOT NULL,
	"dv" text NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"cursos" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"telefono" text,
	"apoderado" text,
	"fecha_registro" text DEFAULT '2026-05-12T02:48:08.488Z',
	CONSTRAINT "estudiantes_rut_unique" UNIQUE("rut"),
	CONSTRAINT "estudiantes_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "profesores"."clases" (
	"id" serial PRIMARY KEY NOT NULL,
	"profesor_id" integer NOT NULL,
	"curso_id" text NOT NULL,
	"materia" text NOT NULL,
	"fecha" text NOT NULL,
	"tema" text,
	"descripcion" text,
	"sala" text
);
--> statement-breakpoint
CREATE TABLE "profesores"."disponibilidad" (
	"id" serial PRIMARY KEY NOT NULL,
	"profesor_id" integer NOT NULL,
	"dia" text NOT NULL,
	"hora_inicio" text NOT NULL,
	"hora_fin" text NOT NULL,
	"tipo" text NOT NULL,
	"ubicacion" text
);
--> statement-breakpoint
CREATE TABLE "profesores"."horarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"profesor_id" integer NOT NULL,
	"dia" text NOT NULL,
	"hora_inicio" text NOT NULL,
	"hora_fin" text NOT NULL,
	"sala" text,
	"curso_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profesores"."profesores" (
	"id" serial PRIMARY KEY NOT NULL,
	"rut" text NOT NULL,
	"dv" text NOT NULL,
	"nombre" text NOT NULL,
	"apellido" text NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"telefono" text,
	"materia" text NOT NULL,
	"fecha_ingreso" text DEFAULT '2026-05-12T02:48:08.709Z',
	CONSTRAINT "profesores_rut_unique" UNIQUE("rut"),
	CONSTRAINT "profesores_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "notificaciones"."eventos" (
	"id" serial PRIMARY KEY NOT NULL,
	"titulo" text NOT NULL,
	"descripcion" text,
	"tipo" text NOT NULL,
	"datos" text,
	"activo" boolean DEFAULT true,
	"fecha_creacion" text DEFAULT '2026-05-12T02:48:08.497Z',
	"fecha_programada" text
);
--> statement-breakpoint
CREATE TABLE "notificaciones"."logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer,
	"accion" text NOT NULL,
	"modulo" text NOT NULL,
	"detalles" text,
	"ip" text,
	"estado" text NOT NULL,
	"fecha_creacion" text DEFAULT '2026-05-12T02:48:08.497Z'
);
--> statement-breakpoint
CREATE TABLE "notificaciones"."notificaciones" (
	"id" serial PRIMARY KEY NOT NULL,
	"usuario_id" integer NOT NULL,
	"titulo" text NOT NULL,
	"mensaje" text NOT NULL,
	"tipo" text NOT NULL,
	"leida" boolean DEFAULT false,
	"url" text,
	"fecha_creacion" text DEFAULT '2026-05-12T02:48:08.497Z',
	"fecha_lectura" text
);
--> statement-breakpoint
CREATE TABLE "cursos"."asignaturas" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"codigo" text NOT NULL,
	"descripcion" text,
	"fecha_creacion" text DEFAULT '2026-05-12T02:48:08.709Z',
	CONSTRAINT "asignaturas_codigo_unique" UNIQUE("codigo")
);
--> statement-breakpoint
CREATE TABLE "cursos"."curso_asignatura" (
	"id" serial PRIMARY KEY NOT NULL,
	"curso_id" integer NOT NULL,
	"asignatura_id" integer NOT NULL,
	"profesor_id" integer,
	"fecha_creacion" text DEFAULT '2026-05-12T02:48:08.709Z'
);
--> statement-breakpoint
CREATE TABLE "cursos"."cursos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nombre" text NOT NULL,
	"nivel" text NOT NULL,
	"letra" text NOT NULL,
	"anio" text DEFAULT '2026',
	"fecha_creacion" text DEFAULT '2026-05-12T02:48:08.709Z'
);
--> statement-breakpoint
ALTER TABLE "autentificacion"."permisos" ADD CONSTRAINT "permisos_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "autentificacion"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "autentificacion"."sesiones" ADD CONSTRAINT "sesiones_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "autentificacion"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "autentificacion"."tokens_recuperacion" ADD CONSTRAINT "tokens_recuperacion_usuario_id_usuarios_id_fk" FOREIGN KEY ("usuario_id") REFERENCES "autentificacion"."usuarios"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profesores"."clases" ADD CONSTRAINT "clases_profesor_id_profesores_id_fk" FOREIGN KEY ("profesor_id") REFERENCES "profesores"."profesores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profesores"."disponibilidad" ADD CONSTRAINT "disponibilidad_profesor_id_profesores_id_fk" FOREIGN KEY ("profesor_id") REFERENCES "profesores"."profesores"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profesores"."horarios" ADD CONSTRAINT "horarios_profesor_id_profesores_id_fk" FOREIGN KEY ("profesor_id") REFERENCES "profesores"."profesores"("id") ON DELETE cascade ON UPDATE no action;