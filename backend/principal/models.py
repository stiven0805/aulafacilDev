from django.db import models

# Create your models here.
class Aula(models.Model):
    id_aula = models.AutoField(primary_key=True)
    nombre_aula = models.CharField(unique=True, max_length=50)
    capacidad = models.IntegerField()
    descripcion = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'aula'
        
class Recurso(models.Model):
    id_recurso = models.AutoField(primary_key=True)
    nombre_recurso = models.CharField(max_length=100)
    tipo = models.CharField(max_length=50)
    estado = models.CharField(max_length=20)
    id_aula = models.ForeignKey(Aula, models.DO_NOTHING, db_column='id_aula')

    class Meta:
        db_table = 'recurso'


class Reserva(models.Model):
    id_reserva = models.AutoField(primary_key=True)
    inicio = models.DateTimeField()
    fin = models.DateTimeField()
    estado = models.CharField(max_length=20)
    id_usuario = models.ForeignKey('Usuario', models.DO_NOTHING, db_column='id_usuario')
    id_aula = models.ForeignKey(Aula, models.DO_NOTHING, db_column='id_aula')

    class Meta:
        db_table = 'reserva'

class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100)
    correo = models.CharField(unique=True, max_length=150)
    contraseña = models.CharField(max_length=255)
    rol = models.CharField(max_length=20)
    created_at = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(blank=True, null=True)

    @property
    def is_authenticated(self):
        return True

    @property
    def is_staff(self):
        return self.rol == 'administrador'

    class Meta:
        db_table = 'usuario'
