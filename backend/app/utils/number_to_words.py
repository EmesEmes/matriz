def numero_a_digitos(numero):
    """Convierte número a dígitos en letras: 123 -> 'uno dos tres'"""
    unidades = [
        "cero", "uno", "dos", "tres", "cuatro", "cinco",
        "seis", "siete", "ocho", "nueve"
    ]
    return " ".join(unidades[int(d)] for d in str(numero) if d.isdigit())


def dia_mes_letras(n):
    """Convierte día/mes a letras (1-31)"""
    menores_veinte = [
        "cero", "uno", "dos", "tres", "cuatro", "cinco", "seis",
        "siete", "ocho", "nueve", "diez", "once", "doce", "trece",
        "catorce", "quince", "dieciséis", "diecisiete", "dieciocho", "diecinueve"
    ]
    
    if n < 20:
        return menores_veinte[n]
    if n <= 29:
        return f"veinte y {dia_mes_letras(n - 20)}"
    if n == 30:
        return "treinta"
    if n == 31:
        return "treinta y uno"
    return ""


def numero_a_letras(n):
    """Convierte número a letras completo"""
    if n == 0:
        return "cero"
    
    especiales = {
        20: "veinte", 30: "treinta", 40: "cuarenta", 50: "cincuenta",
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
    
    if n <= 29:
        return f"veinti{numero_a_letras(n - 20)}"
    
    if n in especiales:
        return especiales[n]
    
    if n < 100:
        decena = (n // 10) * 10
        unidad = n % 10
        return f"{especiales[decena]} y {numero_a_letras(unidad)}"
    
    if n < 200:
        resto = n - 100
        return f"ciento {numero_a_letras(resto)}".strip()
    
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