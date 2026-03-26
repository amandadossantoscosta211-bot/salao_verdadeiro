import express from 'express';
import knex from 'knex';

const app = express();
app.use(express.json());

// CONFIG BANCO
const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'salao_db'
  }
});

// =============================
// CONFIGURAÇÕES DE NEGÓCIO
// =============================
const LIMITE_AGENDAMENTOS_DIA = 5;
const DATA_INICIO = '2026-01-01';
const DATA_FIM = '2026-12-31';

// =============================
// MODELOS (CLIENTES)
// =============================

// CREATE
app.post('/modelos', async (req, res) => {
  const { nome, telefone, senha } = req.body;

  const id = await db('modelo').insert({
    nome,
    telefone,
    senha,
    data_cadastro: new Date()
  });

  res.json({ id });
});

// READ
app.get('/modelos', async (req, res) => {
  const dados = await db('modelo');
  res.json(dados);
});

// UPDATE
app.put('/modelos/:id', async (req, res) => {
  const { id } = req.params;

  await db('modelo')
    .where({ id_modelo_pk: id })
    .update({
      ...req.body,
      data_atualizacao: new Date()
    });

  res.json({ mensagem: 'Atualizado' });
});

// DELETE
app.delete('/modelos/:id', async (req, res) => {
  const { id } = req.params;

  await db('modelo')
    .where({ id_modelo_pk: id })
    .del();

  res.json({ mensagem: 'Deletado' });
});

// =============================
// FORMULÁRIO CLÍNICO
// =============================

app.post('/formulario', async (req, res) => {
  const dados = req.body;

  await db('formulario_clinico').insert({
    ...dados,
    data_atualizacao: new Date()
  });

  res.json({ mensagem: 'Formulário criado' });
});

app.get('/formulario/:modelo', async (req, res) => {
  const { modelo } = req.params;

  const dados = await db('formulario_clinico')
    .where({ id_modelo_fk: modelo });

  res.json(dados);
});

app.put('/formulario/:id', async (req, res) => {
  const { id } = req.params;

  await db('formulario_clinico')
    .where({ id_formulario_pk: id })
    .update({
      ...req.body,
      data_atualizacao: new Date()
    });

  res.json({ mensagem: 'Atualizado' });
});

// =============================
// SERVIÇOS
// =============================

app.post('/servicos', async (req, res) => {
  const dados = req.body;
  await db('servicos').insert(dados);
  res.json({ mensagem: 'Serviço criado' });
});

app.get('/servicos', async (req, res) => {
  const dados = await db('servicos');
  res.json(dados);
});

// =============================
// FAQ
// =============================

app.get('/faq', async (req, res) => {
  const dados = await db('perguntas_frequentes');
  res.json(dados);
});

// =============================
// AGENDAMENTO
// =============================

// CREATE COM REGRAS
app.post('/agendamento', async (req, res) => {
  const {
    id_modelo_fk,
    id_servico_fk,
    data_agendamento,
    horario_agendamento
  } = req.body;

  // Regra 1: período permitido
  if (data_agendamento < DATA_INICIO || data_agendamento > DATA_FIM) {
    return res.status(400).json({ erro: 'Fora do período permitido' });
  }

  // Regra 2: limite por dia
  const total = await db('agendamento')
    .where({ data_agendamento })
    .count('id_agendamento_pk as total');

  if (total[0].total >= LIMITE_AGENDAMENTOS_DIA) {
    return res.status(400).json({ erro: 'Limite de agendamentos atingido' });
  }

  await db('agendamento').insert({
    id_modelo_fk,
    id_servico_fk,
    data_agendamento,
    horario_agendamento,
    status_agendamento: true
  });

  res.json({ mensagem: 'Agendado com sucesso' });
});

// LISTA SIMPLES
app.get('/agendamentos', async (req, res) => {
  const dados = await db('agendamento');
  res.json(dados);
});

// LISTA AVANÇADA (JOIN)
app.get('/agendamentos-detalhado', async (req, res) => {
  const dados = await db('agendamento')
    .join('modelo', 'agendamento.id_modelo_fk', 'modelo.id_modelo_pk')
    .join('servicos', 'agendamento.id_servico_fk', 'servicos.id_servico_pk')
    .select(
      'agendamento.*',
      'modelo.nome',
      'servicos.nome_servico'
    );

  res.json(dados);
});

// FILTRO POR DATA
app.get('/agendamentos/data/:data', async (req, res) => {
  const { data } = req.params;

  const dados = await db('agendamento')
    .where({ data_agendamento: data });

  res.json(dados);
});

// UPDATE STATUS
app.put('/agendamento/:id', async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  console.log('ID:', id);
  console.log('BODY:', dados);

  if (!dados || Object.keys(dados).length === 0) {
    return res.status(400).json({ erro: 'Body vazio para atualização' });
  }

  await db('agendamento')
    .where({ id_agendamento_pk: id })
    .update(dados);

  res.json({ mensagem: 'Atualizado' });
});

// DELETE
app.delete('/agendamento/:id', async (req, res) => {
  const { id } = req.params;

  await db('agendamento')
    .where({ id_agendamento_pk: id })
    .del();

  res.json({ mensagem: 'Deletado' });
});

// =============================
// SERVER
// =============================

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
