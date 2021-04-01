function ejemplo(){
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
    console.log("Num ide:  ", numIdentificacion , " tiempovida: ", tiempovida)

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
function encontrarSumaComprobacion(cabecera){

}
/**
 * Metodo que dados dos grupos de numeros hexadecimales los suma
 * @param {String(16)} hexa Es el primer grupo de 4 hexadecimales que se desea sumar
 * @param {String(16)} hexb Es el segundo grupo de 4 hexadecimales que se desea sumar
 * @returns La suma de los dos hexadecimales en String(16)
 */
function sumarHexadecimal(hexa, hexb){
    //Transformar a hexadecimal
    hexaValor = parseInt(hexa , 16);
    hexbValor = parseInt(hexb , 16);

    //Suma de numeros en hexadecimales
    hexaTotal = hexaValor + hexbValor;
    hexaTotal = hexaTotal.toString(16);
    return hexaTotal
}
//ejemplo()
sumarHexadecimal("B002","B002")