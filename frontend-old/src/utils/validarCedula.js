export const validarCedula = (cedula) => {
      // // Para desarrollo, permitir cédulas de prueba que empiecen con '9999'
      // if (cedula.startsWith('9999')) {
      //   console.log('Permitiendo cédula de prueba:', cedula);
      //   return true;
      // }

      // Verificar que tenga 10 dígitos
      if (!/^\d{10}$/.test(cedula)) {
        return false;
      }

      // Obtener el dígito de la región (primeros dos dígitos)
      const regionDigit = parseInt(cedula.substring(0, 2));
      
      // Validar que la región exista
      if (regionDigit <= 0 || regionDigit > 24) {
        return false;
      }
      
      // Extraer el último dígito (dígito verificador)
      const lastDigit = parseInt(cedula.substring(9, 10));
      
      // Obtener los 9 primeros dígitos
      const digits = cedula.substring(0, 9).split('').map(digit => parseInt(digit));
      
      // Aplicar algoritmo para validar cédula ecuatoriana
      for (let i = 0; i < digits.length; i += 2) {
        let val = digits[i] * 2;
        if (val > 9) {
          val -= 9;
        }
        digits[i] = val;
      }
      
      // Sumar todos los dígitos procesados
      const total = digits.reduce((sum, digit) => sum + digit, 0);
      
      // Obtener el dígito verificador calculado
      const verificationDigit = total % 10 === 0 ? 0 : 10 - (total % 10);
      
      // Validar que el dígito verificador calculado sea igual al de la cédula
      return verificationDigit === lastDigit;
  }