from docxtpl import DocxTemplate
from datetime import datetime
import os
from app.utils.number_to_words import numero_a_letras
from app.utils.html_to_richtext import html_to_richtext

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


def build_minuta_context(data: dict, current_user) -> dict:
    """
    Construir el contexto para la plantilla de minuta
    """
    context = {}
    
    # ============================================
    # 1. COMPARECIENTES - VENDEDORES
    # ============================================
    vendedores = data.get('vendedores', [])
    context['vendedores'] = []
    
    for idx, v in enumerate(vendedores, start=1):
        vendedor = {
            'numero': numero_a_letras(idx),
            'nombres_completos': f"{v.get('names', '')} {v.get('lastNames', '')}".upper(),
            'nacionalidad': v.get('nationality', 'ecuatoriana'),
            'cedula': v.get('documentNumber', ''),
            'cedula_palabras': numero_a_letras(v.get('documentNumber', '')),
            'edad': numero_a_letras(v.get('age', 0)),
            'edad_numeros': v.get('age', 0),
            'profesion': v.get('profession', ''),
            'ocupacion': v.get('occupation', ''),
            'telefono': v.get('phone', ''),
            'telefono_palabras': numero_a_letras(v.get('phone', '').replace('+', '')),
            'email': v.get('email', ''),
            'direccion': v.get('address', '')
        }
        context['vendedores'].append(vendedor)
    
    context['num_vendedores'] = len(vendedores)
    context['vendedores_plural'] = len(vendedores) > 1
    
    # ============================================
    # 2. COMPARECIENTES - COMPRADORES
    # ============================================
    compradores = data.get('compradores', [])
    context['compradores'] = []
    
    for idx, c in enumerate(compradores, start=1):
        comprador = {
            'numero': numero_a_letras(len(vendedores) + idx),
            'nombres_completos': f"{c.get('names', '')} {c.get('lastNames', '')}".upper(),
            'nacionalidad': c.get('nationality', 'ecuatoriana'),
            'cedula': c.get('documentNumber', ''),
            'cedula_palabras': numero_a_letras(c.get('documentNumber', '')),
            'edad': numero_a_letras(c.get('age', 0)),
            'edad_numeros': c.get('age', 0),
            'profesion': c.get('profession', ''),
            'ocupacion': c.get('occupation', ''),
            'telefono': c.get('phone', ''),
            'telefono_palabras': numero_a_letras(c.get('phone', '').replace('+', '')),
            'email': c.get('email', ''),
            'direccion': c.get('address', '')
        }
        context['compradores'].append(comprador)
    
    context['num_compradores'] = len(compradores)
    context['compradores_plural'] = len(compradores) > 1
    
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
            'causante_canton_inscripcion': historia.get('causanteCantonInscripcion', '')
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
                'canton_inscripcion': declaratoria.get('cantonInscripcion', '')
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