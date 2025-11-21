import os
import django
#crear aulas
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'aulafacil.settings')
django.setup()

from principal.models import Aula

def crear_aulas():
    aulas_data = [
        {"nombre_aula": "Aula 101", "capacidad": 30, "descripcion": "Aula teórica con proyector"},
        {"nombre_aula": "Aula 102", "capacidad": 25, "descripcion": "Aula pequeña"},
        {"nombre_aula": "Laboratorio 1", "capacidad": 20, "descripcion": "Equipado con computadoras"},
        {"nombre_aula": "Auditorio", "capacidad": 100, "descripcion": "Para conferencias y eventos"},
        {"nombre_aula": "Sala de Estudio", "capacidad": 10, "descripcion": "Espacio silencioso"},
    ]

    creadas = 0
    for data in aulas_data:
        aula, created = Aula.objects.get_or_create(
            nombre_aula=data["nombre_aula"],
            defaults={
                "capacidad": data["capacidad"],
                "descripcion": data["descripcion"]
            }
        )
        if created:
            print(f"Creada: {aula.nombre_aula}")
            creadas += 1
        else:
            print(f"Ya existe: {aula.nombre_aula}")

    print(f"\nTotal de aulas nuevas creadas: {creadas}")

if __name__ == "__main__":
    crear_aulas()
