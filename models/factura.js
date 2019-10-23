var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

facturaSchema = new Schema({

    numero: { type: String, unique: true, required: [true, 'El numero de la factura es necesareo'] },
    fecha: { type: Date, required: [true, 'La fecha es necesarea'] },
    concepto: { type: String, required: [true, 'El concepto de la factura es necesareo'] },
    estado: { type: String, default: '5d8cdb09229611001792e3e1' },
    contrato: { type: String, required: [true, 'El contrato de la factura es necesareo'] },
    valor: { type: String, required: [true, 'El valor de la factura es necesareo'] },
    fecha_pago: { type: Date, required: [true, 'La fecha de pago de la factura es necesareo'] },
    valor_pagado: { type: String, required: [true, 'El valor pagado de la factura es necesareo'] },
    soporte: { type: String },
    fecha_limite_pago: { type: Date },
    valor_a_pagar: { type: String },
    mes: { type: String, required: [true, 'El mes de la factura es necesareo'] },
    ano: { type: String, required: [true, 'El ano de la factura es necesareo'] },
    radicado: { type: String },
    fecha_radicado: { type: Date },
    valor_amortizado: { type: String },
    observacion_factura: { type: String },
    fecha_anulada: { type: Date },
    motivo_anulada: { type: String },
    albaran: { type: String },

});


facturaSchema.plugin(uniqueValidator, { message: '{PATH} El numero del la factura debe ser unico' });

module.exports = mongoose.model('Factura', facturaSchema);