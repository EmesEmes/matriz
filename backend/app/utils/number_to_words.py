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
        parte_entera = int(n)
        # Manejar hasta 10 decimales
        parte_decimal = round((n - parte_entera) * 10000000000)
        
        if parte_decimal == 0:
            return numero_a_letras(parte_entera)
        
        # Convertir parte decimal a dígitos
        parte_decimal_str = str(parte_decimal).rstrip('0')
        digitos_decimales = numero_a_digitos(parte_decimal_str)
        
        return f"{numero_a_letras(parte_entera)} coma {digitos_decimales}"
    
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