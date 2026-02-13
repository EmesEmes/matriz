from docxtpl import DocxTemplate
from datetime import datetime
import os
from app.utils.html_to_richtext import html_to_richtext
from app.utils.number_to_words import numero_a_letras, numero_a_digitos, calcular_edad

def generate_minuta_compraventa(data: dict, current_user) -> str:
    """
    Genera una minuta de compraventa de inmueble
    """
    try:
        # Ruta de la plantilla
        template_path = os.path.join(
            os.path.dirname(__file__),
            '..',
            'templates',
            'minuta_compraventa.docx'
        )
        
        if not os.path.exists(template_path):
            raise FileNotFoundError(f"Plantilla no encontrada: {template_path}")
        
        # Cargar plantilla
        doc = DocxTemplate(template_path)
        
        # Construir contexto
        context = build_minuta_context(data, current_user)
        
        # Renderizar documento
        doc.render(context)
        
        # Guardar documento
        output_dir = os.path.join(os.path.dirname(__file__), '..', 'generated_documents')
        os.makedirs(output_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        output_filename = f'minuta_compraventa_{timestamp}.docx'
        output_path = os.path.join(output_dir, output_filename)
        
        doc.save(output_path)
        
        print(f"✅ Minuta generada exitosamente: {output_path}")
        return output_path
        
    except Exception as e:
        print(f"❌ Error generando minuta: {str(e)}")
        raise e

def agrupar_por_conyuges(personas):
    """
    Agrupa personas por cónyuges y solteros
    Retorna lista de grupos: [{'tipo': 'conyuges'/'soltero', 'personas': [...]}]
    """
    procesados = set()
    grupos = []
    
    for idx, persona in enumerate(personas):
        if idx in procesados:
            continue
        
        # Si está casado, buscar su cónyuge
        if persona.get('maritalStatus') == 'casado' and persona.get('partner'):
            # Buscar el cónyuge en la lista
            conyuge_idx = None
            for j, otra_persona in enumerate(personas):
                if j != idx and otra_persona.get('documentNumber') == persona.get('partner', {}).get('documentNumber'):
                    conyuge_idx = j
                    break
            
            if conyuge_idx is not None:
                # Encontró cónyuge, agrupar
                grupos.append({
                    'tipo': 'conyuges',
                    'personas': [persona, personas[conyuge_idx]]
                })
                procesados.add(idx)
                procesados.add(conyuge_idx)
            else:
                # No encontró cónyuge, tratar como soltero
                grupos.append({
                    'tipo': 'soltero',
                    'personas': [persona]
                })
                procesados.add(idx)
        else:
            # Soltero o sin pareja
            grupos.append({
                'tipo': 'soltero',
                'personas': [persona]
            })
            procesados.add(idx)
    
    return grupos

def build_minuta_context(data: dict, current_user) -> dict:
    """
    Construir el contexto para la plantilla de minuta
    """
    context = {}
    
    # ============================================
    # 1. COMPARECIENTES - VENDEDORES
    # ============================================
    vendedores = data.get('vendedores', [])
    grupos_vendedores = agrupar_por_conyuges(vendedores)

    context['grupos_vendedores'] = []
    contador_global = 1

    for grupo in grupos_vendedores:
        grupo_data = {
            'tipo': grupo['tipo'],  # 'conyuges' o 'soltero'
            'personas': []
        }
        
        # Construir dirección (la misma para el grupo)
        primera_persona = grupo['personas'][0]
        direccion_partes = []
        
        if primera_persona.get('mainStreet'):
            direccion_partes.append(primera_persona.get('mainStreet'))
        
        if primera_persona.get('numberStreet'):
            if direccion_partes:
                direccion_partes[-1] += f" {primera_persona.get('numberStreet')}"
            else:
                direccion_partes.append(primera_persona.get('numberStreet'))
        
        if primera_persona.get('secondaryStreet'):
            if direccion_partes:
                direccion_partes.append(f"y {primera_persona.get('secondaryStreet')}")
            else:
                direccion_partes.append(primera_persona.get('secondaryStreet'))
        
        if primera_persona.get('sector'):
            direccion_partes.append(primera_persona.get('sector'))
        
        if primera_persona.get('parroquia'):
            direccion_partes.append(f"Parroquia {primera_persona.get('parroquia')}")
        
        if primera_persona.get('canton'):
            direccion_partes.append(f"cantón {primera_persona.get('canton')}")
        
        direccion_completa = ", ".join(direccion_partes) if direccion_partes else "Sin dirección registrada"
        grupo_data['direccion'] = direccion_completa
        
        # Procesar cada persona del grupo
        for persona in grupo['personas']:
            persona_data = {
                'numero': numero_a_letras(contador_global),
                'numero_numerico': contador_global,
                'nombres_completos': f"{persona.get('names', '')} {persona.get('lastNames', '')}".upper().strip(),
                'nacionalidad': persona.get('nationality', 'ecuatoriana'),
                'estado_civil': persona.get('maritalStatus', 'soltero'),
                'cedula': persona.get('documentNumber', ''),
                'cedula_palabras': numero_a_digitos(persona.get('documentNumber', '')),
                'edad': numero_a_letras(calcular_edad(persona.get('birthDate', ''))),
                'edad_numeros': calcular_edad(persona.get('birthDate', '')),
                'profesion': persona.get('profession', ''),
                'ocupacion': persona.get('occupation', ''),
                'telefono': persona.get('phone', ''),
                'telefono_palabras': numero_a_digitos(persona.get('phone', '').replace('+', '').replace(' ', '').replace('-', '')),
                'email': persona.get('email', '')
            }
            grupo_data['personas'].append(persona_data)
            contador_global += 1
        
        context['grupos_vendedores'].append(grupo_data)

    context['num_vendedores'] = len(vendedores)

    # ============================================
    # 2. COMPARECIENTES - COMPRADORES
    # ============================================
    compradores = data.get('compradores', [])
    grupos_compradores = agrupar_por_conyuges(compradores)

    context['grupos_compradores'] = []

    for grupo in grupos_compradores:
        grupo_data = {
            'tipo': grupo['tipo'],
            'personas': []
        }
        
        # Construir dirección (la misma para el grupo)
        primera_persona = grupo['personas'][0]
        direccion_partes = []
        
        if primera_persona.get('mainStreet'):
            direccion_partes.append(primera_persona.get('mainStreet'))
        
        if primera_persona.get('numberStreet'):
            if direccion_partes:
                direccion_partes[-1] += f" {primera_persona.get('numberStreet')}"
            else:
                direccion_partes.append(primera_persona.get('numberStreet'))
        
        if primera_persona.get('secondaryStreet'):
            if direccion_partes:
                direccion_partes.append(f"y {primera_persona.get('secondaryStreet')}")
            else:
                direccion_partes.append(primera_persona.get('secondaryStreet'))
        
        if primera_persona.get('sector'):
            direccion_partes.append(primera_persona.get('sector'))
        
        if primera_persona.get('parroquia'):
            direccion_partes.append(f"Parroquia {primera_persona.get('parroquia')}")
        
        if primera_persona.get('canton'):
            direccion_partes.append(f"cantón {primera_persona.get('canton')}")
        
        direccion_completa = ", ".join(direccion_partes) if direccion_partes else "Sin dirección registrada"
        grupo_data['direccion'] = direccion_completa
        
        # Procesar cada persona del grupo
        for persona in grupo['personas']:
            persona_data = {
                'numero': numero_a_letras(contador_global),
                'numero_numerico': contador_global,
                'nombres_completos': f"{persona.get('names', '')} {persona.get('lastNames', '')}".upper().strip(),
                'nacionalidad': persona.get('nationality', 'ecuatoriana'),
                'estado_civil': persona.get('maritalStatus', 'soltero'),
                'cedula': persona.get('documentNumber', ''),
                'cedula_palabras': numero_a_digitos(persona.get('documentNumber', '')),
                'edad': numero_a_letras(calcular_edad(persona.get('birthDate', ''))),
                'edad_numeros': calcular_edad(persona.get('birthDate', '')),
                'profesion': persona.get('profession', ''),
                'ocupacion': persona.get('occupation', ''),
                'telefono': persona.get('phone', ''),
                'telefono_palabras': numero_a_digitos(persona.get('phone', '').replace('+', '').replace(' ', '').replace('-', '')),
                'email': persona.get('email', '')
            }
            grupo_data['personas'].append(persona_data)
            contador_global += 1
        
        context['grupos_compradores'].append(grupo_data)

    context['num_compradores'] = len(compradores) 
    # ============================================
    # 3. ANTECEDENTES - TIPO DE PROPIEDAD
    # ============================================
    context['tipo_propiedad'] = data.get('tipoPropiedad', '')
    context['es_horizontal'] = data.get('tipoPropiedad') == 'horizontal'
    context['es_comun'] = data.get('tipoPropiedad') == 'comun'
    context['nombre_conjunto'] = data.get('nombreConjunto', '').upper()
    
    # ============================================
    # 4. ANTECEDENTES - PREDIOS (HORIZONTAL)
    # ============================================
    if context['es_horizontal']:
        predios = data.get('predios', [])
        context['predios'] = []
        
        for predio in predios:
            predio_data = {
                'es_compuesto': predio.get('esCompuesto', False),
                'tipo': predio.get('tipo', ''),
                'tipo_otro': predio.get('tipoOtro', ''),
                'numero': predio.get('numero', ''),
                'numero_palabras': numero_a_letras(predio.get('numero', '')),
                'inmuebles': [],
                'alicuota_total': predio.get('alicuotaTotalManual') if predio.get('usarAlicuotaManual') else predio.get('alicuotaTotal', 0),
                'alicuota_total_palabras': numero_a_letras(
                    str(predio.get('alicuotaTotalManual') if predio.get('usarAlicuotaManual') else predio.get('alicuotaTotal', 0))
                )
            }
            
            # Procesar inmuebles
            for inmueble in predio.get('inmuebles', []):
                inmueble_data = {
                    'tipo': inmueble.get('tipo', ''),
                    'tipo_otro': inmueble.get('tipoOtro', ''),
                    'nivel': inmueble.get('nivel', ''),
                    'area_cubierta': inmueble.get('areaCubierta', ''),
                    'area_cubierta_palabras': numero_a_letras(inmueble.get('areaCubierta', '')),
                    'area_descubierta': inmueble.get('areaDescubierta', ''),
                    'area_descubierta_palabras': numero_a_letras(inmueble.get('areaDescubierta', '')),
                    'alicuota_parcial': inmueble.get('alicuotaParcial', ''),
                    'alicuota_parcial_palabras': numero_a_letras(inmueble.get('alicuotaParcial', ''))
                }
                predio_data['inmuebles'].append(inmueble_data)
            
            context['predios'].append(predio_data)
    
    # ============================================
    # 5. ANTECEDENTES - BIEN COMÚN
    # ============================================
    if context['es_comun']:
        bien_comun = data.get('bienComun', {})
        context['bien_comun'] = {
            'tipo': bien_comun.get('tipoBienComun', ''),
            'tipo_otro': bien_comun.get('tipoBienComunOtro', ''),
            'superficie': bien_comun.get('superficieBienComun', ''),
            'superficie_palabras': numero_a_letras(bien_comun.get('superficieBienComun', '')),
            'numero_predio': bien_comun.get('numeroPredio', ''),
            'descripcion': bien_comun.get('descripcionBienComun', '')
        }
    
    # ============================================
    # 6. UBICACIÓN (CONSTRUIDO EN)
    # ============================================
    ubicacion = data.get('ubicacion', {})
    context['ubicacion'] = {
        'lote': ubicacion.get('lote', ''),
        'numero': ubicacion.get('numero', ''),
        'parroquia': ubicacion.get('parroquia', ''),
        'canton': ubicacion.get('canton', ''),
        'provincia': ubicacion.get('provincia', '')
    }
    
    # ============================================
    # 7. HISTORIA DE DOMINIO
    # ============================================
    modo_historia = data.get('modoHistoria', 'formulario')
    context['historia_manual'] = modo_historia == 'redactar'
    
    if modo_historia == 'redactar':
        historia_html = data.get('historiaManual', '')
        context['historia_texto'] = html_to_richtext(historia_html) if historia_html else ''
    else:
        historia = data.get('historiaFormulario', {})
        context['historia'] = {
            'titulo': historia.get('titulo', ''),
            'titulo_otro': historia.get('tituloOtro', ''),
            'tipo_sucesion': historia.get('tipoSucesion', ''),
            'adquirido_de': historia.get('adquiridoDe', ''),
            'fecha_otorgamiento': formato_fecha(historia.get('fechaOtorgamiento', '')),
            'numero_notaria': historia.get('numeroNotaria', ''),
            'canton_notaria': historia.get('cantonNotaria', ''),
            'notario': historia.get('notario', ''),
            'fecha_inscripcion': formato_fecha(historia.get('fechaInscripcion', '')),
            'canton_inscripcion': historia.get('cantonInscripcion', ''),
            'mismo_canton': historia.get('cantonNotaria', '').lower() == historia.get('cantonInscripcion', '').lower(),
            
            # Datos del causante (si es sucesión)
            'es_sucesion': historia.get('titulo') == 'sucesion',
            'nombre_causante': historia.get('nombreCausante', ''),
            'causante_adquirido_de': historia.get('causanteAdquiridoDe', ''),
            'causante_titulo': historia.get('causanteTitulo', ''),
            'causante_titulo_otro': historia.get('causanteTituloOtro', ''),
            'causante_fecha_otorgamiento': formato_fecha(historia.get('causanteFechaOtorgamiento', '')),
            'causante_numero_notaria': historia.get('causanteNumeroNotaria', ''),
            'causante_canton_notaria': historia.get('causanteCantonNotaria', ''),
            'causante_notario': historia.get('causanteNotario', ''),
            'causante_fecha_inscripcion': formato_fecha(historia.get('causanteFechaInscripcion', '')),
            'causante_canton_inscripcion': historia.get('causanteCantonInscripcion', ''),
            'causante_mismo_canton': historia.get('causanteCantonNotaria', '').lower() == historia.get('causanteCantonInscripcion', '').lower(),
        }
    
    # ============================================
    # 8. DECLARATORIA DE PROPIEDAD HORIZONTAL
    # ============================================
    if context['es_horizontal']:
        modo_declaratoria = data.get('modoDeclaratoria', 'formulario')
        context['declaratoria_manual'] = modo_declaratoria == 'redactar'
        
        if modo_declaratoria == 'redactar':
            declaratoria_html = data.get('declaratoriaManual', '')
            context['declaratoria_texto'] = html_to_richtext(declaratoria_html) if declaratoria_html else ''
        else:
            declaratoria = data.get('declaratoriaFormulario', {})
            context['declaratoria'] = {
                'fecha_otorgamiento': formato_fecha(declaratoria.get('fechaOtorgamiento', '')),
                'numero_notaria': declaratoria.get('numeroNotaria', ''),
                'canton_notaria': declaratoria.get('cantonNotaria', ''),
                'notario': declaratoria.get('notario', ''),
                'fecha_inscripcion': formato_fecha(declaratoria.get('fechaInscripcion', '')),
                'canton_inscripcion': declaratoria.get('cantonInscripcion', ''),
                'mismo_canton': declaratoria.get('cantonNotaria', '').lower() == declaratoria.get('cantonInscripcion', '').lower(),
            }
    
    # ============================================
    # 9. LINDEROS GENERALES
    # ============================================
    linderos = data.get('linderosGenerales', {})
    context['linderos'] = {
        'norte_metros': linderos.get('norte', {}).get('metros', ''),
        'norte_metros_palabras': numero_a_letras(linderos.get('norte', {}).get('metros', '')),
        'norte_colindancia': linderos.get('norte', {}).get('colindancia', ''),
        
        'sur_metros': linderos.get('sur', {}).get('metros', ''),
        'sur_metros_palabras': numero_a_letras(linderos.get('sur', {}).get('metros', '')),
        'sur_colindancia': linderos.get('sur', {}).get('colindancia', ''),
        
        'este_metros': linderos.get('este', {}).get('metros', ''),
        'este_metros_palabras': numero_a_letras(linderos.get('este', {}).get('metros', '')),
        'este_colindancia': linderos.get('este', {}).get('colindancia', ''),
        
        'oeste_metros': linderos.get('oeste', {}).get('metros', ''),
        'oeste_metros_palabras': numero_a_letras(linderos.get('oeste', {}).get('metros', '')),
        'oeste_colindancia': linderos.get('oeste', {}).get('colindancia', ''),
        
        'superficie': linderos.get('superficie', ''),
        'superficie_palabras': numero_a_letras(linderos.get('superficie', ''))
    }
    
    # LINDEROS ESPECÍFICOS (solo si es horizontal y están habilitados)
    context['tiene_linderos_especificos'] = data.get('tieneLInderosEspecificos', False)

    if context['es_horizontal'] and context['tiene_linderos_especificos']:
        linderos_esp = data.get('linderosEspecificos', {})
        context['linderos_especificos'] = {
            'norte_metros': linderos_esp.get('norte', {}).get('metros', ''),
            'norte_metros_palabras': numero_a_letras(linderos_esp.get('norte', {}).get('metros', '')),
            'norte_colindancia': linderos_esp.get('norte', {}).get('colindancia', ''),
            
            'sur_metros': linderos_esp.get('sur', {}).get('metros', ''),
            'sur_metros_palabras': numero_a_letras(linderos_esp.get('sur', {}).get('metros', '')),
            'sur_colindancia': linderos_esp.get('sur', {}).get('colindancia', ''),
            
            'este_metros': linderos_esp.get('este', {}).get('metros', ''),
            'este_metros_palabras': numero_a_letras(linderos_esp.get('este', {}).get('metros', '')),
            'este_colindancia': linderos_esp.get('este', {}).get('colindancia', ''),
            
            'oeste_metros': linderos_esp.get('oeste', {}).get('metros', ''),
            'oeste_metros_palabras': numero_a_letras(linderos_esp.get('oeste', {}).get('metros', '')),
            'oeste_colindancia': linderos_esp.get('oeste', {}).get('colindancia', ''),
            
            'arriba_metros': linderos_esp.get('arriba', {}).get('metros', ''),
            'arriba_metros_palabras': numero_a_letras(linderos_esp.get('arriba', {}).get('metros', '')),
            'arriba_colindancia': linderos_esp.get('arriba', {}).get('colindancia', ''),
            
            'abajo_metros': linderos_esp.get('abajo', {}).get('metros', ''),
            'abajo_metros_palabras': numero_a_letras(linderos_esp.get('abajo', {}).get('metros', '')),
            'abajo_colindancia': linderos_esp.get('abajo', {}).get('colindancia', ''),
            
            'superficie': linderos_esp.get('superficie', ''),
            'superficie_palabras': numero_a_letras(linderos_esp.get('superficie', ''))
        }
    
    # ============================================
    # 10. OBJETO DEL CONTRATO
    # ============================================
    modo_sujeto = data.get('modoSujeto', 'auto')
    context['sujeto_manual'] = modo_sujeto == 'manual'
    
    if modo_sujeto == 'manual':
        sujeto_html = data.get('sujetoManual', '')
        context['sujeto_texto'] = html_to_richtext(sujeto_html) if sujeto_html else ''
    # Si es auto, la plantilla generará el texto con los datos
    
    # ============================================
    # 11. PRECIO Y FORMA DE PAGO
    # ============================================
    modo_precio = data.get('modoPrecio', 'formulario')
    context['precio_manual'] = modo_precio == 'manual'
    
    if modo_precio == 'manual':
        precio_html = data.get('precioManual', '')
        context['precio_texto'] = html_to_richtext(precio_html) if precio_html else ''
    else:
        precio_total = data.get('precioTotal', '0')
        context['precio'] = {
            'total': precio_total,
            'total_palabras': numero_a_letras(precio_total).upper(),
            'partes': []
        }
        
        partes_pago = data.get('partesPago', [])
        letras = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
        
        for idx, parte in enumerate(partes_pago):
            parte_data = {
                'letra': letras[idx] if idx < len(letras) else str(idx + 1),
                'monto': parte.get('monto', '0'),
                'monto_palabras': numero_a_letras(parte.get('monto', '0')).upper(),
                'tipo_pago': parte.get('tipoPago', 'unico'),
                'es_cuotas': parte.get('tipoPago') == 'cuotas',
                
                # Para pago único
                'medio_pago': parte.get('medioPago', ''),
                'tipo_cheque': parte.get('tipoCheque', ''),
                'momento_pago': parte.get('momentoPago', ''),
                'momento_otro': parte.get('momentoOtro', ''),
                
                # Para cuotas
                'numero_cuotas': parte.get('numeroCuotas', ''),
                'numero_cuotas_palabras': numero_a_letras(parte.get('numeroCuotas', '')),
                'valor_cuota': parte.get('valorCuota', 0),
                'valor_cuota_palabras': numero_a_letras(str(parte.get('valorCuota', 0))).upper(),
                'periodicidad': parte.get('periodicidad', ''),
                'periodicidad_otra': parte.get('periodicidadOtra', ''),
                
                # Crédito bancario
                'es_credito': parte.get('esCreditoBancario', False),
                'nombre_banco': parte.get('nombreBanco', ''),
                'cuenta_destino': parte.get('cuentaDestino', '')
            }
            context['precio']['partes'].append(parte_data)
    
    # ============================================
    # 12. ADMINISTRADOR
    # ============================================
    if context['es_horizontal']:
        context['hay_administrador'] = data.get('hayAdministrador', False)
    
    # ============================================
    # 13. ABOGADO
    # ============================================
    abogado = data.get('abogado', {})
    context['abogado'] = {
        'nombre': abogado.get('nombre', ''),
        'tipo_matricula': abogado.get('tipoMatricula', 'cj'),
        'provincia': abogado.get('provincia', ''),
        'numero_matricula': abogado.get('numeroMatricula', '')
    }
    
    return context


def formato_fecha(fecha_str: str) -> str:
    """
    Convierte fecha ISO (2026-02-15) a formato legible en español
    Ej: "quince de febrero del dos mil veintiséis"
    """
    if not fecha_str:
        return ''
    
    try:
        fecha = datetime.strptime(fecha_str, '%Y-%m-%d')
        
        meses = [
            '', 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ]
        
        dia = numero_a_letras(fecha.day)
        mes = meses[fecha.month]
        anio = numero_a_letras(fecha.year)
        
        return f"{dia} de {mes} del año {anio}"
        
    except Exception as e:
        print(f"Error formateando fecha {fecha_str}: {e}")
        return fecha_str