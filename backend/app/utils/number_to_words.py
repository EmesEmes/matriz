import re


def numero_a_digitos(numero):
    """
    Convierte número a dígitos en letras: 123 -> 'uno dos tres'
    Maneja strings y números
    """
    if not numero:
        return ""
    
    # Convertir a string y limpiar
    numero_str = str(numero).strip()
    
    unidades = [
        "cero", "uno", "dos", "tres", "cuatro", "cinco",
        "seis", "siete", "ocho", "nueve"
    ]
    
    # Convertir cada dígito
    digitos_letras = []
    for char in numero_str:
        if char.isdigit():
            digitos_letras.append(unidades[int(char)])
        elif char == '-':
            digitos_letras.append("guión")
    
    return " ".join(digitos_letras)


def numero_casa_a_letras(numero_str):
    """
    Convierte número de casa dígito por dígito: E13-51 → E uno tres guión cinco uno
    """
    if not numero_str:
        return ""
    
    numero_str = str(numero_str).strip()
    
    unidades = [
        "cero", "uno", "dos", "tres", "cuatro", "cinco",
        "seis", "siete", "ocho", "nueve"
    ]
    
    resultado = []
    for char in numero_str:
        if char.isdigit():
            resultado.append(unidades[int(char)])
        elif char == '-':
            resultado.append("guión")
        elif char.isalpha():
            resultado.append(char.upper())
    
    return " ".join(resultado)


def dia_mes_letras(n):
    """Convierte día/mes a letras (1-31)"""
    # Casos especiales para 20-29
    especiales_veinte = {
        20: "veinte",
        21: "veintiuno",
        22: "veintidós",
        23: "veintitrés",
        24: "veinticuatro",
        25: "veinticinco",
        26: "veintiséis",
        27: "veintisiete",
        28: "veintiocho",
        29: "veintinueve"
    }
    
    if n in especiales_veinte:
        return especiales_veinte[n]
    
    menores_veinte = [
        "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis",
        "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
        "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"
    ]
    
    if n < 20:
        return menores_veinte[n]
    if n == 30:
        return "treinta"
    if n == 31:
        return "treinta y uno"
    return ""


def numero_a_letras(n):
    """
    Convierte número a letras completo
    Maneja: int, float, str (con conversión automática)
    """
    # Manejar None, vacío o 0
    if n is None or n == "":
        return "cero"
    
    # Si es string, convertir a número
    if isinstance(n, str):
        try:
            n = n.strip().replace(',', '.')
            # Si tiene punto decimal, convertir a float
            if '.' in n:
                n = float(n)
            else:
                n = int(n)
        except (ValueError, AttributeError):
            print(f"⚠️ No se pudo convertir '{n}' a número, devolviendo como está")
            return str(n)
    
    # Manejar cero explícitamente
    if n == 0:
        return "cero"
    
    # Si es float, manejar parte decimal
    if isinstance(n, float):
        # Convertir a string para preservar los decimales exactos incluyendo ceros iniciales
        n_str = f"{n:.10f}".rstrip('0')  # hasta 10 decimales, quitar ceros finales
        if '.' not in n_str:
            return numero_a_letras(int(n))

        partes = n_str.split('.')
        parte_entera_str = partes[0]
        parte_decimal_str = partes[1]  # preserva "03", "012", etc.

        if not parte_decimal_str or int(parte_decimal_str) == 0:
            return numero_a_letras(int(n))

        # Convertir cada dígito decimal individualmente para preservar ceros iniciales
        digitos_decimales = numero_a_digitos(parte_decimal_str)

        return f"{numero_a_letras(int(parte_entera_str))} coma {digitos_decimales}"
    
    # Convertir a int para evitar problemas con comparaciones
    n = int(n)
    
    if n == 0:
        return "cero"
    
    # Casos especiales para 20-29
    especiales_veinte = {
        20: "veinte",
        21: "veintiuno",
        22: "veintidós",
        23: "veintitrés",
        24: "veinticuatro",
        25: "veinticinco",
        26: "veintidós",
        27: "veintisiete",
        28: "veintiocho",
        29: "veintinueve"
    }
    
    if n in especiales_veinte:
        return especiales_veinte[n]
    
    especiales = {
        30: "treinta", 40: "cuarenta", 50: "cincuenta",
        60: "sesenta", 70: "setenta", 80: "ochenta", 90: "noventa",
        100: "cien"
    }
    
    menores_veinte = [
        "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis",
        "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
        "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"
    ]
    
    if n < 20:
        return menores_veinte[n]
    
    if n in especiales:
        return especiales[n]
    
    if n < 100:
        decena = (n // 10) * 10
        unidad = n % 10
        return f"{especiales[decena]} y {numero_a_letras(unidad)}"
    
    if n < 200:
        resto = n - 100
        if resto == 0:
            return "cien"
        return f"ciento {numero_a_letras(resto)}"
    
    centenas = {
        200: "doscientos", 300: "trescientos", 400: "cuatrocientos",
        500: "quinientos", 600: "seiscientos", 700: "setecientos",
        800: "ochocientos", 900: "novecientos"
    }
    
    if n < 1000:
        centena = (n // 100) * 100
        resto = n % 100
        if resto == 0:
            return centenas[centena]
        return f"{centenas[centena]} {numero_a_letras(resto)}"
    
    if n < 2000:
        resto = n - 1000
        if resto == 0:
            return "mil"
        return f"mil {numero_a_letras(resto)}"
    
    if n < 1000000:
        miles = n // 1000
        resto = n % 1000
        if resto == 0:
            return f"{numero_a_letras(miles)} mil"
        return f"{numero_a_letras(miles)} mil {numero_a_letras(resto)}"
    
    if n < 2000000:
        resto = n - 1000000
        if resto == 0:
            return "un millón"
        return f"un millón {numero_a_letras(resto)}"
    
    millones = n // 1000000
    resto = n % 1000000
    if resto == 0:
        return f"{numero_a_letras(millones)} millones"
    return f"{numero_a_letras(millones)} millones {numero_a_letras(resto)}"


def numero_a_ordinal_notaria(numero):
    """
    Convierte número a ordinal femenino para notarías
    1 -> Primera, 2 -> Segunda, 14 -> Décimo Cuarta, 22 -> Vigésimo Segunda
    """
    if isinstance(numero, str):
        # Si viene como texto, intentar extraer el número
        import re
        match = re.search(r'\d+', numero)
        if match:
            numero = int(match.group())
        else:
            return numero  # Devolver como está si no tiene número
    
    numero = int(numero)
    
    # Ordinales especiales (1-19)
    ordinales_especiales = {
        1: "Primera", 2: "Segunda", 3: "Tercera", 4: "Cuarta", 5: "Quinta",
        6: "Sexta", 7: "Séptima", 8: "Octava", 9: "Novena", 10: "Décima",
        11: "Undécima", 12: "Duodécima", 13: "Décimo Tercera", 14: "Décimo Cuarta",
        15: "Décimo Quinta", 16: "Décimo Sexta", 17: "Décimo Séptima",
        18: "Décimo Octava", 19: "Décimo Novena"
    }
    
    if numero in ordinales_especiales:
        return ordinales_especiales[numero]
    
    # Para 20-99
    decenas = {
        20: "Vigésima", 30: "Trigésima", 40: "Cuadragésima", 50: "Quincuagésima",
        60: "Sexagésima", 70: "Septuagésima", 80: "Octogésima", 90: "Nonagésima"
    }
    
    unidades_ordinal = {
        1: "Primera", 2: "Segunda", 3: "Tercera", 4: "Cuarta", 5: "Quinta",
        6: "Sexta", 7: "Séptima", 8: "Octava", 9: "Novena"
    }
    
    if 20 <= numero < 100:
        decena = (numero // 10) * 10
        unidad = numero % 10
        
        if unidad == 0:
            return decenas[decena]
        else:
            return f"{decenas[decena].replace('a', 'o')} {unidades_ordinal[unidad]}"
    
    # Para números mayores a 99, usar formato "Notaría No. X"
    return f"Notaría No. {numero}"


def formatear_fecha_notarial(fecha_str):
    """
    Convierte fecha ISO (YYYY-MM-DD) a formato notarial
    Ejemplo: 2026-01-28 -> 'martes veinte y ocho de enero del año dos mil veinte y seis'
    """
    from datetime import datetime
    
    dias = [
        "lunes", "martes", "miércoles", "jueves",
        "viernes", "sábado", "domingo"
    ]
    
    meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ]
    
    fecha = datetime.strptime(fecha_str, "%Y-%m-%d")
    
    dia_semana = dias[fecha.weekday()]
    dia = dia_mes_letras(fecha.day)
    mes = meses[fecha.month - 1]
    anio = numero_a_letras(fecha.year)
    
    return f"{dia_semana} {dia} de {mes} del año {anio}"


def calcular_edad(fecha_nacimiento_str):
    """
    Calcula la edad a partir de fecha de nacimiento (formato YYYY-MM-DD)
    
    Args:
        fecha_nacimiento_str: Fecha en formato ISO (YYYY-MM-DD)
    
    Returns:
        int: Edad en años
    """
    if not fecha_nacimiento_str:
        return 0
    
    from datetime import datetime
    try:
        fecha_nacimiento = datetime.strptime(fecha_nacimiento_str, '%Y-%m-%d')
        hoy = datetime.now()
        edad = hoy.year - fecha_nacimiento.year
        # Ajustar si aún no ha cumplido años este año
        if (hoy.month, hoy.day) < (fecha_nacimiento.month, fecha_nacimiento.day):
            edad -= 1
        return edad
    except Exception as e:
        print(f"⚠️ Error calculando edad de '{fecha_nacimiento_str}': {e}")
        return 0


def convertir_numero_casa(numero_str):
    """
    Convierte número de casa/predio a palabras con el número entre paréntesis.
    Ej: 'E13-51' → 'E trece guión cincuenta y uno (E13-51)'
        '333A'   → 'trescientos treinta y tres A (333A)'
        '2b'     → 'dos b (2b)'
        '4'      → 'cuatro (4)'
    """
    if not numero_str:
        return ''
    s = str(numero_str).strip()

    # Patrón: letra(s) + número + guión + número (ej: E13-51, Oe4-23, S18-35)
    match_guion = re.match(r'^([A-Za-z]+)(\d+)-(\d+)$', s)
    if match_guion:
        letras = match_guion.group(1)
        n1 = int(match_guion.group(2))
        n2 = int(match_guion.group(3))
        palabras = f"{letras} {numero_a_letras(n1)} guión {numero_a_letras(n2)}"
        return f"{palabras} ({s})"

    # Patrón: número + letra(s) (ej: 333A, 2b)
    match_num_letra = re.match(r'^(\d+)([A-Za-z]+)$', s)
    if match_num_letra:
        n = int(match_num_letra.group(1))
        letras = match_num_letra.group(2)
        palabras = f"{numero_a_letras(n)} {letras}"
        return f"{palabras} ({s})"

    # Patrón: solo número (ej: 4, 99)
    if s.isdigit():
        return f"{numero_a_letras(int(s))} ({s})"

    # Sin patrón reconocido — devolver tal cual
    return s


def nivel_a_palabras(nivel_str):
    """
    Convierte notación de nivel arquitectónico a palabras notariales.
    Ej: 'n+3.00'  → 'N más tres punto cero cero (n+3.00)'
        'n-1.12'  → 'N menos uno punto uno dos (n-1.12)'
        'n+20,03' → 'N más veinte coma cero tres (n+20,03)'
        'PB'      → 'PB'
    """
    if not nivel_str:
        return ''
    nivel = str(nivel_str).strip()

    match = re.match(r'^([nN])([+\-])(\d+(?:[.,]\d+)?)$', nivel)
    if not match:
        return nivel

    letra = 'N'  # siempre mayúscula
    signo = 'más' if match.group(2) == '+' else 'menos'
    numero_raw = match.group(3)

    # Detectar si usa punto o coma como separador decimal
    if ',' in numero_raw:
        separador_palabra = 'coma'
        partes = numero_raw.split(',')
    elif '.' in numero_raw:
        separador_palabra = 'punto'
        partes = numero_raw.split('.')
    else:
        separador_palabra = None
        partes = [numero_raw]

    try:
        parte_entera = int(partes[0])
        palabras_entero = numero_a_letras(parte_entera)

        if separador_palabra and len(partes) > 1 and partes[1]:
            # Convertir cada dígito decimal individualmente para preservar ceros iniciales
            digitos_dec = ' '.join([numero_a_letras(int(d)) for d in partes[1]])
            palabras_num = f"{palabras_entero} {separador_palabra} {digitos_dec}"
        else:
            palabras_num = palabras_entero

        return f"{letra} {signo} {palabras_num} ({nivel})"
    except (ValueError, TypeError):
        return nivel


def formatear_dinero(monto):
    """
    Convierte monto a formato notarial completo.
    Ej: 50000 → 'CINCUENTA MIL DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA ($50.000,00 USD)'
    """
    if not monto and monto != 0:
        return ''
    try:
        num = float(str(monto))
        palabras = numero_a_letras(num).upper()
        num_fmt = f"{num:,.2f}".replace(',', 'X').replace('.', ',').replace('X', '.')
        return f"{palabras} DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA (${num_fmt} USD)"
    except (ValueError, TypeError):
        return str(monto)