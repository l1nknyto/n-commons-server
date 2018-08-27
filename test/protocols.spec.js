var assert = require('assert');
var expect = require('chai').expect;
var should = require('chai').should();

const Protocols = require('../protocols');

it('test override protocols instance', function() {
  Protocols.init({
    DATA_NOT_FOUND : { ok: false, errCode: 2001, message: 'Data not found' }
  });
  Protocols.should.have.nested.property('DATA_NOT_FOUND.ok').equal(false);
  Protocols.should.have.nested.property('DATA_NOT_FOUND.errCode').equal(2001);
  Protocols.should.have.nested.property('DATA_NOT_FOUND.message').equal('Data not found');
});

// it('test getUpdateSqlBindings', function() {
//   var testOptions = Object.assign({
//     useReturning : false,
//     where        : [['field2', 'value2-where', '=', 'OR']]
//   }, options);
//   var result = PgUtils.getUpdateSqlBindings(table, testOptions, data);
//   result.should.have.property('sql').equal('UPDATE tablename SET field2=$1 WHERE field1=$2 OR field2=$3');
//   result.should.have.property('params').to.have.length(3);
//   result.should.have.property('params').to.deep.equal(['value2', 'value1', 'value2-where']);
// });