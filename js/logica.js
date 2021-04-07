function ejemplo() {
    /* 
    Valores variables
    uTransferencia = Unidad	máxima de transferencia de la red - La MTU de Ethernet es 1500 bytes por frame: Cuadro de texto
    ltDatagrama    = Longitud total del datagrama, incluyendo encabezado y datos (en bytes): Cuadro de texto
    ipProtocolo    = Protocolo de	nivel superior: Botón de radio: ICMP, TCP, UDP
    dirIpOrigen    = Dirección IP	origen:	Cuadro de texto en notación decimal.
    dirIpDestino   = Dirección IP	destino: Cuadro de texto en notación decimal.
    */
    uTransferencia = 0
    ltDatagrama = 0
    ipProtocolo = ""
    dirIpOrigen = ""
    dirIpDestino = ""

    /* 
    Valores Fijos:
    Versión	del	datagrama: 4
    Longitud del encabezado: 5 (se asume que el encabezado	del	datagrama será de longitudfija:	5 words de 32 bits).
    Servicios diferenciados: 0

    Valores fijos aleatorios
    numIdentificacion = Número de identificación: Valor entre 0 y 65.535.
    tiempovida        = Tiempo de vida: Valor entre 0 y 255
    */

    // Retorna un número aleatorio entre min (incluido) y max (excluido)
    // La función floor, redondea números decimales
    numIdentificacion = Math.floor(Math.random() * (65536 + 1))
    tiempovida = Math.floor(Math.random() * (256 + 1))
    console.log("Num ide:  ", numIdentificacion, " tiempovida: ", tiempovida)

    /*
    Valores a calcular:
    La longitud de cada fragmento.
    Los flags.
    El desplazamiento.
    La suma de comprobación en el origen
    */

    /*
    Orden final :
    0100 0101 00000000
    45-00-ltDatagrama-[numIdentificacion]-flags-dezplazamiento-[tiempovida]-ipProtocolo-sumadecomprobación-dirIpOrigen-dirIpDestino
    */
}
/**
 * Metodo que divide un Frame deacuerdo a la cantidad de mtu que se necesite
 * @param {int} mtu Es el número maximo de tranferencia
 * @param {int} ltDatagrama La longitud total del datagrama
 * @param {int} numIdentificacion Es el numero de identificación del datagrama
 * @param {int} tiempovida El tiempo de vida del datagrama
 * @param {int} ipProtocolo El protocooo ip del datagrama
 * @param {int} dirIpOrigen La dirección de origen del datagrama
 * @param {int} dirIpDestino Es la dirección ip destino
 */
function dividirFrame(mtu,ltDatagrama,numIdentificacion,tiempovida,ipProtocolo,dirIpOrigen,dirIpDestino){
    //Se crea el arreglo donde se vana contener todos los Datagramas
    frameTotales = []
    aux = 0
    //Para calcular el desplazamiento
    despAux = 0
    //Cuantas veces esta (mtu-20 del encabezado) en la longitud del datagrama, se redondea en caso de no ser entero
    //Condireación (Aún falta mirar los casos en el que los decimales de la división este por encia de 0.5)
    limite = Math.trunc(ltDatagrama/(mtu-20))
    //Se define var ya que el parametro i se utiliza en diferentes partes del progama, javascript lo tomoa igual si no se usa var
    var i = 1
    //Se verifica si la logitud del datagrama 
    if(ltDatagrama > (mtu-20)){
        
        while ( i <= limite ) {
            //Se crea un frame por la cantidad maxima que puede contener el datagrama, teniendo en cuenta las banderas
            //En este caso, es cuando el limite fue aproximado, el caso donde limite es exacto no es soportado aún           
            frameTotales.push(armarFrame(mtu,numIdentificacion,0,1,despAux,tiempovida,ipProtocolo,dirIpOrigen,dirIpDestino))          
            i = 1 + i
            //Se calcula el dezplazamiento deacuerdo al anterior frame
            despAux = (mtu-20)*i
        }
        
        //Se calcula el valor restante necesitado para completar el frame
        aux = (ltDatagrama - (despAux-(mtu-20)))
        frameTotales.push(armarFrame(aux+20,numIdentificacion,0,0,despAux,tiempovida,ipProtocolo,dirIpOrigen,dirIpDestino))

    }else{
        //En caso de que no sea necesario agregar mas de 1 frame
        frameTotales.push(armarFrame(ltDatagrama,numIdentificacion,1,0,despAux,tiempovida,ipProtocolo,dirIpOrigen,dirIpDestino))                       
    }
    console.log(frameTotales)
}
/**
 * Metodo que estructura un Frame dado los atributos del mismo en decimal
 * @param {Decimal} ltDatagrama La longitud de datagrama
 * @param {Decimal} numIdentificacion Numero de indentificación del datagrama
 * @param {Decimal} df Bandera don't fragment 
 * @param {Decimal} mf Bandera More fragment
 * @param {Decimal} desplazamiento Desplazamiento del datagrama
 * @param {Decimal} tiempovida Tiempo de Vida del datagrama
 * @param {Decimal} ipProtocolo Protocolo ip usado por el datagrama
 * @param {Decimal} dirIpOrigen Dirección ip origen del datagrama
 * @param {Decimal} dirIpDestino Dirección ip destino del datagrama
 * @returns {String} Una cadena con la información obtenida en hexadecimal y binario
 */
function armarFrame(ltDatagrama,numIdentificacion,df,mf,desplazamiento,tiempovida,ipProtocolo,dirIpOrigen,dirIpDestino){
    frameHexa = "45-00"
    frameBinario = "01000101-00000000"

// Longitud del datagrama - 16 bits - 4 hexa 
    ltDatagramaHex = ltDatagrama.toString(16)
    ltDatagramaBin = ltDatagrama.toString(2)
    console.log("Desde el programa inicio : ",ltDatagrama)
    // console.log("Frame Hexa : ",ltDatagramaHex, " Frame Binario : ", ltDatagramaBin)
    // Cada que hace una tranformación en base n, los 0 a la izquiera son ignorados, por eso, se deben agregar a mano 
    if (ltDatagramaHex.length < 4) {
        ltDatagramaHex = agregarDigitoFaltante(ltDatagramaHex,4-ltDatagramaHex.length)
    }
    if (ltDatagramaBin.length < 16) {
        ltDatagramaBin = agregarDigitoFaltante(ltDatagramaBin,16-ltDatagramaBin.length)
    }

    frameHexa += "-" + ltDatagramaHex
    frameBinario += "-" + ltDatagramaBin

// Identificación: 16 bits - 4 hexa 
    numIdentificacionHex = numIdentificacion.toString(16)
    numIdentificacionBin = numIdentificacion.toString(2)

    if (numIdentificacionHex.length < 4) {
        numIdentificacionHex = agregarDigitoFaltante(numIdentificacionHex,4-numIdentificacionHex.length)
    }
    if (numIdentificacionBin.length < 16) {
        numIdentificacionBin = agregarDigitoFaltante(numIdentificacionBin,16-numIdentificacionBin.length)
    }

    frameHexa += "-" + numIdentificacionHex
    frameBinario += "-" + numIdentificacionBin
    
// Flags    0dfmf + desplazamiento 
    //En esta caso, la fragmentación y demas vienen desde afuera, y primero se debe hacer la parte binaria
    flags = "0"+df+mf
    desplazamientoBin = desplazamiento.toString(2)

    if (desplazamientoBin.length < 13) {
        desplazamientoBin = agregarDigitoFaltante(desplazamientoBin,13-desplazamientoBin.length)
    }

    desplazamientoBin = flags + desplazamientoBin
    //Con la parte binaria completa, ahora si se puede pasar a Hexa
    desplazamientoHex = parseInt(desplazamientoBin,2).toString(16)

    if (desplazamientoHex.length < 4) {
        desplazamientoHex = agregarDigitoFaltante(desplazamientoHex,4-desplazamientoHex.length)
    }

    frameHexa += "-" + desplazamientoHex
    frameBinario += "-" + desplazamientoBin
    
// Tiempo de vida
    tiempovidaHex = tiempovida.toString(16)
    tiempovidaBin = tiempovida.toString(2)

    if (tiempovidaHex.length < 2) {
        tiempovidaHex = agregarDigitoFaltante(tiempovidaHex,2-tiempovidaHex.length)
    }
    if (tiempovidaBin.length < 8) {
        tiempovidaBin = agregarDigitoFaltante(tiempovidaBin,8-tiempovidaBin.length)
    }

    frameHexa += "-" + tiempovidaHex
    frameBinario += "-" + tiempovidaBin

// Protocolo
    ipProtocoloHex = ipProtocolo.toString(16)
    ipProtocoloBin = ipProtocolo.toString(2)

    if (ipProtocoloHex.length < 2) {
        ipProtocoloHex = agregarDigitoFaltante(ipProtocoloHex,2-ipProtocoloHex.length)
    }
    if (ipProtocoloBin.length < 8) {
        ipProtocoloBin = agregarDigitoFaltante(ipProtocoloBin,8-ipProtocoloBin.length)
    }

    frameHexa += "-" + ipProtocoloHex
    frameBinario += "-" + ipProtocoloBin

// Dirección ip origen 
    dirIpOrigenHex = dirIpOrigen.toString(16)
    dirIpOrigenBin = dirIpOrigen.toString(2)

    if (dirIpOrigenHex.length < 8) {
        dirIpOrigenHex = agregarDigitoFaltante(dirIpOrigenHex,8-dirIpOrigenHex.length)
    }
    if (dirIpOrigenBin.length < 32) {
        dirIpOrigenBin = agregarDigitoFaltante(dirIpOrigenBin,32-dirIpOrigenBin.length)
    }

// Dirección ip destino 
    dirIpDestinoHex = dirIpDestino.toString(16)
    dirIpDestinoBin = dirIpDestino.toString(2)

    if (dirIpDestinoHex.length < 8) {
        dirIpDestinoHex = agregarDigitoFaltante(dirIpDestinoHex,8-dirIpDestinoHex.length)
    }
    if (dirIpDestinoBin.length < 32) {
        dirIpDestinoBin = agregarDigitoFaltante(dirIpDestinoBin,32-dirIpDestinoBin.length)
    }

    sumaComprobacion = encontrarSumaComprobacion(frameHexa+dirIpOrigenHex+dirIpDestinoHex)
    frameHexa += "-" + sumaComprobacion
    frameBinario+= "-"+ parseInt(sumaComprobacion,16).toString(16)

    frameHexa += "-" + dirIpOrigenHex + "-" + dirIpDestinoHex
    frameBinario += "-" + dirIpOrigenBin + "-" + dirIpDestinoBin
    
    //console.log("Frame Hexa : ",frameHexa, " Frame Binario : ", frameBinario)
    return frameHexa+":"+frameBinario
}

/**
 * Metodo que agrega ceros a la izquierda a una cadena, n o "limite" veces
 * @param {*} cadena Es el String que se le piensa agregar los 0
 * @param {*} limite Es el número de 0 a agregar a la izquierda de cadena
 * @returns El binario con la cantidad de ceros que necesitaba
 */
function agregarDigitoFaltante(cadena,limite){
    
    for (let i = 0; i < limite; i++) {
        cadena = "0" + cadena
    }

    return cadena
}
/**
 * Metodo que calcula la suma de comprobación  y lo retorna en binario
 * @param {String(16)} cabecera Es la cadena de numeros hexadecimales para realializar la suma de comprobacion
 * @returns La suma de comprobación en hexadecimal
 */
function encontrarSumaComprobacion(cabecera) {

    /* 
    El siguiente cadena de numeros es un ejemplo de como se espera que sea cabecera
    los numeros de arriba indican el indice donde estan parados y como en toda cabecera,
    su total de digitos hexadecimales son 20 pares
    01 23 45 67 89 1011 ...       20  23                        39
    45 00 02 24 cc 34 00 b9 40 01 [24 da] c0 a8 02 e3 c0 a8 02 de
    */
    i = 0
    suma = ""
    hexa = ""
    hexb = ""

    // Se realiza la primera suma de los dos primeros cuartetos de hexadecimales
    //Se extrae el primer grupo de 4 digitos hexadecimales
    hexa = cabecera.substring(i, i + 4)
    i += 4
    //Se extrae el siguiente grupo de 4 digitos hexadecimales
    hexb = cabecera.substring(i, i + 4)
    suma = sumarHexadecimal(hexa, hexb)
    
    //Se traslada el indice hasta el siguiente grupo
    i += 4
    while (i < cabecera.length) {
        /* Se verifica si el resultado de dicha suma tiene mas de 4 digitos hexadecimales*/
        if (suma.length > 4) {
            /* Se obtiene el sobrante y se suma con los demas digitos */
            hexb = suma.substring(0, 1)
            suma = suma.substring(1, suma.length)
            suma = sumarHexadecimal(suma, hexb)
        } else {
            /* Se obtiene los siguientes 4 digitos hexadecimales */
            hexb = cabecera.substring(i, i + 4)
            suma = sumarHexadecimal(suma, hexb)
            i += 4
        }
    //console.log(suma," B  : ", hexb )
    }

    // Se rectifica si hay mas de 4 digitos exadecimales    
    if (suma.length > 4) {
        //Se obtiene el sobrante y se suma con los demas digitos 
        hexb = suma.substring(0, 2)
        suma = suma.substring(1, suma.length)
        suma = sumarHexadecimal(suma, hexb)
    }
    //Se realiza la resta para encontrar la suma de comprobación
    suma = restarHexadecimal("FFFF",suma)

    return suma;
}
/**
 * Metodo que dados dos grupos de numeros hexadecimales los suma
 * @param {String(16)} hexa Es el primer grupo de 4 hexadecimales que se desea sumar
 * @param {String(16)} hexb Es el segundo grupo de 4 hexadecimales que se desea sumar
 * @returns La suma de los dos hexadecimales en String(16)
 */
function sumarHexadecimal(hexa, hexb) {
    //Transformar a hexadecimal
    hexaValor = parseInt(hexa, 16)
    hexbValor = parseInt(hexb, 16)

    //Suma de numeros en hexadecimales
    hexaTotal = hexaValor + hexbValor
    hexaTotal = hexaTotal.toString(16)
    return hexaTotal
}
/**
* Metodo que dados dos grupos de numeros hexadecimales los resta
* @param {String(16)} hexa Es el primer grupo de 4 hexadecimales que se desea restar
* @param {String(16)} hexb Es el segundo grupo de 4 hexadecimales que se desea restar
* @returns La resta de los dos hexadecimales en String(16)
*/
function restarHexadecimal(hexa, hexb) {
    //Transformar a hexadecimal
    hexaValor = parseInt(hexa, 16);
    hexbValor = parseInt(hexb, 16);

    //Suma de numeros en hexadecimales
    hexaTotal = hexaValor - hexbValor;
    hexaTotal = hexaTotal.toString(16);
    return hexaTotal
}
//ejemplo()
/*
sumaComrobacion= encontrarSumaComprobacion("45000224cc3400b94001c0a802e3c0a802de")
console.log(sumaComrobacion)
*/

//ltDatagrama,numIdentificacion,df,mf,desplazamiento,tiempovida,ipProtocolo,dirIpOrigen,dirIpDestino
//armarFrame(548,52276,0,0,185,64,1,3232236259,3232236254)

//mtu,ltDatagrama,numIdentificacion,tiempovida,ipProtocolo,dirIpOrigen,dirIpDestino
dividirFrame(1500,5000,0,64,1,3232236259,3232236254)

/*
frameHexa = "0A"
frameBin = "01010"
frameBinario = parseInt(frameHexa,16).toString(2)
frameHexadecimal = parseInt(frameBin,2).toString(16)
console.log(frameBinario, " Hexa ",frameHexadecimal)
*/