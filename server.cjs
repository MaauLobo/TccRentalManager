const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
const port = 3000;
app.use(express.json());
app.use(cors());


const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'tcc_vue'
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
    return;
  }
  console.log('Conexão com o banco de dados estabelecida com sucesso!');
});

// Rota para cadastrar um cliente
app.post('/clientes', (req, res) => {

  const {  nomeCli, cpfCli, telCli, statusCli } = req.body;

  const sql = 'INSERT INTO clientes (cli_nome, cli_cpf, cli_tel, cli_status) VALUES (?, ?, ?, ?)';

  const values = [ nomeCli, cpfCli, telCli, statusCli ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao cadastrar o cliente' });
    } else {
      console.log('Cliente cadastrado com sucesso');
      res.status(200).json({ message: 'Cliente cadastrado com sucesso' });
    }
  });
});

// Rota GET para obter todos os clientes
app.get('/clientes', (req, res) => {
  const { cli_nome, cli_cpf, cli_tel, cli_status } = req.query;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM clientes',
    [cli_nome, cli_cpf, cli_tel, cli_status],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});

// Rota GET para obter um cliente específico pelo ID
app.get('/cliente/:id', (req, res) => {
  const id = req.params.id;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM clientes WHERE cli_codigo = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        if (results.length > 0) {
          res.json(results[0]);
        } else {
          res.status(404).json({ message: 'Cliente não encontrado' });
        }
      }
    }
  );
});

// Rota DELETE para excluir um cliente
app.delete('/deletarCliente/:id', (req, res) => {
  const id = req.params.id;
  
  // Consulta ao banco de dados
  connection.query(
    'delete from clientes where cli_codigo = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao excluir o cliente' });
      } else {
        console.log('Cliente excluído com sucesso');
        res.status(200).json({ message: 'Cliente excluído com sucesso' });
      }
    }
  );
});

// Rota PUT para editar um cliente
app.put('/editarCliente/:id', (req, res) => {
  const id = req.params.id;
  const { nomeCli, cpfCli, telCli, statusCli } = req.body;

  // Consulta ao banco de dados
  connection.query(
    'UPDATE clientes SET cli_nome = ?, cli_cpf = ?, cli_tel = ?, cli_status = ? WHERE cli_codigo = ?',
    [nomeCli, cpfCli, telCli, statusCli, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao editar o cliente' });
      } else {
        console.log('Cliente editado com sucesso');
        res.status(200).json({ message: 'Cliente editado com sucesso' });
      }
    }
  );
});


// Rota para cadastrar um funcionarrio
app.post('/funcionarios', (req, res) => {

  const {  nomeFunci, senhaFunci, statusFunci } = req.body;

  const sql = 'INSERT INTO funcionarios (funci_nome, funci_senha, funci_status) VALUES (?, ?, ?)';

  const values = [ nomeFunci, senhaFunci, statusFunci ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao cadastrar o funcionario' });
    } else {
      console.log('Funcionario cadastrado com sucesso');
      res.status(200).json({ message: 'Funcionario cadastrado com sucesso' });
    }
  });
});

// Rota GET para obter todos os funcionarios
app.get('/funcionarios', (req, res) => {
  const { funci_nome, funci_senha, funci_status } = req.query;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM funcionarios',
    [ funci_nome, funci_senha, funci_status ],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});

// Rota GET para obter um funcionario específico pelo ID
app.get('/funcionario/:id', (req, res) => {
  const id = req.params.id;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM funcionario WHERE funci_codigo = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        if (results.length > 0) {
          res.json(results[0]);
        } else {
          res.status(404).json({ message: 'Funcionario não encontrado' });
        }
      }
    }
  );
});

// Rota DELETE para excluir um cliente
app.delete('/deletarFuncionario/:id', (req, res) => {
  const id = req.params.id;
  
  // Consulta ao banco de dados
  connection.query(
    'delete from funcionarios where funci_codigo = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao excluir o funcionario' });
      } else {
        console.log('Funcionario excluído com sucesso');
        res.status(200).json({ message: 'Funcionario excluído com sucesso' });
      }
    }
  );
});

// Rota PUT para editar um funcionario
app.put('/editarFuncionario/:id', (req, res) => {
  const id = req.params.id;
  const { nomeFunci, senhaFunci, statusFunci } = req.body;

  // Consulta ao banco de dados
  connection.query(
    'UPDATE funcionarios SET funci_nome = ?, funci_senha = ?, funci_status = ? WHERE funci_codigo = ?',
    [nomeFunci, senhaFunci, statusFunci, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao editar o funcionario' });
      } else {
        console.log('Funcionario editado com sucesso');
        res.status(200).json({ message: 'Funcionario editado com sucesso' });
      }
    }
  );
});


// Rota para cadastrar um brinquedo
app.post('/brinquedos', (req, res) => {

  const {  modeloCar, tipoCar, corCar, statusCar } = req.body;

  const sql = 'INSERT INTO brinquedos (car_modelo, car_tipo, car_cor, car_status) VALUES (?, ?, ?, ?)';

  const values = [ modeloCar, tipoCar, corCar, statusCar ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao cadastrar o brinquedo' });
    } else {
      console.log('Brinquedo cadastrado com sucesso');
      res.status(200).json({ message: 'Brinquedo cadastrado com sucesso' });
    }
  });
});

// Rota GET para obter todos os brinquedos
app.get('/brinquedos', (req, res) => {
  const { car_modelo, car_tipo, car_cor, car_status } = req.query;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM brinquedos',
    [car_modelo, car_tipo, car_cor, car_status],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});

// Rota DELETE para excluir um carrinho
app.delete('/deletarBrinquedo/:id', (req, res) => {
  const id = req.params.id;
  
  // Consulta ao banco de dados
  connection.query(
    'delete from brinquedos where car_codigo = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao excluir o brinquedos' });
      } else {
        console.log('Brinquedo excluído com sucesso');
        res.status(200).json({ message: 'Brinquedo excluído com sucesso' });
      }
    }
  );
});

// Rota PUT para editar um brinquedo
app.put('/editarBrinquedo/:id', (req, res) => {
  const id = req.params.id;
  const { modeloCar, tipoCar, corCar, statusCar } = req.body;

  // Consulta ao banco de dados
  connection.query(
    'UPDATE brinquedos SET car_modelo = ?, car_tipo = ?, car_cor = ?, car_status = ? WHERE car_codigo = ?',
    [ modeloCar, tipoCar, corCar, statusCar, id ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao editar o brinquedo' });
      } else {
        console.log('Brinquedo editado com sucesso');
        res.status(200).json({ message: 'Brinquedo editado com sucesso' });
      }
    }
  );
});


// Rota para cadastrar um brinquedo
app.post('/formadepagamento', (req, res) => {

  const {  nomeForm, statusForm } = req.body;

  const sql = 'INSERT INTO formas_pag (formpag_nome, formpag_status) VALUES (?, ?)';

  const values = [ nomeForm, statusForm ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao cadastrar o brinquedo' });
    } else {
      console.log('Forma de Pagamento cadastrado com sucesso');
      res.status(200).json({ message: 'Forma de Pagamento cadastrado com sucesso' });
    }
  });
});

// Rota GET para obter todos os brinquedos
app.get('/formadepagamento', (req, res) => {
  const { formpag_nome, formpag_status } = req.query;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM formas_pag',
    [formpag_nome, formpag_status],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});

// Rota DELETE para excluir um carrinho
app.delete('/deletarformadepagamento/:id', (req, res) => {
  const id = req.params.id;
  
  // Consulta ao banco de dados
  connection.query(
    'delete from formas_pag where formpag_codigo = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao excluir a forma de pagamento' });
      } else {
        console.log('Forma de Pagamento excluída com sucesso');
        res.status(200).json({ message: 'Forma de Pagamento excluída com sucesso' });
      }
    }
  );
});

// Rota PUT para editar uma forma de pagamento
app.put('/editarformadepagamento/:id', (req, res) => {
  const id = req.params.id;
  const { nomeForm, statusForm } = req.body;

  // Consulta ao banco de dados
  connection.query(
    'UPDATE formas_pag SET formpag_nome = ?, formpag_status = ? WHERE formpag_codigo = ?',
    [ nomeForm, statusForm, id ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao editar a forma de pagamento' });
      } else {
        console.log('Forma de Pagamento editada com sucesso');
        res.status(200).json({ message: 'Forma de Pagamento editada com sucesso' });
      }
    }
  );
});


// Rota para cadastrar um aluguel
app.post('/alugueis', (req, res) => {

  const {  funciFkAlug, cliFkAlug, carFkAlug, tempoAlug, planoFkAlug, valorAlug, statusAlug } = req.body;

  const sql = 'INSERT INTO alugueis (funci_fk_alug, cli_fk_alug, car_fk_alug, alug_tempo, plano_fk_alug, alug_valor, alug_status) VALUES (?, ?, ?, ?, ?, ?, ?)';

  const values = [ funciFkAlug, cliFkAlug, carFkAlug, tempoAlug, planoFkAlug, valorAlug, statusAlug ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao iniciar o aluguel' });
    } else {
      console.log('Aluguel iniciado com sucesso');
      res.status(200).json({ message: 'Aluguel iniciado com sucesso' });
    }
  });
});

// Rota GET para obter todos os alugueis
app.get('/alugueis', (req, res) => {
  const { funci_fk_alug, cli_fk_alug, car_fk_alug, alug_tempo, plano_fk_alug, alug_valor, alug_status } = req.query;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM alugueis',
    [ funci_fk_alug, cli_fk_alug, car_fk_alug, alug_tempo, plano_fk_alug, alug_valor, alug_status ],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});

app.put('/editarAluguel/:id', (req, res) => {
  const id = req.params.id;
  const { funciFkAlug, cliFkAlug, carFkAlug, tempoAlug, planoFkAlug, valorAlug, statusAlug } = req.body;

  // Consulta ao banco de dados
  connection.query(
    'UPDATE alugueis SET funci_fk_alug = ?, cli_fk_alug = ?, car_fk_alug = ?, alug_tempo = ?, plano_fk_alug = ?, alug_valor = ?, alug_status = ?  WHERE alug_codigo = ?',
    [funciFkAlug, cliFkAlug, carFkAlug, tempoAlug, planoFkAlug, valorAlug, statusAlug, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao editar o plano' });
      } else {
        console.log('Plano editado com sucesso');
        res.status(200).json({ message: 'Plano editado com sucesso' });
      }
    }
  );
});


app.post('/recebimentos', (req, res) => {

  const {  recebFunci, recebCli, recebPagamento, recebValor, recebStatus } = req.body;

  const sql = 'INSERT INTO recebimentos (funci_fk_receb, cli_fk_receb, receb_pagamento_tipo, receb_valor, receb_status) VALUES (?, ?, ?, ?, ?)';

  const values = [ recebFunci, recebCli, recebPagamento, recebValor, recebStatus ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao iniciar o aluguel' });
    } else {
      console.log('Aluguel iniciado com sucesso');
      res.status(200).json({ message: 'Aluguel iniciado com sucesso' });
    }
  });
});
// Rota GET para obter todos os alugueis
app.get('/recebimentos', (req, res) => {
  const { funci_fk_receb, cli_fk_receb, receb_pagamento_tipo, receb_valor, receb_status, receb_data } = req.query;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM recebimentos',
    [ funci_fk_receb, cli_fk_receb, receb_pagamento_tipo, receb_valor, receb_status, receb_data ],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});



// Rota PUT para editar um brinquedo
app.put('/editarBrinquedo/:id', (req, res) => {
  const id = req.params.id;
  const { modeloCar, tipoCar, corCar, statusCar } = req.body;

  // Consulta ao banco de dados
  connection.query(
    'UPDATE brinquedos SET car_modelo = ?, car_tipo = ?, car_cor = ?, car_status = ? WHERE car_codigo = ?',
    [ modeloCar, tipoCar, corCar, statusCar, id ],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao editar o brinquedo' });
      } else {
        console.log('Brinquedo editado com sucesso');
        res.status(200).json({ message: 'Brinquedo editado com sucesso' });
      }
    }
  );
});


// Rota para cadastrar um cliente
app.post('/planos', (req, res) => {

  const {  nomePlano, tempoPlano, valorPlano, statusPlano } = req.body;

  const sql = 'INSERT INTO planos (plano_nome, plano_tempo, plano_valor, plano_status) VALUES (?, ?, ?, ?)';

  const values = [ nomePlano, tempoPlano, valorPlano, statusPlano ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao cadastrar o plano' });
    } else {
      console.log('Plano cadastrado com sucesso');
      res.status(200).json({ message: 'Plano cadastrado com sucesso' });
    }
  });
});

// Rota GET para obter todos os planos
app.get('/planos', (req, res) => {
  const { plano_nome, plano_tempo, plano_valor, plano_status } = req.query;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM planos',
    [plano_nome, plano_tempo, plano_valor, plano_status],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});

// Rota GET para obter um plano específico pelo ID
app.get('/plano/:id', (req, res) => {
  const id = req.params.id;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM planos WHERE plano_codigo = ?',
    [id],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        if (results.length > 0) {
          res.json(results[0]);
        } else {
          res.status(404).json({ message: 'Plano não encontrado' });
        }
      }
    }
  );
});

// Rota DELETE para excluir um plano
app.delete('/deletarPlano/:id', (req, res) => {
  const id = req.params.id;
  
  // Consulta ao banco de dados
  connection.query(
    'delete from planos where plano_codigo = ?',
    [id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao excluir o plano' });
      } else {
        console.log('Plano excluído com sucesso');
        res.status(200).json({ message: 'Plano excluído com sucesso' });
      }
    }
  );
});

// Rota PUT para editar um plano
app.put('/editarPlano/:id', (req, res) => {
  const id = req.params.id;
  const { nomePlano, tempoPlano, valorPlano, statusPlano } = req.body;

  // Consulta ao banco de dados
  connection.query(
    'UPDATE planos SET plano_nome = ?, plano_tempo = ?, plano_valor = ?, plano_status = ?  WHERE plano_codigo = ?',
    [nomePlano, tempoPlano, valorPlano, statusPlano, id],
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro ao editar o plano' });
      } else {
        console.log('Plano editado com sucesso');
        res.status(200).json({ message: 'Plano editado com sucesso' });
      }
    }
  );
});

// Rota para cadastrar um registro
app.post('/registros', (req, res) => {

  const {  usuario, descricao, status } = req.body;

  const sql = 'INSERT INTO historico (hist_usuario, hist_descricao, hist_status) VALUES (?, ?, ?)';

  const values = [ usuario, descricao, status ];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao enviar registro' });
    } else {
      console.log('Registro enviado com sucesso');
      res.status(200).json({ message: 'Registro enviado com sucesso' });
    }
  });
});

// Rota GET para obter todos os cregistros
app.get('/registros', (req, res) => {
  const { hist_usuario, hist_data, hist_descricao, hist_status } = req.query;

  // Consulta ao banco de dados
  connection.query(
    'SELECT * FROM historico',
    [ hist_usuario, hist_data, hist_descricao, hist_status ],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor' });
      } else {
        res.json(results);
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
