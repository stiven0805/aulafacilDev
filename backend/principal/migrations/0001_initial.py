from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Aula",
            fields=[
                ("id_aula", models.AutoField(primary_key=True, serialize=False)),
                ("nombre_aula", models.CharField(max_length=50, unique=True)),
                ("capacidad", models.IntegerField()),
                ("descripcion", models.TextField(blank=True, null=True)),
            ],
            options={
                "db_table": "aula",
            },
        ),
        migrations.CreateModel(
            name="Usuario",
            fields=[
                ("id_usuario", models.AutoField(primary_key=True, serialize=False)),
                ("nombre", models.CharField(max_length=100)),
                ("apellido", models.CharField(max_length=100)),
                ("correo", models.CharField(max_length=150, unique=True)),
                ("contraseña", models.CharField(max_length=255)),
                ("rol", models.CharField(max_length=20)),
                ("created_at", models.DateTimeField(blank=True, null=True)),
                ("updated_at", models.DateTimeField(blank=True, null=True)),
            ],
            options={
                "db_table": "usuario",
            },
        ),
        migrations.CreateModel(
            name="Recurso",
            fields=[
                ("id_recurso", models.AutoField(primary_key=True, serialize=False)),
                ("nombre_recurso", models.CharField(max_length=100)),
                ("tipo", models.CharField(max_length=50)),
                ("estado", models.CharField(max_length=20)),
                (
                    "id_aula",
                    models.ForeignKey(
                        db_column="id_aula",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="principal.aula",
                    ),
                ),
            ],
            options={
                "db_table": "recurso",
            },
        ),
        migrations.CreateModel(
            name="Reserva",
            fields=[
                ("id_reserva", models.AutoField(primary_key=True, serialize=False)),
                ("inicio", models.DateTimeField()),
                ("fin", models.DateTimeField()),
                ("estado", models.CharField(max_length=20)),
                (
                    "id_aula",
                    models.ForeignKey(
                        db_column="id_aula",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="principal.aula",
                    ),
                ),
                (
                    "id_usuario",
                    models.ForeignKey(
                        db_column="id_usuario",
                        on_delete=django.db.models.deletion.DO_NOTHING,
                        to="principal.usuario",
                    ),
                ),
            ],
            options={
                "db_table": "reserva",
            },
        ),
    ]
