/**
 * @desc Función que construye y devuelve una función que permite
 * realizar un análisis léxico simple de un lenguaje especificado.
 * La especificación del lenguaje se realiza a través de un array de
 * pares  NombreDelToken - /regExpDelToken/.
 * @param {Aray} tokens Array de pares NombreDelToken - /regExpDelToken/.
 * @returns {Function} Función que puede realizar el análisis
 * léxico del lenguaje especificado.
 */
function buildLexer(tokens) {
  return function(stringChain) {
    const tokenNames = tokens.map(token => token[0]);
    if (tokenNames.indexOf('ERROR') !== -1) {
      throw new Error('Error. No se permite un token de tipo ERROR');
    }
    const tokenRegs = tokens.map(token => token[1]);

    /**
     * @desc Función que une un conjunto de expresiones regulares a través
     * de conjunciones.
     * @param {Array} regexps
     * @return {Regexp} Expresión regular formada por la aplicación de
     * conjunciones a las expresiones regulares que conforman el array "regexps". 
     */
    function buildOrRegexp(regexps) {
      const sources = regexps.map(regExp => regExp.source);
      const union = sources.join('|');
      return new RegExp(union, 'y');
    }

    /**
     * @desc Función que permite la creación de un token en forma de objeto JS.
     * @param {String} tokenType Tipo al que se asocia el token.
     * @param {String} tokenValue Valor que toma el token
     * @return {Object} Objecto que representa un token. Su estructura es la
     * siguiente: {type: tokenType, value: tokenValue}.
     */
    function makeTokenObject(tokenType, tokenValue) {
      return {
        type: tokenType,
        value: tokenValue,
      };
    }

    /**
     * @desc Función que comprueba si el tipo del token es operable. Esto es,
     * si no representa a algún elemento del lenguaje sin valor asociado.
     * Estos elementos son, en esencia, espacios y comentarios.
     * @param {String} tokenType Tipo del token a comprobar.
     * @return {Boolean} True si el token es operable. False en caso contrario.
     */
    function isTypeOperable(tokenType) {
      const tokenTypeUpper = tokenType.toUpperCase();
      if (tokenTypeUpper === 'WHITE' || tokenTypeUpper === 'COMMENT' ||
          tokenType === 'SINGLECOMMENT' || tokenType === 'SPACE') {
          return false;
      } else {
        return true;
      }
    }

    const orRegexp = buildOrRegexp(tokenRegs);
    const getToken = (m) => tokenNames.find(tn => typeof m[tn] !== 'undefined');
    let match;
    const result = [];
    let lastIndex;
    while (match = orRegexp.exec(stringChain)) {
      let tokenType = getToken(match.groups);
      lastIndex = orRegexp.lastIndex;
      if (isTypeOperable(tokenType)) {
        result.push(makeTokenObject(tokenType, match.groups[tokenType]));
      }
    }
    if (lastIndex !== stringChain.length) {
      result.push(makeTokenObject('ERROR', stringChain.substr(lastIndex)));
    }
    return result;
  };
}

module.exports.buildLexer = buildLexer;