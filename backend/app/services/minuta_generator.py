from docxtpl import DocxTemplate
from io import BytesIO
from ..utils.number_to_words import (
    numero_a_letras, 
    numero_a_digitos, 
    formatear_fecha_notarial, 
    calcular_edad,
    numero_casa_a_letras,
    numero_a_ordinal_notaria
)
from bs4 import BeautifulSoup
import re


def agrupar_por_conyuges(personas):
    """
    Agrupa personas por cónyuges y solteros.
    
    Args:
        personas: Lista de diccionarios con datos de comparecientes
        
    Returns:
        Lista de grupos: [{'tipo': 'conyuges'/'soltero', 'direccion': '...', 'personas': [...]}]
    """
    grupos = []
    procesados = set()
    
    for i, persona in enumerate(personas):
        if i in procesados:
            continue
            
        # Verificar si está casado y tiene pareja
        if (persona.get('maritalStatus') == 'casado' and 
            persona.get('partner') and 
            persona['partner'].get('documentNumber')):
            
            # Buscar el cónyuge en la lista
            pareja_doc = persona['partner']['documentNumber']
            pareja_idx = None
            
            for j, otra_persona in enumerate(personas):
                if (j != i and 
                    otra_persona.get('documentNumber') == pareja_doc):
                    pareja_idx = j
                    break
            
            if pareja_idx is not None:
                # Crear grupo de cónyuges
                grupos.append({
                    'tipo': 'conyuges',
                    'direccion': persona.get('address', ''),
                    'personas': [persona, personas[pareja_idx]]
                })
                procesados.add(i)
                procesados.add(pareja_idx)
            else:
                # No se encontró la pareja, tratar como soltero
                grupos.append({
                    'tipo': 'soltero',
                    'direccion': persona.get('address', ''),
                    'personas': [persona]
                })
                procesados.add(i)
        else:
            # Soltero o sin información de pareja
            grupos.append({
                'tipo': 'soltero',
                'direccion': persona.get('address', ''),
                'personas': [persona]
            })
            procesados.add(i)
    
    return grupos


def procesar_persona_data(persona, numero_global):
    """
    Procesa los datos de una persona para la plantilla.
    
    Args:
        persona: Diccionario con datos de la persona
        numero_global: Número correlativo global
        
    Returns:
        Diccionario con datos procesados para la plantilla
    """
    nombres_completos = f"{persona.get('names', '')} {persona.get('lastNames', '')}".strip().upper()
    cedula = persona.get('documentNumber', '')
    telefono = persona.get('phoneNumber', '')
    
    # Calcular edad
    edad = calcular_edad(persona.get('birthdate', ''))
    
    # Estado civil
    estado_civil_map = {
        'soltero': 'soltero',
        'casado': 'casado',
        'divorciado': 'divorciado',
        'viudo': 'viudo',
        'union_libre': 'unión libre'
    }
    estado_civil = estado_civil_map.get(persona.get('maritalStatus', 'soltero'), 'soltero')
    
    # Convertir dirección con números de casa
    direccion_original = persona.get('address', '')
    direccion_convertida = direccion_original
    
    # Buscar patrones de números de casa (E13-51, Oe4-23, etc.)
    patron_casa = r'\b([A-Za-z]*\d+[-]\d+)\b'
    matches = re.findall(patron_casa, direccion_original)
    for match in matches:
        numero_letras = numero_casa_a_letras(match)
        direccion_convertida = direccion_convertida.replace(match, numero_letras)
    
    return {
        'numero': numero_a_letras(numero_global),
        'numero_numerico': numero_global,
        'nombres_completos': nombres_completos,
        'nacionalidad': persona.get('nationality', 'ecuatoriana'),
        'cedula': cedula,
        'cedula_palabras': numero_a_digitos(cedula),
        'edad': edad,
        'estado_civil': estado_civil,
        'profesion': persona.get('profession', ''),
        'ocupacion': persona.get('occupation', ''),
        'telefono': telefono,
        'telefono_palabras': numero_a_digitos(telefono),
        'email': persona.get('email', ''),
        'direccion': direccion_convertida,
    }


def procesar_linderos(linderos_data, incluir_arriba_abajo=False):
    """
    Procesa linderos que pueden tener múltiples entradas por dirección.
    
    Args:
        linderos_data: Diccionario con arrays de linderos por dirección
        incluir_arriba_abajo: Si se deben incluir linderos arriba/abajo
        
    Returns:
        Diccionario procesado para la plantilla
    """
    resultado = {}
    direcciones = ['norte', 'sur', 'este', 'oeste']
    
    if incluir_arriba_abajo:
        direcciones.extend(['arriba', 'abajo'])
    
    for direccion in direcciones:
        linderos_lista = linderos_data.get(direccion, [])
        
        if not linderos_lista:
            linderos_lista = [{'metros': '', 'colindancia': ''}]
        
        # Procesar cada lindero
        linderos_procesados = []
        for lindero in linderos_lista:
            metros = lindero.get('metros', '')
            colindancia = lindero.get('colindancia', '')
            
            if metros and colindancia:
                linderos_procesados.append({
                    'metros': metros,
                    'metros_palabras': numero_a_letras(float(metros)) if metros else '',
                    'colindancia': colindancia
                })
        
        resultado[direccion] = linderos_procesados
    
    # Superficie
    superficie = linderos_data.get('superficie', '')
    resultado['superficie'] = superficie
    resultado['superficie_palabras'] = numero_a_letras(float(superficie)) if superficie else ''
    
    return resultado


def procesar_aclaratorias_historia(aclaratorias):
    """
    Procesa aclaratorias de historia de dominio (recursivamente).
    
    Args:
        aclaratorias: Lista de aclaratorias
        
    Returns:
        Lista de aclaratorias procesadas
    """
    if not aclaratorias:
        return []
    
    resultado = []
    
    for aclaratoria in aclaratorias:
        acl_procesada = {
            'titulo': aclaratoria.get('titulo', ''),
            'titulo_otro': aclaratoria.get('tituloOtro', ''),
            'adquirido_de': aclaratoria.get('adquiridoDe', ''),
            'fecha_otorgamiento': formatear_fecha_notarial(aclaratoria.get('fechaOtorgamiento', '')) if aclaratoria.get('fechaOtorgamiento') else '',
            'numero_notaria': aclaratoria.get('numeroNotaria', ''),
            'numero_notaria_palabras': numero_a_ordinal_notaria(aclaratoria.get('numeroNotaria', '')) if aclaratoria.get('numeroNotaria') else '',
            'canton_notaria': aclaratoria.get('cantonNotaria', ''),
            'notario': aclaratoria.get('notario', ''),
            'fecha_inscripcion': formatear_fecha_notarial(aclaratoria.get('fechaInscripcion', '')) if aclaratoria.get('fechaInscripcion') else '',
            'canton_inscripcion': aclaratoria.get('cantonInscripcion', ''),
            'mismo_canton': aclaratoria.get('cantonNotaria', '').lower() == aclaratoria.get('cantonInscripcion', '').lower() if aclaratoria.get('cantonNotaria') and aclaratoria.get('cantonInscripcion') else False,
        }
        
        # Procesar aclaratorias anidadas recursivamente
        if 'aclaratorias' in aclaratoria and aclaratoria['aclaratorias']:
            acl_procesada['aclaratorias'] = procesar_aclaratorias_historia(aclaratoria['aclaratorias'])
        else:
            acl_procesada['aclaratorias'] = []
        
        resultado.append(acl_procesada)
    
    return resultado


def procesar_aclaratorias_declaratoria(aclaratorias):
    """
    Procesa aclaratorias de declaratoria de propiedad horizontal (recursivamente).
    
    Args:
        aclaratorias: Lista de aclaratorias
        
    Returns:
        Lista de aclaratorias procesadas
    """
    if not aclaratorias:
        return []
    
    resultado = []
    
    for aclaratoria in aclaratorias:
        acl_procesada = {
            'fecha_otorgamiento': formatear_fecha_notarial(aclaratoria.get('fechaOtorgamiento', '')) if aclaratoria.get('fechaOtorgamiento') else '',
            'numero_notaria': aclaratoria.get('numeroNotaria', ''),
            'numero_notaria_palabras': numero_a_ordinal_notaria(aclaratoria.get('numeroNotaria', '')) if aclaratoria.get('numeroNotaria') else '',
            'canton_notaria': aclaratoria.get('cantonNotaria', ''),
            'notario': aclaratoria.get('notario', ''),
            'fecha_inscripcion': formatear_fecha_notarial(aclaratoria.get('fechaInscripcion', '')) if aclaratoria.get('fechaInscripcion') else '',
            'canton_inscripcion': aclaratoria.get('cantonInscripcion', ''),
            'mismo_canton': aclaratoria.get('cantonNotaria', '').lower() == aclaratoria.get('cantonInscripcion', '').lower() if aclaratoria.get('cantonNotaria') and aclaratoria.get('cantonInscripcion') else False,
        }
        
        # Procesar aclaratorias anidadas recursivamente
        if 'aclaratorias' in aclaratoria and aclaratoria['aclaratorias']:
            acl_procesada['aclaratorias'] = procesar_aclaratorias_declaratoria(aclaratoria['aclaratorias'])
        else:
            acl_procesada['aclaratorias'] = []
        
        resultado.append(acl_procesada)
    
    return resultado


def limpiar_html(html_content):
    """Convierte HTML a texto plano manteniendo saltos de línea"""
    if not html_content:
        return ""
    
    soup = BeautifulSoup(html_content, 'html.parser')
    
    # Reemplazar <br> y <p> con saltos de línea
    for br in soup.find_all("br"):
        br.replace_with("\n")
    for p in soup.find_all("p"):
        p.insert_after("\n")
    
    text = soup.get_text()
    # Limpiar múltiples saltos de línea
    text = re.sub(r'\n\s*\n', '\n\n', text)
    return text.strip()


def generate_minuta(data: dict, template_path: str) -> BytesIO:
    """
    Genera una minuta en formato .docx basándose en los datos proporcionados.
    
    Args:
        data: Diccionario con todos los datos del formulario
        template_path: Ruta al archivo de plantilla .docx
        
    Returns:
        BytesIO con el documento generado
    """
    doc = DocxTemplate(template_path)
    
    # Inicializar contexto
    context = {}
    
    # ============================================
    # COMPARECIENTES - VENDEDORES Y COMPRADORES
    # ============================================
    vendedores = data.get('vendedores', [])
    compradores = data.get('compradores', [])
    
    # Agrupar por cónyuges
    grupos_vendedores = agrupar_por_conyuges(vendedores)
    grupos_compradores = agrupar_por_conyuges(compradores)
    
    # Procesar grupos de vendedores
    contador_global = 1
    grupos_vendedores_procesados = []
    
    for grupo in grupos_vendedores:
        grupo_procesado = {
            'tipo': grupo['tipo'],
            'direccion': grupo['direccion'],
            'personas': []
        }
        
        for persona in grupo['personas']:
            persona_data = procesar_persona_data(persona, contador_global)
            grupo_procesado['personas'].append(persona_data)
            contador_global += 1
        
        grupos_vendedores_procesados.append(grupo_procesado)
    
    # Procesar grupos de compradores
    grupos_compradores_procesados = []
    
    for grupo in grupos_compradores:
        grupo_procesado = {
            'tipo': grupo['tipo'],
            'direccion': grupo['direccion'],
            'personas': []
        }
        
        for persona in grupo['personas']:
            persona_data = procesar_persona_data(persona, contador_global)
            grupo_procesado['personas'].append(persona_data)
            contador_global += 1
        
        grupos_compradores_procesados.append(grupo_procesado)
    
    context['grupos_vendedores'] = grupos_vendedores_procesados
    context['grupos_compradores'] = grupos_compradores_procesados
    
    # Mantener listas planas para compatibilidad con plantilla antigua (si es necesario)
    vendedores_procesados = []
    for grupo in grupos_vendedores_procesados:
        vendedores_procesados.extend(grupo['personas'])
    
    compradores_procesados = []
    for grupo in grupos_compradores_procesados:
        compradores_procesados.extend(grupo['personas'])
    
    context['vendedores'] = vendedores_procesados
    context['compradores'] = compradores_procesados
    context['num_vendedores'] = len(vendedores_procesados)
    
    # ============================================
    # TIPO DE PROPIEDAD
    # ============================================
    context['es_horizontal'] = data.get('tipoPropiedad') == 'horizontal'
    context['es_comun'] = data.get('tipoPropiedad') == 'comun'
    context['nombre_conjunto'] = data.get('nombreConjunto', '')
    
    # ============================================
    # PREDIOS (solo para horizontal)
    # ============================================
    if context['es_horizontal']:
        predios = data.get('predios', [])
        predios_procesados = []
        
        for predio in predios:
            inmuebles_procesados = []
            
            for inmueble in predio.get('inmuebles', []):
                area_cubierta = inmueble.get('areaCubierta', '')
                area_descubierta = inmueble.get('areaDescubierta', '')
                alicuota_parcial = inmueble.get('alicuotaParcial', '')
                
                inmueble_data = {
                    'tipo': inmueble.get('tipo', ''),
                    'tipo_otro': inmueble.get('tipoOtro', ''),
                    'nivel': inmueble.get('nivel', ''),
                    'area_cubierta': area_cubierta,
                    'area_cubierta_palabras': numero_a_letras(float(area_cubierta)) if area_cubierta else '',
                    'area_descubierta': area_descubierta,
                    'area_descubierta_palabras': numero_a_letras(float(area_descubierta)) if area_descubierta else '',
                    'alicuota_parcial': alicuota_parcial,
                    'alicuota_parcial_palabras': numero_a_letras(float(alicuota_parcial)) if alicuota_parcial else '',
                }
                inmuebles_procesados.append(inmueble_data)
            
            # Alícuota total
            if predio.get('usarAlicuotaManual'):
                alicuota_total = predio.get('alicuotaTotalManual', 0)
            else:
                alicuota_total = predio.get('alicuotaTotal', 0)
            
            predio_data = {
                'es_compuesto': predio.get('esCompuesto', False),
                'tipo': predio.get('tipo', ''),
                'tipo_otro': predio.get('tipoOtro', ''),
                'numero': predio.get('numero', ''),
                'numero_palabras': numero_a_letras(int(predio.get('numero', 0))) if predio.get('numero', '').isdigit() else predio.get('numero', ''),
                'inmuebles': inmuebles_procesados,
                'alicuota_total': alicuota_total,
                'alicuota_total_palabras': numero_a_letras(float(alicuota_total)) if alicuota_total else '',
            }
            predios_procesados.append(predio_data)
        
        context['predios'] = predios_procesados
    
    # ============================================
    # UBICACIÓN
    # ============================================
    ubicacion = data.get('ubicacion', {})
    context['ubicacion'] = {
        'lote': ubicacion.get('lote', ''),
        'numero': ubicacion.get('numero', ''),
        'parroquia': ubicacion.get('parroquia', ''),
        'canton': ubicacion.get('canton', ''),
        'provincia': ubicacion.get('provincia', ''),
    }
    
    # ============================================
    # HISTORIA DE DOMINIO
    # ============================================
    if data.get('modoHistoria') == 'redactar':
        context['historia_manual'] = True
        context['historia_texto'] = limpiar_html(data.get('historiaManual', ''))
    else:
        context['historia_manual'] = False
        historia = data.get('historiaFormulario', {})
        
        context['historia'] = {
            'titulo': historia.get('titulo', ''),
            'titulo_otro': historia.get('tituloOtro', ''),
            'tipo_sucesion': historia.get('tipoSucesion', ''),
            'adquirido_de': historia.get('adquiridoDe', ''),
            'fecha_otorgamiento': formatear_fecha_notarial(historia.get('fechaOtorgamiento', '')) if historia.get('fechaOtorgamiento') else '',
            'numero_notaria': historia.get('numeroNotaria', ''),
            'numero_notaria_palabras': numero_a_ordinal_notaria(historia.get('numeroNotaria', '')) if historia.get('numeroNotaria') else '',
            'canton_notaria': historia.get('cantonNotaria', ''),
            'notario': historia.get('notario', ''),
            'fecha_inscripcion': formatear_fecha_notarial(historia.get('fechaInscripcion', '')) if historia.get('fechaInscripcion') else '',
            'canton_inscripcion': historia.get('cantonInscripcion', ''),
            'mismo_canton': historia.get('cantonNotaria', '').lower() == historia.get('cantonInscripcion', '').lower() if historia.get('cantonNotaria') and historia.get('cantonInscripcion') else False,
            'es_sucesion': historia.get('titulo') == 'sucesion',
            'nombre_causante': historia.get('nombreCausante', ''),
            'causante_adquirido_de': historia.get('causanteAdquiridoDe', ''),
            'causante_titulo': historia.get('causanteTitulo', ''),
            'causante_titulo_otro': historia.get('causanteTituloOtro', ''),
            'causante_fecha_otorgamiento': formatear_fecha_notarial(historia.get('causanteFechaOtorgamiento', '')) if historia.get('causanteFechaOtorgamiento') else '',
            'causante_numero_notaria': historia.get('causanteNumeroNotaria', ''),
            'causante_numero_notaria_palabras': numero_a_ordinal_notaria(historia.get('causanteNumeroNotaria', '')) if historia.get('causanteNumeroNotaria') else '',
            'causante_canton_notaria': historia.get('causanteCantonNotaria', ''),
            'causante_notario': historia.get('causanteNotario', ''),
            'causante_fecha_inscripcion': formatear_fecha_notarial(historia.get('causanteFechaInscripcion', '')) if historia.get('causanteFechaInscripcion') else '',
            'causante_canton_inscripcion': historia.get('causanteCantonInscripcion', ''),
            'causante_mismo_canton': historia.get('causanteCantonNotaria', '').lower() == historia.get('causanteCantonInscripcion', '').lower() if historia.get('causanteCantonNotaria') and historia.get('causanteCantonInscripcion') else False,
        }
        
        # Procesar aclaratorias
        context['historia']['aclaratorias'] = procesar_aclaratorias_historia(historia.get('aclaratorias', []))
    
    # ============================================
    # DECLARATORIA (solo horizontal)
    # ============================================
    if context['es_horizontal']:
        if data.get('modoDeclaratoria') == 'redactar':
            context['declaratoria_manual'] = True
            context['declaratoria_texto'] = limpiar_html(data.get('declaratoriaManual', ''))
        else:
            context['declaratoria_manual'] = False
            declaratoria = data.get('declaratoriaFormulario', {})
            
            context['declaratoria'] = {
                'fecha_otorgamiento': formatear_fecha_notarial(declaratoria.get('fechaOtorgamiento', '')) if declaratoria.get('fechaOtorgamiento') else '',
                'numero_notaria': declaratoria.get('numeroNotaria', ''),
                'numero_notaria_palabras': numero_a_ordinal_notaria(declaratoria.get('numeroNotaria', '')) if declaratoria.get('numeroNotaria') else '',
                'canton_notaria': declaratoria.get('cantonNotaria', ''),
                'notario': declaratoria.get('notario', ''),
                'fecha_inscripcion': formatear_fecha_notarial(declaratoria.get('fechaInscripcion', '')) if declaratoria.get('fechaInscripcion') else '',
                'canton_inscripcion': declaratoria.get('cantonInscripcion', ''),
                'mismo_canton': declaratoria.get('cantonNotaria', '').lower() == declaratoria.get('cantonInscripcion', '').lower() if declaratoria.get('cantonNotaria') and declaratoria.get('cantonInscripcion') else False,
            }
            
            # Procesar aclaratorias
            context['declaratoria']['aclaratorias'] = procesar_aclaratorias_declaratoria(declaratoria.get('aclaratorias', []))
    
    # ============================================
    # LINDEROS GENERALES
    # ============================================
    linderos_generales = data.get('linderosGenerales', {})
    context['linderos'] = procesar_linderos(linderos_generales, incluir_arriba_abajo=False)
    
    # ============================================
    # LINDEROS ESPECÍFICOS (solo horizontal)
    # ============================================
    context['tiene_linderos_especificos'] = False
    
    if context['es_horizontal'] and data.get('tieneLInderosEspecificos'):
        context['tiene_linderos_especificos'] = True
        linderos_especificos = data.get('linderosEspecificos', {})
        context['linderos_especificos'] = procesar_linderos(linderos_especificos, incluir_arriba_abajo=True)
    
    # ============================================
    # OBJETO DEL CONTRATO
    # ============================================
    if data.get('modoSujeto') == 'manual':
        context['sujeto_manual'] = True
        context['sujeto_texto'] = limpiar_html(data.get('sujetoManual', ''))
    else:
        context['sujeto_manual'] = False
    
    # ============================================
    # PRECIO Y FORMA DE PAGO
    # ============================================
    if data.get('modoPrecio') == 'manual':
        context['precio_manual'] = True
        context['precio_texto'] = limpiar_html(data.get('precioManual', ''))
    else:
        context['precio_manual'] = False
        precio_total = data.get('precioTotal', 0)
        
        context['precio'] = {
            'total': precio_total,
            'total_palabras': numero_a_letras(float(precio_total)).upper() if precio_total else '',
            'partes': []
        }
        
        partes_pago = data.get('partesPago', [])
        for parte in partes_pago:
            monto = parte.get('monto', 0)
            
            parte_data = {
                'letra': parte.get('letra', ''),
                'monto': monto,
                'monto_palabras': numero_a_letras(float(monto)) if monto else '',
                'es_cuotas': parte.get('tipoPago') == 'cuotas',
                'medio_pago': parte.get('medioPago', ''),
                'tipo_cheque': parte.get('tipoCheque', ''),
                'momento_pago': parte.get('momentoPago', ''),
                'momento_otro': parte.get('momentoOtro', ''),
                'es_credito': parte.get('esCreditoBancario', False),
                'nombre_banco': parte.get('nombreBanco', ''),
                'cuenta_destino': parte.get('cuentaDestino', ''),
            }
            
            if parte_data['es_cuotas']:
                numero_cuotas = parte.get('numeroCuotas', 0)
                valor_cuota = parte.get('valorCuota', 0)
                periodicidad = parte.get('periodicidad', '')
                
                parte_data['numero_cuotas'] = numero_cuotas
                parte_data['numero_cuotas_palabras'] = numero_a_letras(int(numero_cuotas)) if numero_cuotas else ''
                parte_data['valor_cuota'] = valor_cuota
                parte_data['valor_cuota_palabras'] = numero_a_letras(float(valor_cuota)) if valor_cuota else ''
                parte_data['periodicidad'] = periodicidad if periodicidad != 'otro' else parte.get('periodicidadOtra', '')
            
            # NUEVO: Detalle de transferencia/depósito
            if parte.get('tieneDetalle'):
                detalle = parte.get('detalle', {})
                parte_data['tiene_detalle'] = True
                parte_data['detalle'] = {
                    'banco_origen': detalle.get('bancoOrigen', ''),
                    'cuenta_origen': detalle.get('cuentaOrigen', ''),
                    'tipo_cuenta_origen': detalle.get('tipoCuentaOrigen', ''),
                    'banco_destino': detalle.get('bancoDestino', ''),
                    'cuenta_destino': detalle.get('cuentaDestino', ''),
                    'tipo_cuenta_destino': detalle.get('tipoCuentaDestino', ''),
                }
            else:
                parte_data['tiene_detalle'] = False
            
            context['precio']['partes'].append(parte_data)
    
    # ============================================
    # ADMINISTRADOR (solo horizontal)
    # ============================================
    if context['es_horizontal']:
        context['hay_administrador'] = data.get('hayAdministrador', False)
    
    # ============================================
    # ABOGADO
    # ============================================
    abogado = data.get('abogado', {})
    context['abogado'] = {
        'nombre': abogado.get('nombre', ''),
        'numero_matricula': abogado.get('numeroMatricula', ''),
        'tipo_matricula': abogado.get('tipoMatricula', 'cj'),
        'provincia': abogado.get('provincia', ''),
    }
    
    # ============================================
    # RENDERIZAR DOCUMENTO
    # ============================================
    doc.render(context)
    
    # Guardar en BytesIO
    file_stream = BytesIO()
    doc.save(file_stream)
    file_stream.seek(0)
    
    return file_stream