import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/lead.js';
function response(){return {statusCode:200,headers:{},setHeader(k,v){this.headers[k]=v;},status(v){this.statusCode=v;return this;},json(v){this.body=v;return this;}};}
const valid={name:'Pessoa Teste',company:'Empresa Teste',email:'pessoa@example.org',phone:'(11) 99999-9999',consent:true,website:''};
function setup(){process.env.FORM_TOKEN='token-secreto-de-teste';}
test('4 CTAs geram IDs e dados distintos via Apps Script sem expor segredo ao navegador', async()=>{
  setup();const types=[];
  globalThis.fetch=async(url,options)=>{
    assert.match(url,/^https:\/\/script\.google\.com\/macros\/s\//);
    assert.equal(options.headers['Content-Type'],'text/plain;charset=utf-8');
    const b=JSON.parse(options.body);
    assert.equal(b.token,'token-secreto-de-teste');
    assert.equal(b.nome,valid.name);assert.equal(b.empresa,valid.company);
    assert.equal(b.email,valid.email); assert.equal(b.celular,'+5511999999999');
    types.push(b.palestra);
    return {ok:true,json:async()=>({ok:true})};
  };
  for(const talk of ['1','2','3','4']){const res=response();await handler({method:'POST',body:{...valid,talk}},res);assert.equal(res.statusCode,200);assert.equal(res.body.ok,true);}
  assert.deepEqual(types,['1','2','3','4']);
});
test('dados inválidos não acionam e-mail',async()=>{setup();let calls=0;globalThis.fetch=async()=>{calls++;throw Error('not expected');};const res=response();await handler({method:'POST',body:{...valid,talk:'9'}},res);assert.equal(res.statusCode,400);assert.equal(calls,0);});
test('sem token não finge sucesso',async()=>{delete process.env.FORM_TOKEN;const res=response();await handler({method:'POST',body:{...valid,talk:'1'}},res);assert.equal(res.statusCode,503);assert.equal(res.body.ok,false);});
test('falha no Google é informada ao visitante',async()=>{setup();globalThis.fetch=async()=>({ok:true,json:async()=>({ok:false,erro:'Não autorizado'})});const res=response();await handler({method:'POST',body:{...valid,talk:'2'}},res);assert.equal(res.statusCode,502);assert.equal(res.body.ok,false);});
test('resposta HTML não pode ser interpretada como sucesso',async()=>{setup();globalThis.fetch=async()=>({ok:true,json:async()=>{throw new Error('HTML')}});const res=response();await handler({method:'POST',body:{...valid,talk:'3'}},res);assert.equal(res.statusCode,502);assert.equal(res.body.ok,false);});
