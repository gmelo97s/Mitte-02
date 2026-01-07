/**
 * Aplica máscara de telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const applyPhoneMask = (value: string): string => {
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '');
  
  // Limita a 11 dígitos (celular) ou 10 dígitos (fixo)
  const limitedNumbers = numbers.slice(0, 11);
  
  // Aplica a máscara
  if (limitedNumbers.length <= 2) {
    return limitedNumbers ? `(${limitedNumbers}` : '';
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 10) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 6)}-${limitedNumbers.slice(6)}`;
  } else {
    // Celular com 11 dígitos
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
  }
};

/**
 * Remove a máscara do telefone, retornando apenas números
 */
export const removePhoneMask = (value: string): string => {
  return value.replace(/\D/g, '');
};
