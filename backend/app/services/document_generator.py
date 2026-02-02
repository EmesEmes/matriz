from docxtpl import DocxTemplate, RichText
from pathlib import Path
from datetime import datetime
from app.utils.number_to_words import numero_a_letras, numero_a_digitos, formatear_fecha_notarial
from app.utils.html_to_richtext import html_to_richtext

TEMPLATES_DIR = Path(__file__).parent.parent / "templates"
OUTPUTS_DIR = Path(__file__).parent.parent.parent / "generated_documents"

OUTPUTS_DIR.mkdir(exist_ok=True)

def calcular_edad(fecha_nacimiento_str):
    """Calcula la edad en años a partir de fecha de nacimiento"""
    from datetime import datetime
    fecha_nac = datetime.strptime(fecha_nacimiento_str, "%Y-%m-%d")
    hoy = datetime.now()
    edad = hoy.year - fecha_nac.year
    if (hoy.month, hoy.day) < (fecha_nac.month, fecha_nac.day):
        edad -= 1
    return edad

def procesar_compareciente(comp, index):
    """Procesa datos de un compareciente individual"""
    
    # Calcular edad
    edad = calcular_edad(comp['fechaNacimiento'])
    
    # Construir dirección
    direccion_parts = []
    if comp.get('callePrincipal'):
        direccion_parts.append(comp['callePrincipal'])
    if comp.get('numeroCalle'):
        direccion_parts.append(f"número {comp['numeroCalle']}")
    if comp.get('calleSecundaria'):
        direccion_parts.append(f"y {comp['calleSecundaria']}")
    if comp.get('sector'):
        direccion_parts.append(f"sector {comp['sector']}")
    if comp.get('parroquia'):
        direccion_parts.append(f"parroquia {comp['parroquia']}")
    if comp.get('canton'):
        direccion_parts.append(f"cantón {comp['canton']}")
    if comp.get('provincia'):
        direccion_parts.append(f"provincia de {comp['provincia']}")
    
    direccion_completa = ", ".join(direccion_parts)
    
    # Construir texto de profesión/ocupación
    profesion_ocupacion = ""
    if comp.get('profesion') and comp.get('ocupacion'):
        profesion_ocupacion = f"profesión {comp['profesion']}, ocupación {comp['ocupacion']}"
    elif comp.get('ocupacion'):
        profesion_ocupacion = f"ocupación {comp['ocupacion']}"
    elif comp.get('profesion'):
        profesion_ocupacion = f"profesión {comp['profesion']}"
    
    # Determinar artículo y estado civil
    genero = comp.get('genero', '').lower()
    estado_civil = comp.get('estadoCivil', '').lower()
    
    articulo = "el señor" if genero == "masculino" else "la señora"
    
    # Ajustar estado civil según género
    if estado_civil == "casado":
        estado_civil_texto = "casado" if genero == "masculino" else "casada"
    elif estado_civil == "soltero":
        estado_civil_texto = "soltero" if genero == "masculino" else "soltera"
    elif estado_civil == "divorciado":
        estado_civil_texto = "divorciado" if genero == "masculino" else "divorciada"
    elif estado_civil == "viudo":
        estado_civil_texto = "viudo" if genero == "masculino" else "viuda"
    else:
        estado_civil_texto = estado_civil
    
    return {
        'numero': index,
        'articulo': articulo,
        'nombres': comp['nombres'],
        'apellidos': comp['apellidos'],
        'nombreCompleto': f"{comp['nombres']} {comp['apellidos']}",
        'nacionalidad': comp['nacionalidad'],
        'cedula': comp['cedula'],
        'cedulaEnLetras': numero_a_digitos(comp['cedula']),
        'cedulaEnDigitos': numero_a_digitos(comp['cedula']),
        'edad': edad,
        'edadEnLetras': numero_a_letras(edad),
        'genero': genero,
        'estadoCivil': estado_civil,
        'estadoCivilTexto': estado_civil_texto,
        'profesionOcupacion': profesion_ocupacion,
        'telefono': comp.get('telefono', ''),
        'telefonoEnLetras': numero_a_digitos(int(comp['telefono'])) if comp.get('telefono') and comp['telefono'].isdigit() else '',
        'email': comp.get('email', ''),
        'direccion': direccion_completa,
        'provincia': comp.get('provincia', ''),
        'canton': comp.get('canton', ''),
        'parroquia': comp.get('parroquia', ''),
        
        # Opciones especiales
        'needsInterpreter': comp.get('needsInterpreter', False),
        'nombreInterprete': comp.get('nombreInterprete', ''),
        'generoInterprete': comp.get('generoInterprete', ''),
        'cedulaInterprete': comp.get('cedulaInterprete', ''),
        'idiomaInterprete': comp.get('idiomaInterprete', ''),
        'isNoVidente': comp.get('isNoVidente', False),
        'personaConfianzaNoVidente': comp.get('personaConfianzaNoVidente', ''),
        'isAnalfabeta': comp.get('isAnalfabeta', False),
        'personaConfianzaAnalfabeta': comp.get('personaConfianzaAnalfabeta', ''),
        'hasDiscapacidadIntelectual': comp.get('hasDiscapacidadIntelectual', False),
        'tipoDiscapacidad': comp.get('tipoDiscapacidad', ''),
        'razonExclusionConyugue': comp.get('razonExclusionConyugue', ''),
        
        # Flags
        'esTerceraEdad': edad >= 65,
        'esCasado': estado_civil == 'casado',
        'tieneConyuge': comp.get('conyuge') is not None,
        'conyuge': comp.get('conyuge')
    }

def generate_matriz_compraventa(data: dict) -> str:
    """
    Genera matriz de compraventa usando docxtpl
    """
    
    print("=" * 50)
    print("PROCESANDO DATOS PARA PLANTILLA")
    print("=" * 50)
    print("DEBUG - abogadoTexto recibido:", data.get('abogadoTexto'))
    print("DEBUG - Tipo:", type(data.get('abogadoTexto')))
    # Convertir vendedores y compradores a diccionarios si son objetos Pydantic
    vendedores_raw = data.get('vendedoresList', [])
    compradores_raw = data.get('compradoresList', [])
    
    # Convertir a dict si es necesario
    vendedores_dict = []
    for v in vendedores_raw:
        if hasattr(v, 'dict'):
            vendedores_dict.append(v.dict())
        elif hasattr(v, 'model_dump'):
            vendedores_dict.append(v.model_dump())
        else:
            vendedores_dict.append(v)
    
    compradores_dict = []
    for c in compradores_raw:
        if hasattr(c, 'dict'):
            compradores_dict.append(c.dict())
        elif hasattr(c, 'model_dump'):
            compradores_dict.append(c.model_dump())
        else:
            compradores_dict.append(c)
    
    # Procesar vendedores
    vendedores_procesados = []
    for i, vendedor in enumerate(vendedores_dict, start=1):
        vendedor_proc = procesar_compareciente(vendedor, i)
        vendedores_procesados.append(vendedor_proc)
    
    # Procesar compradores (continuar numeración)
    compradores_procesados = []
    start_index = len(vendedores_procesados) + 1
    for i, comprador in enumerate(compradores_dict, start=start_index):
        comprador_proc = procesar_compareciente(comprador, i)
        compradores_procesados.append(comprador_proc)
    
    # Todos los participantes
    todos_participantes = vendedores_procesados + compradores_procesados
    
    # Verificar si hay alguien con necesidades especiales
    hay_interprete = any(p['needsInterpreter'] for p in todos_participantes)
    hay_no_vidente = any(p['isNoVidente'] for p in todos_participantes)
    hay_analfabeta = any(p['isAnalfabeta'] for p in todos_participantes)
    hay_discapacidad_intelectual = any(p['hasDiscapacidadIntelectual'] for p in todos_participantes)
    hay_tercera_edad = any(p['esTerceraEdad'] for p in todos_participantes)
    
    # Formatear fecha notarial
    fecha_notarial = formatear_fecha_notarial(data.get('fechaActual'))
    
    # Preparar datos para la plantilla
    context = {
        'numeroProtocolo': data.get('numeroProtocolo'),
        'tipoContrato': data.get('tipoContrato', '').upper(),
        'cuantia': data.get('cuantia'),
        'cuantiaEnLetras': numero_a_letras(int(data.get('cuantia', 0))),
        'fechaActual': data.get('fechaActual'),
        'fechaNotarial': fecha_notarial,
        'notario': data.get('notario'),
        'tituloNotario': data.get('tituloNotario'),
        'matrizador': data.get('matrizador'),
        
        # Listas de comparecientes procesados
        'vendedores': vendedores_procesados,
        'compradores': compradores_procesados,
        'todosParticipantes': todos_participantes,
        
        # Conteos
        'numVendedores': len(vendedores_procesados),
        'numCompradores': len(compradores_procesados),
        
        # Flags globales
        'hayTerceraEdad': hay_tercera_edad,
        'hayInterprete': hay_interprete,
        'hayNoVidente': hay_no_vidente,
        'hayAnalfabeta': hay_analfabeta,
        'hayDiscapacidadIntelectual': hay_discapacidad_intelectual,
        
        # Concuerdo
        'needsConcuerdo': data.get('needsConcuerdo', False),
        'datosConcuerdo': data.get('datosConcuerdo'),
        
        # Abogado
        'abogadoNombre': data.get('abogadoNombre'),
        'abogadoEsMujer': data.get('abogadoEsMujer', False),
        'abogadoNumeroMatricula': data.get('abogadoNumeroMatricula'),
        'abogadoTipoMatricula': data.get('abogadoTipoMatricula'),
        'abogadoProvincia': data.get('abogadoProvincia'),
        'abogadoTexto': '',
    }
    
    # Convertir minuta a RichText
    if 'abogadoTexto' in data and data['abogadoTexto']:
        print("DEBUG - Procesando minuta HTML:", data['abogadoTexto'][:100], "...")
        context['abogadoTexto'] = html_to_richtext(data['abogadoTexto'])
        print("DEBUG - RichText con formato creado")
    else:
        print("DEBUG - NO hay abogadoTexto en data")
        context['abogadoTexto'] = ''
        
    print("Contexto preparado:")
    print(f"- Vendedores: {len(vendedores_procesados)}")
    print(f"- Compradores: {len(compradores_procesados)}")
    print(f"- Hay tercera edad: {hay_tercera_edad}")
    print(f"- Hay intérprete: {hay_interprete}")
    print(f"- Hay no vidente: {hay_no_vidente}")
    print(f"- Hay analfabeta: {hay_analfabeta}")
    print(f"- Hay discapacidad intelectual: {hay_discapacidad_intelectual}")
    
    # Cargar plantilla
    template_path = TEMPLATES_DIR / "compraventa.docx"
    
    if not template_path.exists():
        raise FileNotFoundError(f"Plantilla no encontrada en: {template_path}")
    
    doc = DocxTemplate(template_path)
    
    # Renderizar con autoescape desactivado
    try:
        print("Renderizando documento...")
        doc.render(context, autoescape=False)
        print("Documento renderizado exitosamente")
    except Exception as e:
        print(f"ERROR AL RENDERIZAR: {e}")
        import traceback
        traceback.print_exc()
        raise
    
    # Guardar
    protocol = data.get('numeroProtocolo', 'sin-protocolo')
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"matriz_{protocol}_{timestamp}.docx"
    output_path = OUTPUTS_DIR / filename
    
    doc.save(str(output_path))
    print(f"Documento guardado en: {output_path}")
    print("=" * 50)
    
    return str(output_path)